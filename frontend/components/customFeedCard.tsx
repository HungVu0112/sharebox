
import FeedIcon from "@/public/category-pink.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CustomFeedCard({ customFeed }: { customFeed: any }) {
    const router = useRouter();
    return (
        <div onClick={() => router.push(`/feed/${customFeed.customfeedId}`)} className="w-full px-2 h-[50px] flex items-center gap-3 cursor-pointer hover:bg-slate-100 rounded-md">
            <Image
                src={FeedIcon}
                alt="Feed Icon"
                className="w-[30px]"
            />
            <h2 className="font-bold text-sm text-textHeadingColor">{customFeed.name}</h2>
        </div>
    )
}