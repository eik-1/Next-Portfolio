// Groove radii, with two silent bands left out where one track ends and the next begins.
const GROOVES = []
for (let r = 25; r <= 58; r += 1.5) {
    if (Math.abs(r - 37) < 1 || Math.abs(r - 47.5) < 1) continue
    GROOVES.push(r)
}

/**
 * A 12-inch record seen from above: black vinyl, fine grooves, red label.
 * The vinyl stays black in both themes; only the label follows the tokens.
 * The label carries two off-centre marks so rotation is visible.
 */
export default function Disc({ size = 124, className }) {
    return (
        <svg
            viewBox="0 0 124 124"
            width={size}
            height={size}
            aria-hidden="true"
            className={className}
        >
            <circle cx="62" cy="62" r="62" fill="#111110" />
            {GROOVES.map((r) => (
                <circle
                    key={r}
                    cx="62"
                    cy="62"
                    r={r}
                    fill="none"
                    stroke="#fff"
                    strokeOpacity="0.09"
                    strokeWidth="0.5"
                />
            ))}
            <circle
                cx="62"
                cy="62"
                r="61.5"
                fill="none"
                className="stroke-line-2"
                strokeWidth="1"
            />
            <circle cx="62" cy="62" r="19" className="fill-red" />
            <circle
                cx="62"
                cy="62"
                r="14"
                fill="none"
                className="stroke-on-red"
                strokeOpacity="0.3"
                strokeWidth="0.6"
            />
            <rect
                x="54"
                y="50.4"
                width="16"
                height="1.6"
                rx="0.8"
                className="fill-on-red"
                opacity="0.9"
            />
            <rect
                x="57"
                y="53.8"
                width="10"
                height="1.2"
                rx="0.6"
                className="fill-on-red"
                opacity="0.6"
            />
            <circle
                cx="62"
                cy="71.6"
                r="1.3"
                className="fill-on-red"
                opacity="0.7"
            />
            <circle cx="62" cy="62" r="2.4" fill="#d9d8d2" />
        </svg>
    )
}
