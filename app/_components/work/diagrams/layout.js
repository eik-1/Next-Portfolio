/**
 * Geometry for the architecture diagrams.
 *
 * Pure functions: a diagram spec and a width go in; pixel boxes, zone rectangles
 * and orthogonal edge paths come out. Text never scales with the container,
 * only the gaps between boxes do. Below WIDE_MIN the spec's "narrow" plan (two
 * columns, read top to bottom) replaces the "wide" one.
 */

export const WIDE_MIN = 700 // container width where the wide plan takes over
export const NODE_H = 44

const WIDE_MAX = 1040
const NARROW_MIN = 272
const NARROW_MAX = 440
const NODE_MAX = 150
const ZONE_TOP = 28 // room for a zone's label above its first node
const ZONE_BOTTOM = 10
const HEAD = 6 // arrowhead length
const CORNER = 6 // elbow radius

const NORMAL = { l: [-1, 0], r: [1, 0], t: [0, -1], b: [0, 1] }
const isH = (side) => side === "l" || side === "r"
const even = (n) => Math.round(n / 2) * 2

/** Where an edge meets a box: the middle of one side, moved along it by `shift`. */
function port(box, side, shift) {
    if (side === "l") return [box.x, box.cy + shift]
    if (side === "r") return [box.x + box.w, box.cy + shift]
    if (side === "t") return [box.cx + shift, box.y]
    return [box.cx + shift, box.y + box.h]
}

/** Round to whole pixels, drop repeated points and points in the middle of a straight run. */
function tidy(points) {
    const out = []
    for (const [px, py] of points) {
        const p = [Math.round(px), Math.round(py)]
        const a = out[out.length - 1]
        const b = out[out.length - 2]
        if (a && a[0] === p[0] && a[1] === p[1]) continue
        if (
            a &&
            b &&
            ((b[0] === a[0] && a[0] === p[0]) ||
                (b[1] === a[1] && a[1] === p[1]))
        ) {
            out[out.length - 1] = p
            continue
        }
        out.push(p)
    }
    return out
}

/**
 * One edge as a list of corner points.
 *
 * route = [fromSide, toSide, options]
 *   a, b   move the start / end port along its side
 *   s      move both ports by the same amount
 *   jog    how far from the start the path turns (default: halfway)
 *   lane   for two ports on the same side: how far outside them the path runs
 *   stub   [out, in] leave and arrive by fixed lengths and join them with one
 *          corner; "out" means "just past the edge of this box's zone"
 */
function route(A, B, [sa, sb, o = {}]) {
    let a = (o.a ?? 0) + (o.s ?? 0)
    let b = (o.b ?? 0) + (o.s ?? 0)

    // Two stacked boxes of different widths: run straight from the narrower one.
    if (
        !isH(sa) &&
        !isH(sb) &&
        o.a === undefined &&
        o.b === undefined &&
        A.w !== B.w
    ) {
        const x = (A.w < B.w ? A : B).cx
        a += x - A.cx
        b += x - B.cx
    }

    const P = port(A, sa, a)
    const Q = port(B, sb, b)
    let mid

    if (o.stub) {
        const reach = (box, side, len) =>
            len !== "out"
                ? len
                : side === "r"
                  ? box.outR - (box.x + box.w)
                  : box.x - box.outL
        const la = reach(A, sa, o.stub[0])
        const lb = reach(B, sb, o.stub[1])
        const sA = [P[0] + NORMAL[sa][0] * la, P[1] + NORMAL[sa][1] * la]
        const sB = [Q[0] + NORMAL[sb][0] * lb, Q[1] + NORMAL[sb][1] * lb]
        mid = [sA, isH(sa) ? [sA[0], sB[1]] : [sB[0], sA[1]], sB]
    } else if (isH(sa) && isH(sb)) {
        const lane = o.lane ?? 12
        const x =
            sa === sb
                ? sa === "r"
                    ? Math.max(P[0], Q[0]) + lane
                    : Math.min(P[0], Q[0]) - lane
                : o.jog !== undefined
                  ? P[0] + NORMAL[sa][0] * o.jog
                  : (P[0] + Q[0]) / 2
        mid = [
            [x, P[1]],
            [x, Q[1]],
        ]
    } else if (!isH(sa) && !isH(sb)) {
        const lane = o.lane ?? 12
        const y =
            sa === sb
                ? sa === "b"
                    ? Math.max(P[1], Q[1]) + lane
                    : Math.min(P[1], Q[1]) - lane
                : o.jog !== undefined
                  ? P[1] + NORMAL[sa][1] * o.jog
                  : (P[1] + Q[1]) / 2
        mid = [
            [P[0], y],
            [Q[0], y],
        ]
    } else if (isH(sa)) {
        mid = [[Q[0], P[1]]]
    } else {
        mid = [[P[0], Q[1]]]
    }

    return tidy([P, ...mid, Q])
}

