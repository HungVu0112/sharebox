'use client'

import Header from "@/components/header";
import Navbar from "@/components/navbar";
import websocketService from "@/websoket/websocket-service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatBox from "./chatBox";
import ChatroomIcon from "./chatroomIcon";

export default function MainLayout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const router = useRouter();
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};

    if (!user.userId) {
        router.replace("/login");
    }

    useEffect(() => {
        try {
            websocketService.connect(user.userId);

            return () => {
                websocketService.disconnect();
            }
        } catch (error) {
            console.log(error);
        }
    }, [])

    return (
        <main className="relative w-full h-min-[100vh]">
            <Header user={user.avatar && user} />
            <div className="flex">
                <Navbar />
                <div className="absolute top-[80px] left-[300px] p-4 w-[calc(100%-300px)]">
                    {children}
                </div>
            </div>
            <ChatBox/>
            <ChatroomIcon/>
        </main>

    )
}