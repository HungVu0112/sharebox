import Image from "next/image";
import Image1 from "../../public/setup_1.svg";
import Image2 from "../../public/setup_2.svg";
import Image3 from "../../public/setup_3.svg";
import Image4 from "../../public/setup_4.svg";
import Image5 from "../../public/setup_5.svg";
import Image6 from "../../public/setup_6.svg";
import Image7 from "../../public/setup_7.svg";
import Image8 from "../../public/setup_8.svg";

export default function SetUpUserLayout({ children } : Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="relative w-full h-[100vh] flex items-center justify-center">
            <section className="absolute w-full h-full top-0 left-0 grid grid-cols-4 grid-flow-row gap-4 -z-10 overflow-hidden blurry-bg">
                <div className="">
                    <Image
                        src={Image1}
                        alt="Image 1"
                        className="w-full"
                    />
                    <Image
                        src={Image2}
                        alt="Image 2"
                        className="w-full mt-4"
                    />
                </div>
                <div className="">
                    <Image
                        src={Image3}
                        alt="Image 3"
                        className="w-full"
                    />
                    <Image
                        src={Image4}
                        alt="Image 4"
                        className="w-full mt-4"
                    />
                </div>
                <div className="">
                    <Image
                        src={Image5}
                        alt="Image 5"
                        className="w-full"
                    />
                    <Image
                        src={Image6}
                        alt="Image 6"
                        className="w-full mt-4"
                    />
                </div>
                <div className="">
                    <Image
                        src={Image7}
                        alt="Image 7"
                        className="w-full"
                    />
                    <Image
                        src={Image8}
                        alt="Image 8"
                        className="w-full mt-4"
                    />
                </div>
            </section>
            {children}
        </div>
    )
}