/** SVG path through the points with small rounded elbows. `trim` shortens the end (room for an arrowhead). */
export function trace(points, trim = 0) {
    const p = points.map((pt) => [pt[0], pt[1]])
    const n = p.length
    if (n < 2) return ""

    if (trim) {
        const [x1, y1] = p[n - 2]
        const [x2, y2] = p[n - 1]
        const len = Math.hypot(x2 - x1, y2 - y1)
        const k = len ? Math.max(0, len - trim) / len : 0
        p[n - 1] = [x1 + (x2 - x1) * k, y1 + (y2 - y1) * k]
    }

    let d = `M${p[0][0]} ${p[0][1]}`
    for (let i = 1; i < n - 1; i++) {
        const [px, py] = p[i - 1]
        const [x, y] = p[i]
        const [nx, ny] = p[i + 1]
        const inLen = Math.hypot(x - px, y - py)
        const outLen = Math.hypot(nx - x, ny - y)
        const r = Math.min(CORNER, inLen / 2, outLen / 2)
        const ux = (x - px) / (inLen || 1)
        const uy = (y - py) / (inLen || 1)
        const vx = (nx - x) / (outLen || 1)
        const vy = (ny - y) / (outLen || 1)
        // straight on, or doubling back along the same line: no elbow to round
        if (r < 1 || Math.abs(ux * vy - uy * vx) < 0.01) {
            d += `L${x} ${y}`
            continue
        }
        d += `L${x - ux * r} ${y - uy * r}Q${x} ${y} ${x + vx * r} ${y + vy * r}`
    }
    return `${d}L${p[n - 1][0]} ${p[n - 1][1]}`
}

/** A small solid triangle whose tip sits on the last point. */
function arrowhead(points) {
    const [x1, y1] = points[points.length - 2]
    const [x, y] = points[points.length - 1]
    const len = Math.hypot(x - x1, y - y1) || 1
    const ux = (x - x1) / len
    const uy = (y - y1) / len
    const bx = x - ux * HEAD
    const by = y - uy * HEAD
    const wx = -uy * 3.25
    const wy = ux * 3.25
    return `M${x} ${y}L${bx + wx} ${by + wy}L${bx - wx} ${by - wy}Z`
}

/** Returns a function t (0..1) -> [x, y] that walks the points at constant speed. */
export function ruler(points) {
    const stops = [0]
    for (let i = 1; i < points.length; i++) {
        stops.push(
            stops[i - 1] +
                Math.hypot(
                    points[i][0] - points[i - 1][0],
                    points[i][1] - points[i - 1][1],
                ),
        )
    }
    const total = stops[stops.length - 1]
    return (t) => {
        const d = Math.min(Math.max(t, 0), 1) * total
        let i = 1
        while (i < points.length - 1 && stops[i] < d) i++
        const k = (d - stops[i - 1]) / (stops[i] - stops[i - 1] || 1)
        return [
            points[i - 1][0] + (points[i][0] - points[i - 1][0]) * k,
            points[i - 1][1] + (points[i][1] - points[i - 1][1]) * k,
        ]
    }
}

/** The points a packet travels for one step: its edges joined end to end, reversed where it runs against the arrow. */
export function hopPoints(geo, hop) {
    const out = []
    for (const { id, forward } of hop) {
        const pts = geo.edges[id].points
        for (let i = 0; i < pts.length; i++) {
            const p = forward ? pts[i] : pts[pts.length - 1 - i]
            const prev = out[out.length - 1]
            if (!prev || prev[0] !== p[0] || prev[1] !== p[1]) out.push(p)
        }
    }
    return out
}

