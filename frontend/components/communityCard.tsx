
import MemberIcon from "@/public/user-group-solid.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CommunityCard({ community }: { community: any }) {
    const router = useRouter();
    return (
        <div onClick={() => router.push(`/community/${community.communityId}`)} className="w-full px-2 h-[80px] flex items-center gap-3 cursor-pointer hover:bg-slate-100 rounded-md">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-textGrayColor1">
                <img src={community.avatar} alt="Avatar" className="w-full h-full object-cover"/>
            </div>
            <div className="">
                <h2 className="font-bold text-lg text-textHeadingColor">{community.name}</h2>
                <div className="flex gap-2">
                    <Image 
                        src={MemberIcon}
                        alt="Member Icon"
                        className="w-[15px]"
                    />
                    <p className="text-sm text-textGrayColor1">{community.members.length} members</p>
                </div>
            </div>
        </div>
    )
}