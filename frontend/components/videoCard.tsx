import TrashIcon from "@/public/trash-solid.svg";
import Image from "next/image";

export default function VideoCard({ url, handleDelete } : { url: string, handleDelete: (url: string) => void }) {
    return (
        <div className="w-[200px] flex-shrink-0 relative shadow-lg rounded-md">
            <video src={url} controls className="rounded-md w-full"></video>
            <div onClick={() => handleDelete(url)} className="absolute w-[30px] h-[30px] bg-warningMessageBackground rounded-full -top-3 -right-3 flex items-center justify-center hover:scale-[1.05] cursor-pointer">
                <Image 
                    src={TrashIcon}
                    alt="Trash Icon"
                    className="w-[10px]"
                />
            </div>
        </div>
    )
}