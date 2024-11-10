'use client'

import NavigateIcon from "@/public/angle-up-solid-black.svg";

import MainLayout from "@/components/mainLayout";
import PostCard from "@/components/postCard";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import Image from "next/image";

type PostPageProps = {
    params: {
      postId: string;
    };
};

export default function PostPage({ params }: PostPageProps) {
    const router = useRouter();
    const { postId } = params;
    const [post, setPost] = useState<any>(null);
    
    const handleNavigate = () => {
        router.back();
    }

    useEffect(() => {
        const fetchData = async() => {
            const res = await axios.get(`http://localhost:8080/authentication/post/get/${postId}`)
            if(res.data.result) {
                setPost(res.data.result);
            }
        }
        fetchData();
    }, [])

    
    return (
        <MainLayout>
            {post && 
                <main className="relative w-full px-6">
                    <title>{post?.title}</title>
                    <Image
                        src={NavigateIcon}
                        alt="Navigate Icon"
                        className="w-[20px] absolute -rotate-90 left-[-1px] top-[50px] cursor-pointer hover:scale-[1.1]"
                        onClick={handleNavigate}
                    />

                    <div className="w-[70%]">
                        <PostCard data={post} canNavigate={false} />
                    </div>
                </main>
            }
        </MainLayout>
    )
}