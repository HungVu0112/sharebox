import Image from "next/image";
import NotFoundImg from "../public/not-found.jpg";

export default function Custom404() {
    return (
        <main className="w-full h-[100vh] flex items-center justify-center bg-lightBlackColor">
            <title>404| This page could not be found</title>
            <Image 
                src={NotFoundImg}
                alt="NotFound Image"
                className="w-[300px] rounded-lg shadow-xl"
            />
            <h1 className="ml-6 text-2xl font-semibold text-white">404| This page could not be found</h1>
        </main>
    )
}