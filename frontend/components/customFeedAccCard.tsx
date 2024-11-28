import CategoryICon from "@/public/category-pink.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CustomFeedAccCard({ feed } : {feed: any}) {
    const router = useRouter();
    return (
        <div onClick={()=>router.push(`/feed/${feed.feedId}`)} className="flex p-6 gap-4 items-center rounded-lg shadow-xl border border-slate-200 hover:scale-[1.03] duration-150 cursor-pointer">
            <Image
                src={CategoryICon}
                alt="Category Icon"
                className="w-[50px]"
            />
            <div className="">
                <h3 className="font-bold text-lg">{feed.name}</h3>
                <div className="w-[300px]">
                    <p className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{feed.description}</p>
                </div>
            </div>
        </div>
    )
}