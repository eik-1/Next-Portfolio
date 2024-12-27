import SkillsList from "./SkillsList"

function Techstack() {
    const mySkills = [
        { name: "Solidity", color: "hsl(0, 100%, 50%)" },
        { name: "Hardhat", color: "hsl(0, 100%, 70%)" },
        { name: "NodeJS", color: "hsl(0, 100%, 50%)" },
        { name: "Ethers", color: "hsl(0, 100%, 70%)" },
    ]

    return (
        <div className="App">
            <SkillsList skills={mySkills} />
        </div>
    )
}

export default Techstack
