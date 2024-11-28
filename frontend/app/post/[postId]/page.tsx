'use client'

import NavigateIcon from "@/public/angle-up-solid-black.svg";
import SendIcon from "@/public/paper-plane-solid-pink.svg";

import MainLayout from "@/components/mainLayout";
import PostCard from "@/components/postCard";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import Image from "next/image";
import CommentCard from "@/components/commentCard";

type PostPageProps = {
    params: {
      postId: string;
    };
};

export default function PostPage({ params }: PostPageProps) {
    const router = useRouter();
    const { postId } = params;
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const [post, setPost] = useState<any>(null);
    const [comment, setComment] = useState<any>(null);
    const [cmtContent, setCmtContent] = useState<string>("");
    const [reload, setReload] = useState<number>(0);
    
    const handleNavigate = () => {
        router.back();
    }

    const handleSendComment = async() => {
        if (cmtContent != "") {
            const res = await axios.post(
                `http://localhost:8080/authentication/comment/create/${user.userId}/${postId}`,
                {
                    "content": cmtContent
                }
            )

            if (res.data.code == 1000) {
                setReload(n => n+1);
            }
        }
    }

    useEffect(() => {
        setCmtContent("");
        const fetchData = async() => {
            const res = await axios.get(`http://localhost:8080/authentication/post/get/${postId}`)
            if(res.data.result) {
                setPost(res.data.result);
            }
        }
        fetchData();

        const getComment = async() => {
            const res = await axios.get(`http://localhost:8080/authentication/comment/parent/${postId}`)
            if (res.data.result) {
                setComment(res.data.result.reverse());
            }
        }
        getComment();
    }, [reload])

    return (
        <MainLayout>
            {post && 
                <main className="relative w-full min-h-[130vh] flex justify-center">
                    <title>{post?.title}</title>
                    <div onClick={handleNavigate} className="absolute -rotate-90 left-[30px] top-[36px] cursor-pointer w-[50px] h-[50px] flex items-center justify-center rounded-full hover:bg-slate-200">
                        <Image
                            src={NavigateIcon}
                            alt="Navigate Icon"
                            className="w-[20px]"
                        />
                    </div>

                    <div className="w-[70%]">
                        <PostCard data={post} canNavigate={false} isInCom={false}/>
                        <div id="myCmt" className="w-full h-[80px] p-4 flex items-center justify-between">
                            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                <img src={post?.userAvatar} alt="userAvatar" />
                            </div>
                            <input value={cmtContent} onChange={(e) => setCmtContent(e.target.value)} type="text" className="w-[85%] h-[60px] p-4 border border-lineColor outline-none rounded-full" placeholder={`Add a comment with ${post?.username}`}/>
                            <div onClick={handleSendComment} className="w-[60px] h-[60px] rounded-full hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                                <Image 
                                    src={SendIcon}
                                    alt="Send Icon"
                                    className="w-[30px]"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            {comment && comment?.length == 0 ?
                                <p className="text-lg text-center text-textGrayColor1 fon-bold">There arent any comments yet !</p>
                                :
                                <>
                                    {comment?.map((cmt: any, index: number) => {
                                        return <CommentCard key={index} data={cmt} setReload={setReload}/>
                                    })}
                                </>
                            }
                        </div>
                    </div>
                </main>
            }
        </MainLayout>
    )
}