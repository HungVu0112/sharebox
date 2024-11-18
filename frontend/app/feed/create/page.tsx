'use client'

import MainLayout from "@/components/mainLayout";
import { useState } from "react";

export default function CreateFeed() {
    const [data, setData] = useState<{
        name: string,
        description: string
    }>({
        name: "",
        description: ""
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

                    <div className="w-full flex justify-end">
                        <button className="w-[100px] h-[40px] rounded-md bg-mainColor cursor-pointer hover:scale-[1.05] duration-150 text-white mt-12">
                            Create
                        </button>
                    </div>
                </div>
            </main>
        </MainLayout>
    )
}