/** Lay a compiled spec out for a container `width` pixels wide. */
export function measure(spec, width) {
    const wide = width >= WIDE_MIN
    const plan = wide ? spec.layouts.wide : spec.layouts.narrow
    const inner = wide
        ? Math.min(width, WIDE_MAX)
        : Math.min(Math.max(width, NARROW_MIN), NARROW_MAX)
    const ox = Math.max(0, (width - inner) / 2)
    const pad = {
        t: 12,
        r: wide ? 12 : 4,
        b: 12,
        l: wide ? 12 : 4,
        ...plan.pad,
    }
    const gap = wide ? 6 : 4 // half the space between two zones
    const cellW = (inner - pad.l - pad.r) / plan.cols
    const left = (col) => ox + pad.l + col * cellW
    const nodeW = Math.min(NODE_MAX, cellW - 2 * (gap + 5))

    const nodes = {}
    let rows = 0
    for (const node of spec.nodes) {
        const [col, row, span = 1] = plan.place[node.id]
        const last = col + span - 1
        let x0
        let x1
        if (wide) {
            const cx = (left(col) + left(last + 1)) / 2
            x0 = cx - nodeW / 2
            x1 = cx + nodeW / 2
        } else {
            // narrow: the outer sides keep a lane free for edges that run around the boxes
            x0 = left(col) + gap + (col === 0 ? 18 : 8)
            x1 = left(last + 1) - gap - (last === plan.cols - 1 ? 18 : 8)
        }
        const x = Math.round(x0)
        const y = Math.round(pad.t + ZONE_TOP + row * plan.rowH)
        const w = even(x1 - x0)
        nodes[node.id] = {
            x,
            y,
            w,
            h: NODE_H,
            cx: x + w / 2,
            cy: y + NODE_H / 2,
            col,
            last,
            outL: left(col) + gap - 8,
            outR: left(last + 1) - gap + 8,
        }
        rows = Math.max(rows, row)
    }

    const zones = spec.zones.map((zone) => {
        const boxes = spec.nodes
            .filter((n) => n.zone === zone.id)
            .map((n) => nodes[n.id])
        const x0 = left(Math.min(...boxes.map((b) => b.col))) + gap
        const x1 = left(Math.max(...boxes.map((b) => b.last)) + 1) - gap
        const y0 = Math.min(...boxes.map((b) => b.y)) - ZONE_TOP
        const y1 = Math.max(...boxes.map((b) => b.y + b.h)) + ZONE_BOTTOM
        return {
            id: zone.id,
            label: zone.label,
            x: Math.round(x0),
            y: y0,
            w: Math.round(x1 - x0),
            h: y1 - y0,
        }
    })

    const edges = {}
    for (const edge of spec.edges) {
        const points = route(
            nodes[edge.from],
            nodes[edge.to],
            plan.routes[edge.id],
        )
        edges[edge.id] = {
            points,
            line: trace(points, edge.plain ? 0 : HEAD - 1),
            head: edge.plain ? null : arrowhead(points),
        }
    }

    return {
        wide,
        width,
        height: Math.round(
            pad.t + ZONE_TOP + rows * plan.rowH + NODE_H + ZONE_BOTTOM + pad.b,
        ),
        nodes,
        zones,
        edges,
    }
}

/**
 * Resolve a hand-written spec once: index nodes and edges by id and, for every
 * flow step, work out which edges the packet rides and in which direction.
 * A step names its edges with `via` only when the trip is not a single edge.
 */
export function compile(spec) {
    const edge = Object.fromEntries(spec.edges.map((e) => [e.id, e]))
    const node = Object.fromEntries(spec.nodes.map((n) => [n.id, n]))

    const flows = spec.flows.map((flow) => {
        let at = flow.steps[0].at
        const steps = flow.steps.map((step, i) => {
            if (i === 0) return { ...step, hop: [] }
            const here = at
            const ids = step.via ?? [
                spec.edges.find(
                    (e) =>
                        (e.from === here && e.to === step.at) ||
                        (e.to === here && e.from === step.at),
                ).id,
            ]
            const hop = ids.map((id) => {
                const forward = edge[id].from === at
                at = forward ? edge[id].to : edge[id].from
                return { id, forward }
            })
            return { ...step, hop }
        })
        return {
            ...flow,
            steps,
            edges: [...new Set(steps.flatMap((s) => s.hop.map((h) => h.id)))],
        }
    })

    return { ...spec, edge, node, flows }
}
