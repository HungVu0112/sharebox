import Image from "next/image";
import CameraIcon from "../../../public/camera-solid.svg";
import ArrowIcon from "../../../public/arrow-right-solid.svg";
import Link from "next/link";

export default function UserInfo() {
    return (
        <main className="w-[800px] h-[600px] bg-lightWhiteColor rounded-2xl flex flex-col items-center">
            <title>Share Box | Username & Avatar</title> 
            <section className="w-[250px] h-[250px] rounded-full bg-gray-300 mt-6 border border-inputBorderColor relative">
                <Image
                    src={CameraIcon}
                    alt="Camera Icon"
                    className="absolute w-[40px] bottom-0 right-[28px]"
                />
            </section>

            <input type="text" className="mt-16 w-[70%] h-[70px] text-lg text-white p-4 rounded-xl bg-buttonColor outline-none placeholder:text-white" placeholder="Username"/>

            <Link href="/setupuser/usertopic" className="flex items-center justify-center mt-14 w-[80px] h-[80px] rounded-full bg-lightButtonColor hover:scale-[1.03] duration-100 cursor-pointer">
                <Image
                    src={ArrowIcon}
                    alt="Arrow Icon"
                    className="w-[30px]"
                />
            </Link>
        </main>
    )
}