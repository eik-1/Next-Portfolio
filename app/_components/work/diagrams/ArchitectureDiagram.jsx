"use client"

import { AnimatePresence, motion } from "motion/react"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/app/_lib/cn"
import { ease } from "@/app/_lib/motion"
import { sound } from "@/app/_lib/sound"
import { useReducedMotion } from "@/app/_lib/useReducedMotion"

import { compile, hopPoints, measure, NODE_H, trace, WIDE_MIN } from "./layout"
import { SPECS } from "./specs"

const HOP_MS = 440 // per step, ease-out
const REST_MS = 300 // pause on each node
const ARM = 6 // viewfinder corner length
const GAP = 4 // viewfinder distance from the box
const outCubic = (t) => 1 - Math.pow(1 - t, 3)
const pad2 = (n) => String(n).padStart(2, "0")
const ctl =
    "grid h-7 w-7 place-items-center rounded-full text-soft transition-colors duration-[var(--duration-quick)] hover:bg-tile-2 hover:text-ink disabled:opacity-30"

function useWidth(ref) {
    const [w, setW] = useState(0)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const ro = new ResizeObserver(([e]) =>
            setW(Math.round(e.contentRect.width)),
        )
        ro.observe(el)
        return () => ro.disconnect()
    }, [ref])
    return w
}

/** Red corner marks around the box the request is at, like a camera finding focus. */
function Viewfinder({ box }) {
    const x0 = box.x - GAP
    const y0 = box.y - GAP
    const x1 = box.x + box.w + GAP
    const y1 = box.y + NODE_H + GAP
    const d = [
        `M${x0} ${y0 + ARM}V${y0}H${x0 + ARM}`,
        `M${x1 - ARM} ${y0}H${x1}V${y0 + ARM}`,
        `M${x1} ${y1 - ARM}V${y1}H${x1 - ARM}`,
        `M${x0 + ARM} ${y1}H${x0}V${y1 - ARM}`,
    ].join("")
    return (
        <path
            d={d}
            fill="none"
            stroke="var(--red)"
            strokeWidth="1.5"
            strokeLinecap="square"
        />
    )
}

/**
 * An architecture diagram you can play. Pick a flow and a red request travels
 * the system hop by hop, inking the path behind it, with a caption per step;
 * hover a box to see its job. Narrow screens scroll the diagram sideways inside
 * its tile (text never shrinks) and follow the request as it moves.
 */
