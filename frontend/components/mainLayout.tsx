'use client'

import Header from "@/components/header";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

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

    return (
        <main className="relative w-full h-min-[100vh]">
            <Header user={user.avatar && user} />
            <div className="flex">
                <Navbar />
                <div className="absolute top-[80px] left-[300px] p-6 w-[calc(100%-300px)]">
                    {children}
                </div>
            </div>
        </main>
    )
}