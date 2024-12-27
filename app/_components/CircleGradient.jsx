const CircleBackground = ({ color, size, blur, opacity, position }) => {
    return (
        <div
            className={`absolute rounded-full filter z-[-1] hidden lg:block`}
            style={{
                width: size,
                height: size,
                backgroundColor: color,
                opacity: opacity,
                filter: `blur(${blur})`,
                ...position,
            }}
        />
    )
}

export default CircleBackground
