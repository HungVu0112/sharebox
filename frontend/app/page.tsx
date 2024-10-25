'use client'

import MainLayout from "@/components/mainLayout";
import PostCard from "@/components/postCard";
import Image from "next/image";
import { ChooseTopicDropdown } from "@/components/topicDropdown";
import { useEffect, useState } from "react"; 
import axios from "axios";

export default function Home() {
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {}; 
    const [topic, setTopic] = useState<string>("0");
    const [fetching, setFetching] = useState<boolean>(false);
    const [posts, setPosts] = useState([]);

    const getRecommendPost = async () => {
      setFetching(true);
      const res = await axios.get(`http://localhost:8080/authentication/post/recommend-posts/${user.userId}`)
      setFetching(false);
      if (res.data.result) {
        console.log(res.data.result);
        setPosts(res.data.result.reverse());
      }
    }

    const getPostByTopic = async (topicId: string) => {
      setFetching(true);
      const res = await axios.get(`http://localhost:8080/authentication/post/${topicId}`)
      setFetching(false);
      if (res.data.result) {
        setPosts(res.data.result.reverse());
      }
    }

    useEffect(() => {
      switch (topic) {
        case "1":
          getPostByTopic("1");
          break;
        case "2":
          getPostByTopic("2");
          break;
        case "3":
          getPostByTopic("3");
          break;
        case "4":
          getPostByTopic("4");
          break;
        case "5":
          getPostByTopic("5");
          break;
        case "6":
          getPostByTopic("6");
          break;
        default:
          getRecommendPost();
          break;
      }
    }, [topic])

    return (
      <MainLayout>
        <main className="w-full p-4">
          <title>Home</title>
          <div className="w-[70%] h-[60px] border-b border-b-lineColor">
            <ChooseTopicDropdown topic={topic} setTopic={setTopic} />
          </div>
          <div className="w-[70%]">
            {posts && posts.map((post: any) => {
              return <PostCard key={post.postId} data={post} canNavigate/>
            })}
          </div>
        </main>
      </MainLayout>      
    );
}
