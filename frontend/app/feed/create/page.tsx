'use client'

import LoadingIcon from "@/public/spinner-solid-white.svg";
import MainLayout from "@/components/mainLayout";
import ToastMessage from "@/components/toastMessage";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateFeed() {
    const router = useRouter();
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const [data, setData] = useState<{
        name: string,
        description: string
    }>({
        name: "",
        description: ""
    });
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState<{
      type: string,
      message: string,
      redirect: boolean
    }>({
      type: "",
      message: "",
      redirect: false
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (e.target.name == "name" && e.target.value.length <= 30 || e.target.name == "description" && e.target.value.length <= 200) {
            setData((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    const handleSubmit = async() => {
        if (data.name != "" && data.description != "") {
            setIsFetching(true);
            const res = await axios.post(
                `http://localhost:8080/authentication/custom-feed/create/${user.userId}`,
                {
                    name: data.name,
                    description: data.description
                }
            )

            if (res.data.result) {
                setIsFetching(false);
                setMessage({
                    type: "success",
                    message: "Successfully created!",
                    redirect: true
                })
                setShowMessage(true);
                setTimeout(() => {
                    router.push(`/feed/${res.data.result.customfeedId}`)
                }, 2000)
            }
        }
    }

    return (
        <MainLayout>
            <main className="w-full h-[calc(100vh-112px)] flex items-center justify-center select-none">
                <title>Create Feed</title>
                <div className="w-[650px] shadow-2xl rounded-lg p-10">
                    <h1 className="text-textHeadingColor font-bold text-[32px]">CREATE FEED</h1>
                    <div className={`relative w-full h-[70px] border py-4 px-6 rounded-xl mt-8`}>
                        <label className="orms-input">
                            <input value={data.name} onChange={handleChange} type="text" name="name" className="border-none w-full h-full outline-none" required />
                            <span className="flex gap-1 bg-white orms-input-label text-xl absolute top-[20px] left-[20px] ">
                                Name
                                <p className="text-red-600">*</p>
                            </span>
                        </label>
                        <p className={`absolute -bottom-[25px] right-0 text-sm ${data.name.length == 30 && "text-red-400"}`}>{30 - data.name.length}</p>
                    </div>

                    <div className={`mt-8 relative w-full border py-4 px-6 rounded-xl`}>
                        <label className="orms-textarea">
                            <textarea value={data.description} onChange={handleChange} name="description" className="border-none w-full h-[100px] outline-none" required />
                            <span className="flex gap-1 orms-textarea-label  bg-white text-xl absolute top-[20px] left-[20px]">
                                Description
                                <p className="text-red-600">*</p>
                            </span>
                            <p className={`absolute -bottom-[25px] right-0 text-sm ${data.description.length == 200 && "text-red-400"}`}>{200 - data.description.length}</p>
                        </label>
                    </div>

                    <div className="mt-10 w-full flex justify-end">
                        <div onClick={handleSubmit} className="cursor-pointer w-[100px] h-[40px] bg-mainColor rounded-lg text-white hover:scale-[1.05] duration-150 flex items-center justify-center gap-2">
                            <p>Create</p>
                            {isFetching &&
                                <Image
                                    src={LoadingIcon}
                                    alt="Loading Icon"
                                    className="w-[15px] animate-spin"
                                />
                            }
                        </div>
                    </div>
                </div>
                {showMessage && <ToastMessage type={message.type} message={message.message} redirect={message.redirect} setShowMessage={setShowMessage} position="top-right"/>}
            </main>
        </MainLayout>
    )
}