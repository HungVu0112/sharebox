import UserGroup from "@/public/user-group-solid.svg";
import PostIcon from "@/public/pen-solid.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CommunityExploreCard({ community, isTop } : {community: any, isTop: boolean}) {
    const router = useRouter();
    return (
        <div onClick={()=>router.push(`/community/${community.communityId}`)} className="flex p-6 gap-4 items-center rounded-lg shadow-xl border border-slate-200 hover:scale-[1.03] duration-150 cursor-pointer">
            <div className="w-[65px] h-[65px] rounded-full overflow-hidden shadow-lg">
                <img src={community.avatar} alt="Avatar" className="w-full h-full object-cover"/>
            </div>
            <div className="">
                <h3 className="font-bold text-lg">{community.name}</h3>
                <div className="w-[300px]">
                    <p className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{community.description}</p>
                </div>
                <div className="flex gap-2 items-center">
                    {isTop ? 
                        <>
                            <Image 
                                src={UserGroup}
                                alt="User Group ICon"
                                className="w-[15px]"
                            />
                            <p className="mt-[4px] text-sm text-textGrayColor1">{community.members.length} members</p>
                        </>
                        :
                        <>
                            <Image 
                                src={PostIcon}
                                alt="Post ICon"
                                className="w-[10px]"
                            />
                            <p className="mt-[4px] text-sm text-textGrayColor1">{community.postCount} posts</p>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}