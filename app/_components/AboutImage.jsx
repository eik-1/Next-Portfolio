import Image from "next/image"

import myPic from "@/public/mypic.webp"

function AboutImage() {
    return (
        <div className="w-fit bg-white p-2 pb-8 shadow-lg transform rotate-[-2deg] transition-transform duration-300 ease-in-out hover:rotate-0 lg:mt-16 mt-10">
            <Image
                src={myPic}
                alt="myPic"
                className="lg:h-[300px] lg:w-[300px] object-cover border border-border h-[200px] w-[200px]"
            />
        </div>
    )
}

export default AboutImage
