'use client'

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};

    if (!user.userId) {
      router.replace("/login");
    }
    
    return (
      <main className="w-full h-[100vh] bg-red-400">
        <title>Share Box</title>
        {user.userTopics ? user.userTopics.map((topic: any, index: number) => {
          return <p key={index}>{topic.contentTopic}</p>
        }) : <></>}
      </main>
    );
}
