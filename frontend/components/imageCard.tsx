import TrashIcon from "@/public/trash-solid.svg";
import Image from "next/image";

export default function ImageCard({ url, handleDelete } : { url: string, handleDelete: (url: string) => void }) {
    return (
        <div className="relative w-[200px] h-fit flex-shrink-0 shadow-lg">
            <img src={url} alt="Image" className="w-full rounded-md"/>
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