export default function ArchitectureDiagram({ name, className }) {
    const spec = useMemo(() => compile(SPECS[name]), [name])
    const reduced = useReducedMotion()
    const wrap = useRef(null)
    const stage = useRef(null)
    const dot = useRef(null)
    const ink = useRef(null) // the hop being drawn right now
    const raf = useRef(0)
    const timer = useRef(0)
    const width = useWidth(wrap)
    const W = Math.max(width, WIDE_MIN)
    const geo = useMemo(
        () => (width ? measure(spec, W) : null),
        [spec, W, width],
    )

    const [flowIdx, setFlowIdx] = useState(0)
    const [step, setStep] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [hover, setHover] = useState(null)
    const flow = spec.flows[flowIdx]
    const last = flow.steps.length - 1
    const shown = reduced ? last : step

    // Each step's route as one smooth path; the request and its ink both follow it.
    const hops = useMemo(
        () =>
            geo
                ? flow.steps.map((s) =>
                      s.hop.length ? trace(hopPoints(geo, s.hop)) : null,
                  )
                : [],
        [geo, flow],
    )

    const clearInk = () => ink.current?.setAttribute("d", "")

    const stop = useCallback(() => {
        cancelAnimationFrame(raf.current)
        clearTimeout(timer.current)
        setPlaying(false)
    }, [])

    /**
     * Move the request along one hop while the ink draws in behind it, then call
     * done(). Writes straight to the two SVG nodes, so a hop never re-renders React.
     */
    const travel = useCallback(
        (s, done) => {
            const path = ink.current
            if (!path) return done()
            path.setAttribute("d", hops[s])
            const len = path.getTotalLength()
            path.setAttribute("stroke-dasharray", `${len} ${len}`)
            path.setAttribute("stroke-dashoffset", String(len))
            const t0 = performance.now()
            const frame = (now) => {
                const t = Math.min(1, (now - t0) / HOP_MS)
                const at = outCubic(t) * len
                const p = path.getPointAtLength(at)
                dot.current?.setAttribute(
                    "transform",
                    `translate(${p.x} ${p.y})`,
                )
                path.setAttribute("stroke-dashoffset", String(len - at))
                if (t < 1) raf.current = requestAnimationFrame(frame)
                else done()
            }
            raf.current = requestAnimationFrame(frame)
        },
        [hops],
    )

    const play = useCallback(
        (from = 0) => {
            if (!geo) return
            stop()
            if (reduced) return
            setPlaying(true)
            setStep(from)
            clearInk()
            const n = geo.nodes[flow.steps[from].at]
            dot.current?.setAttribute("transform", `translate(${n.cx} ${n.cy})`)
            const next = (s) => {
                if (s > last) {
                    setPlaying(false)
                    return
                }
                travel(s, () => {
                    setStep(s)
                    timer.current = setTimeout(() => next(s + 1), REST_MS)
                })
            }
            timer.current = setTimeout(() => next(from + 1), REST_MS)
        },
        [geo, flow, last, reduced, stop, travel],
    )

    // Play once when the diagram first scrolls into view.
    const played = useRef(false)
    useEffect(() => {
        const el = wrap.current
        if (!el || !geo) return
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting && !played.current) {
                    played.current = true
                    play(0)
                }
            },
            { threshold: 0.5 },
        )
        io.observe(el)
        return () => io.disconnect()
    }, [geo, play])

    useEffect(() => () => stop(), [stop])

    // A newly picked flow plays as soon as its hops are ready.
    const pending = useRef(false)
    useEffect(() => {
        if (!pending.current || !geo) return
        pending.current = false
        const id = requestAnimationFrame(() => play(0))
        return () => cancelAnimationFrame(id)
    }, [geo, play])

    const pick = (i) => {
        if (i === flowIdx) return play(0)
        sound.ui("tick")
        stop()
        clearInk()
        played.current = true
        pending.current = true
        setFlowIdx(i)
        setStep(0)
    }

    const jump = (s) => {
        stop()
        clearInk()
        setStep(Math.max(0, Math.min(last, s)))
    }
    const go = (d) => jump(shown + d)

    // On narrow screens the diagram scrolls sideways: keep the request in view.
    const current = flow.steps[shown]?.at
    useEffect(() => {
        const el = wrap.current
        const n = geo?.nodes[current]
        if (!el || !n || el.scrollWidth <= el.clientWidth) return
        const left = Math.max(
            0,
            Math.min(
                n.cx - el.clientWidth / 2,
                el.scrollWidth - el.clientWidth,
            ),
        )
        if (Math.abs(left - el.scrollLeft) > 24)
            el.scrollTo({ left, behavior: reduced ? "auto" : "smooth" })
    }, [current, geo, reduced])

    const onKey = (e) => {
        if (e.key === "ArrowRight") {
            e.preventDefault()
            go(1)
        } else if (e.key === "ArrowLeft") {
            e.preventDefault()
            go(-1)
        } else if (e.key === " " || e.key === "Enter") {
            e.preventDefault()
            play(0)
        }
    }

    // What's lit: the path travelled so far is inked red, the rest of the flow is ink, everything else dims.
    const doneEdges = new Set(
        flow.steps.slice(1, shown + 1).flatMap((s) => s.hop.map((h) => h.id)),
    )
    const flowEdges = new Set(flow.edges)
    const flowNodes = new Set(flow.steps.map((s) => s.at))
    const visited = new Set(flow.steps.slice(0, shown + 1).map((s) => s.at))
    const hoverEdges = hover
        ? new Set(
              spec.edges
                  .filter((e) => e.from === hover || e.to === hover)
                  .map((e) => e.id),
          )
        : null
    const hoverNear = hover
        ? new Set([
              hover,
              ...spec.edges
                  .filter((e) => e.from === hover || e.to === hover)
                  .flatMap((e) => [e.from, e.to]),
          ])
        : null

    const caption = flow.steps[shown]
    const hoverNode =
        hover && geo ? { ...geo.nodes[hover], ...spec.node[hover] } : null

    return (
        <figure className={cn("rounded-xl bg-tile p-3 sm:p-4", className)}>
            <div
                ref={wrap}
                tabIndex={0}
                onKeyDown={onKey}
                className="no-scrollbar relative overflow-x-auto overscroll-x-contain rounded-lg outline-offset-2"
                aria-label={`${spec.title}. Use arrow keys to step through the flow, Space to replay.`}
            >
                {geo && (
                    <div
                        ref={stage}
                        className="relative"
                        style={{ width: geo.width, height: geo.height }}
                    >
                        <svg
                            width={geo.width}
                            height={geo.height}
                            viewBox={`0 0 ${geo.width} ${geo.height}`}
                            role="img"
                            aria-label={`${spec.title}: ${spec.nodes.map((n) => n.label).join(", ")}.`}
                            className="block"
                        >
                            {geo.zones.map((z) => (
                                <g key={z.id}>
                                    <rect
                                        x={z.x}
                                        y={z.y}
                                        width={z.w}
                                        height={z.h}
                                        rx="12"
                                        fill="none"
                                        stroke="var(--line)"
                                        strokeDasharray="2 4"
                                    />
                                    <text
                                        x={z.x + 10}
                                        y={z.y + 17}
                                        className="fill-[var(--faint)] font-sans text-[11px]"
                                    >
                                        {z.label}
                                    </text>
                                </g>
                            ))}

                            {spec.edges.map((e) => {
                                const g = geo.edges[e.id]
                                const done = doneEdges.has(e.id)
                                const inFlow = flowEdges.has(e.id)
                                const hov = hoverEdges?.has(e.id)
                                const color =
                                    inFlow || hov
                                        ? "var(--ink)"
                                        : "var(--line-2)"
                                const op = hoverEdges
                                    ? hov
                                        ? 1
                                        : 0.25
                                    : inFlow
                                      ? 1
                                      : 0.35
                                return (
                                    <g
                                        key={e.id}
                                        style={{
                                            opacity: op,
                                            transition:
                                                "opacity 200ms var(--ease-standard)",
                                        }}
                                    >
                                        <path
                                            d={g.line}
                                            fill="none"
                                            stroke={color}
                                            strokeWidth="1"
                                            style={{
                                                transition: "stroke 200ms",
                                            }}
                                        />
                                        {g.head && (
                                            <path
                                                d={g.head}
                                                fill={
                                                    done ? "var(--red)" : color
                                                }
                                                style={{
                                                    transition: "fill 200ms",
                                                }}
                                            />
                                        )}
                                    </g>
                                )
                            })}

                            {/* the ink: every hop already travelled, plus the one being drawn */}
                            <g
                                fill="none"
                                stroke="var(--red)"
                                strokeWidth="1.75"
                                strokeLinejoin="round"
                                style={{
                                    opacity: hover ? 0.35 : 1,
                                    transition: "opacity 200ms",
                                }}
                            >
                                {hops.slice(1, shown + 1).map((d, i) => (
                                    <path key={`${flow.id}-${i}`} d={d} />
                                ))}
                                {!reduced && <path ref={ink} />}
                            </g>

                            {spec.nodes.map((n) => {
                                const b = geo.nodes[n.id]
                                const inFlow = flowNodes.has(n.id)
                                const isCur = n.id === current
                                const dim = hoverNear
                                    ? !hoverNear.has(n.id)
                                    : !inFlow
                                return (
                                    <g
                                        key={n.id}
                                        onPointerEnter={(e) =>
                                            e.pointerType === "mouse" &&
                                            setHover(n.id)
                                        }
                                        onPointerLeave={(e) =>
                                            e.pointerType === "mouse" &&
                                            setHover(null)
                                        }
                                        // touch: tap a box for its job, tap again to put it away
                                        onPointerUp={(e) =>
                                            e.pointerType !== "mouse" &&
                                            setHover((h) =>
                                                h === n.id ? null : n.id,
                                            )
                                        }
                                        style={{
                                            opacity: dim ? 0.45 : 1,
                                            transition:
                                                "opacity 200ms var(--ease-standard)",
                                        }}
                                        className="cursor-default"
                                    >
                                        <rect
                                            x={b.x}
                                            y={b.y}
                                            width={b.w}
                                            height={NODE_H}
                                            rx="8"
                                            fill="var(--paper)"
                                            stroke={
                                                visited.has(n.id)
                                                    ? "var(--ink)"
                                                    : "var(--line-2)"
                                            }
                                            strokeWidth="1"
                                            style={{
                                                transition: "stroke 200ms",
                                            }}
                                        />
                                        <text
                                            x={b.cx}
                                            y={b.y + (n.sub ? 19 : 26)}
                                            textAnchor="middle"
                                            className="fill-[var(--ink)] font-sans text-[12px]"
                                        >
                                            {n.label}
                                        </text>
                                        {n.sub && (
                                            <text
                                                x={b.cx}
                                                y={b.y + 34}
                                                textAnchor="middle"
                                                className="fill-[var(--faint)] font-pixel text-[10px]"
                                            >
                                                {n.sub}
                                            </text>
                                        )}
                                    </g>
                                )
                            })}

                            {current && (
                                <motion.g
                                    key={`${flow.id}-${shown}`}
                                    initial={
                                        reduced
                                            ? false
                                            : { opacity: 0, scale: 1.12 }
                                    }
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.18,
                                        ease: ease.drop,
                                    }}
                                    aria-hidden
                                >
                                    <Viewfinder box={geo.nodes[current]} />
                                </motion.g>
                            )}

                            {!reduced && (
                                <g
                                    ref={dot}
                                    style={{
                                        opacity: playing ? 1 : 0,
                                        transition: "opacity 160ms",
                                    }}
                                    aria-hidden
                                >
                                    <rect
                                        x="-5"
                                        y="-5"
                                        width="10"
                                        height="10"
                                        fill="var(--paper)"
                                    />
                                    <rect
                                        x="-4"
                                        y="-4"
                                        width="8"
                                        height="8"
                                        fill="var(--red)"
                                    />
                                </g>
                            )}
                        </svg>

                        <AnimatePresence>
                            {hoverNode && (
                                <motion.div
                                    key={hover}
                                    role="tooltip"
                                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        transition: { duration: 0.1 },
                                    }}
                                    transition={{
                                        duration: 0.16,
                                        ease: ease.drop,
                                    }}
                                    className="pointer-events-none absolute z-10 w-56 rounded-md border border-line bg-paper p-2.5 font-sans text-ui text-soft shadow-pop"
                                    style={{
                                        left: Math.min(
                                            Math.max(hoverNode.cx - 112, 4),
                                            geo.width - 228,
                                        ),
                                        top:
                                            hoverNode.y + NODE_H + 8 >
                                            geo.height - 70
                                                ? hoverNode.y - 76
                                                : hoverNode.y + NODE_H + 8,
                                    }}
                                >
                                    <span className="mb-0.5 block text-ink">
                                        {hoverNode.label}
                                    </span>
                                    {hoverNode.info}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <figcaption className="mt-3 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
                <div
                    className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-ui"
                    role="group"
                    aria-label="Flows"
                >
                    {spec.flows.map((f, i) => (
                        <button
                            key={f.id}
                            type="button"
                            aria-pressed={i === flowIdx}
                            onClick={() => pick(i)}
                            className={cn(
                                "inline-flex items-center gap-1.5 transition-colors duration-[var(--duration-quick)]",
                                i === flowIdx
                                    ? "text-ink"
                                    : "text-soft hover:text-ink",
                            )}
                        >
                            <span
                                aria-hidden
                                className={cn(
                                    "h-1.5 w-1.5 transition-colors",
                                    i === flowIdx ? "bg-red" : "bg-line-2",
                                )}
                            />
                            {f.label}
                        </button>
                    ))}
                </div>
                {!reduced && (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            aria-label="Previous step"
                            onClick={() => go(-1)}
                            disabled={shown === 0}
                            className={ctl}
                        >
                            <ChevronLeft size={14} strokeWidth={1.5} />
                        </button>
                        <div
                            className="flex items-center"
                            role="group"
                            aria-label="Steps"
                        >
                            {flow.steps.map((s, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={`Step ${i + 1}: ${s.caption}`}
                                    aria-current={
                                        i === shown ? "step" : undefined
                                    }
                                    onClick={() => jump(i)}
                                    className="group grid h-7 w-3.5 place-items-center"
                                >
                                    <span
                                        className={cn(
                                            "h-2 w-2 transition-colors duration-[var(--duration-quick)]",
                                            i <= shown
                                                ? "bg-red"
                                                : "bg-line-2 group-hover:bg-faint",
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            aria-label="Next step"
                            onClick={() => go(1)}
                            disabled={shown === last}
                            className={ctl}
                        >
                            <ChevronRight size={14} strokeWidth={1.5} />
                        </button>
                        <button
                            type="button"
                            aria-label="Replay"
                            onClick={() => play(0)}
                            className={ctl}
                        >
                            <RotateCcw size={13} strokeWidth={1.5} />
                        </button>
                    </div>
                )}
            </figcaption>

            {reduced ? (
                <ol className="mt-3 space-y-1 px-1 font-pixel text-pixel text-soft">
                    {flow.steps.map((s, i) => (
                        <li key={i}>
                            {pad2(i + 1)} · {s.caption}
                        </li>
                    ))}
                </ol>
            ) : (
                <p
                    aria-live="polite"
                    className="mt-2 min-h-4 px-1 font-pixel text-pixel text-soft"
                >
                    <span className="text-red">{pad2(shown + 1)}</span> ·{" "}
                    {caption?.caption}
                </p>
            )}
            <ol className="sr-only">
                {flow.steps.map((s, i) => (
                    <li key={i}>{s.caption}</li>
                ))}
            </ol>
        </figure>
    )
}
