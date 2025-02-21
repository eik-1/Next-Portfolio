import SkillsList from "./SkillsList"

function Techstack() {
    const mySkills = [
        { name: "TypeScript", color: "hsl(0, 100%, 50%)" },
        { name: "Solidity", color: "hsl(0, 100%, 70%)" },
        { name: "Foundry", color: "hsl(0, 100%, 50%)" },
        { name: "NextJs", color: "hsl(0, 100%, 70%)" },
        { name: "Viem", color: "hsl(0, 100%, 50%)" },
    ]

    return (
        <div className="App">
            <SkillsList skills={mySkills} />
        </div>
    )
}

export default Techstack
