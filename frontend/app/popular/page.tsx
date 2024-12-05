'use client'

import MainLayout from "@/components/mainLayout";
import OnlineCard from "@/components/onlineCard";
import PostCard from "@/components/postCard";
import RecentCard from "@/components/recentCard";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Popular() {
    const [posts, setPosts] = useState<any[]>([]);
    const recentString = sessionStorage.getItem("recent");
    const recent = recentString ? JSON.parse(recentString) : []; 

    useEffect(() => {
      const getAllPost = async () => {
        const res = await axios.get(`http://localhost:8080/authentication/post/all-posts`)
        if (res.data.result) {
          res.data.result.sort((a: any, b: any) => {
            const votesA = Number(a.voteCount);
            const votesB = Number(b.voteCount);
        
            if (votesB !== votesA) {
              return votesB - votesA;
            }
      
            return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
          });
          setPosts([...res.data.result]);
        }
      }
      getAllPost();
    }, [])

    return (
      <MainLayout>
        <main className="relative w-full p-6">
          <title>Popular Posts</title>
          <div className="w-[70%]">
            {posts && posts.map((post: any) => {
              return <PostCard key={post.postId} data={post} canNavigate isInCom={false}/>
            })}
          </div>
          <div className="fixed w-[20%] top-[110px] right-8">
            <div className="w-full max-h-[400px] border border-lineColor rounded-lg p-5">
              <h1 className="text-xl text-textHeadingColor font-semibold">Recents</h1>
              <div className="w-full max-h-[300px] mt-4 flex flex-col gap-4 overflow-y-scroll com">
                {recent && recent.length == 0 ? 
                  <p className="text-sm text-center text-textGrayColor1 font-bold">Haven't seen anything !</p>
                  :
                  <>
                    {
                      recent?.reverse().map((recentItem: any, index: number) => {
                        return <RecentCard key={index} data={recentItem}/>
                      })
                    }
                  </>
                }
              </div>
            </div>
          </div>
          <OnlineCard />
        </main>
      </MainLayout>      
    );
}
