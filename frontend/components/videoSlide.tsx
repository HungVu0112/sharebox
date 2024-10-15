import VideoIcon from "@/public/clapperboard-solid-gray.svg";
import Image from "next/image";
import VideoCard from "./videoCard";

export default function VideoSlide({ urlArr, handleDelete } : { urlArr: string[], handleDelete: (url: string) => void }) {
    return (
        <div className="w-full mb-6">
            <div className="flex items-center gap-2">
                <Image 
                    src={VideoIcon}
                    alt="Video Icon"
                    className="w-[24px]"
                />
                <p className="text-[24px] font-bold text-textHeadingColor">Videos</p>
            </div>
            <div className="mt-2 w-full border border-lineColor"></div>

            <div className="w-full mt-4 flex gap-6 overflow-x-auto custom-scrollbar py-4">
                {urlArr.map((url: string) => {
                    return <VideoCard handleDelete={handleDelete} key={url} url={url}/>
                })}
            </div>
        </div>
    )
}