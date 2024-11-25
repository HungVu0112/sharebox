'use client'

import CommunityExploreCard from "@/components/communityEploreCard";
import UserGroup from "@/public/user-group-solid.svg";
import PostIcon from "@/public/pen-solid.svg";
import MainLayout from "@/components/mainLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Explore() {
    const [topCommunities, setTopCommunities] = useState<any[]>([]);
    const [postCommunities, setPostCommunities] = useState<any[]>([]);
    const [all, setAll] = useState<any[]>([]);

    useEffect(() => {
      const getCommunities = async() => {
          const res = await axios.get(
            `http://localhost:8080/authentication/community/all`
          )
          if (res.data.result) {
              const tc = [...res.data.result];
              const sortedtc = tc.sort((a: any, b: any) => b.members.length - a.members.length);
              setTopCommunities([...sortedtc.slice(0,4)]);
              setAll(res.data.result);
          }
      }
      getCommunities();
    }, [])

    useEffect(() => {
      const getPost = async() => {
        if (all.length != 0) {
          const postCom: any[] = [];
          await Promise.all(all.map(async (com: any) => {
            const res = await axios.get(
              `http://localhost:8080/authentication/post/community/${com.communityId}`
            );
            if (res.data.result) postCom.push({
              count: res.data.result.length,
              communityId: com.communityId
            });
          }));
          
          const sortedPostCom = postCom.sort((a: any, b: any) => b.communityId - a.communityId).reverse();

          const combineArr = all.map((com: any, index: number) => {
              return { ...com, postCount: sortedPostCom[index].count };
          })
          
          const sort = combineArr.sort((a: any, b: any) => b.postCount - a.postCount).slice(0,4);

          setPostCommunities([...sort])
        }
      }
      getPost();
    }, [all])

    return (
      <MainLayout>
        <main className="w-full flex justify-center select-none p-6 text-textHeadingColor">
          <title>Explore</title>
          <div className="w-[70%]">
            <h1 className="text-3xl font-bold">EXPLORE COMMUNITIES</h1>

            <div className="mt-12">
              <div className="flex gap-2">
                  <Image
                    src={UserGroup}
                    alt="User Group ICon"
                    className="w-[15px]"
                  />
                  <h2 className="text-xl font-semibold">TOP MEMBERS</h2>
              </div>
              <div className="mt-4 grid grid-cols-2 grid-flow-row gap-6">
                {topCommunities.length != 0 && topCommunities.map((com: any, index: number) => {
                  return <CommunityExploreCard key={index} community={com} isTop/>
                })}
              </div>

              <div className="flex gap-2 mt-10">
                  <Image
                    src={PostIcon}
                    alt="Post ICon"
                    className="w-[15px]"
                  />
                  <h2 className="text-xl font-semibold">TOP POSTS</h2>
              </div>
              <div className="mt-4 grid grid-cols-2 grid-flow-row gap-6">
                {postCommunities.length != 0 && postCommunities.map((com: any, index: number) => {
                  return <CommunityExploreCard key={index} community={com} isTop={false}/>
                })}
              </div>
            </div>
          </div>
        </main>
      </MainLayout>      
    );
}
