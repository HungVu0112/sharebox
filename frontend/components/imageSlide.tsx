import ImageIcon from "@/public/camera-solid-gray.svg";
import Image from "next/image";
import ImageCard from "./imageCard";

export default function ImageSlide({ urlArr, handleDelete } : { urlArr: string[], handleDelete: (url: string) => void }) {
    return (
        <div className="w-full mb-10 select-none">
            <div className="flex items-center gap-2">
                <Image 
                    src={ImageIcon}
                    alt="Image Icon"
                    className="w-[24px]"
                />
                <p className="text-[24px] font-bold text-textHeadingColor">Images</p>
            </div>
            <div className="mt-2 w-full border border-lineColor"></div>

            <div className="w-full mt-4 flex gap-6 overflow-x-auto custom-scrollbar py-4">
                {urlArr.map((url: string) => {
                    return <ImageCard handleDelete={handleDelete} key={url} url={url}/>
                })}
            </div>
        </div>
    )
}