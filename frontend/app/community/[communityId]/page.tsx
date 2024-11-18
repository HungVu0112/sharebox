'use client'

import MainLayout from "@/components/mainLayout";
import PlusIcon from "@/public/plus-solid-white.svg";
import EarthIcon from "@/public/earth-asia-solid-black.svg";
import MemberIcon from "@/public/user-group-solid.svg";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type CommunityPageProps = {
    params: {
      communityId: string;
    };
};

export default function CommunityPage({params}: CommunityPageProps) {
  const { communityId } = params;
  const router = useRouter();
  const userString = sessionStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : {};
  const [community, setCommunity] = useState<any>();
  const [owner, setOwner] = useState<any>();
  const [isJoin, setIsJoin] = useState<boolean>(false);

  const handleJoin = async() => {
    setIsJoin(!isJoin);
    if (!isJoin) {
      await axios.post(
        `http://localhost:8080/authentication/community/add/${user.userId}/${communityId}`
      )
    } else {
      await axios.post(
        `http://localhost:8080/authentication/community/leave/${user.userId}/${communityId}`
      )
    }
  }

  useEffect(() => {
    const getCommunity = async() => {
      const res = await axios.get(
        `http://localhost:8080/authentication/community/${communityId}`
      )
      if (res.data.result) setCommunity(res.data.result);
    }
    getCommunity();
  }, [isJoin])

  useEffect(() => {
    if (community && user.userId != community?.ownerId) {
      const checkUser = async() => {
        const res = await axios.get(
          `http://localhost:8080/authentication/users/user/${community?.ownerId}`
        )
        if (res.data.result) setOwner(res.data.result);
      }
      checkUser();

      if (community?.members.some((member: any) => member.userId === user.userId)) setIsJoin(true);
    }
  }, [community])
  

  console.log(owner);
  
  // console.log(community);
 
  return (
      <MainLayout>
        <main className="w-full h-[calc(100vh-112px)] flex justify-center select-none">
          <title>{community ? community.name : "Share Box"}</title>
          <div className="w-[80%]">
            <div className="w-full h-[100px] bg-textGrayColor1 rounded-xl overflow-hidden">
                {community && <img src={community?.backgroundImg} alt="Background Image" className="w-full object-contain"/>}
            </div>
            <div className="relative flex justify-between w-full">
              <div className="absolute -top-10 left-10 w-[120px] h-[120px] bg-textGrayColor1 border-2 border-white rounded-full overflow-hidden">
                {community && <img src={community?.avatar} alt="Avatar" className="w-full h-full object-cover"/>}
              </div>
              <h1 className="text-textHeadingColor text-2xl ml-[180px] mt-6 font-bold">{community?.name}</h1>
              <div className="flex mt-6 mr-6 gap-4">
                {(community && (community?.ownerId == user.userId || (community?.members.some((member: any) => member.userId === user.userId)))) &&
                  <div onClick={() => router.push("/createpost")} className="w-[150px] h-[40px] rounded-full bg-textHeadingColor text-white flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.05] duration-150">
                    <Image
                      src={PlusIcon}
                      alt="PLus ICon"
                      className="w-[15px]"
                    />
                    <p>Create post</p>
                  </div>
                }

                {(community && community?.ownerId != user.userId) && 
                  <button onClick={handleJoin} className="w-[80px] h-[40px] rounded-full cursor-pointer hover:scale-[1.05] duration-150 bg-textHeadingColor text-white">
                    {isJoin ? "Joined" : "Join"}
                  </button>
                }
              </div>
            </div>
            <div className="w-full mt-16 flex justify-between">
              <div className="w-[70%] bg-red-300">
                test
              </div>
              <div className="sticky top-[100px] right-0 w-[28%] h-fit bg-boxBackground rounded-md p-4 text-textHeadingColor break-words">
                <h2 className="font-bold text-lg">{community?.name}</h2>
                <p className="text-sm font-semibold">{community?.description}</p>
                <div className="flex mt-4">      
                  <div className="flex items-center gap-2">     
                    <Image 
                      src={EarthIcon}
                      alt="Earth Icon"
                      className="w-[20px]"
                    />
                    <p className="text-sm">
                      {(new Date(community?.createAt).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }
                      ))}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">     
                    <Image 
                      src={MemberIcon}
                      alt="Member Icon"
                      className="w-[20px]"
                    />
                    <p className="text-sm">{community?.members && community?.members.length + 1 } Members</p>
                  </div>
                </div>
                <div className="mt-4 w-full h-[1px] bg-lineColor"></div>
                <div className="mt-4 w-full">
                  <h2 className="font-bold text-lg">Moderator</h2>
                  <div className="mt-3 flex items-center">
                    <div className="w-[60px] h-[60px] rounded-full bg-textGrayColor1 overflow-hidden">
                        {community && 
                          <img src={owner ? owner.avatar : user.avatar} alt="Avatar" />
                        }
                    </div>
                    <p className="ml-4 font-bold">{community && owner ? owner.username : user.username}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
  )
}