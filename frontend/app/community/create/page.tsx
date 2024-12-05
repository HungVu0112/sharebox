'use client'

import MainLayout from "@/components/mainLayout";
import OnCirleIcon from "@/public/circle-solid-pink.svg";
import OffCirleIcon from "@/public/circle-solid-gray.svg";
import ImageIcon from "@/public/camera-solid.svg";
import Image from "next/image";
import LoadingIcon from "@/public/spinner-solid-white.svg";
import TrashIcon from "@/public/trash-solid-red.svg";


import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ToastMessage from "@/components/toastMessage";

export default function CreateCommunity() {
    const router = useRouter();
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
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
    const [pageIdx, setPageIdx] = useState<number>(1);
    const [data, setData] = useState<{
        name: string,
        description: string,
    }>({
        name: "",
        description: "",
    });
    const [avatar, setAvatar] = useState<{
        file: File,
        url: string
    }>();
    const [backgroundImg, setBackgroundImg] = useState<{
        file: File,
        url: string
    }>();

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (e.target.name == "name" && e.target.value.length <= 30 || e.target.name == "description" && e.target.value.length <= 200) {
            setData((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    const handleChangeBgImg = (e: React.ChangeEvent<HTMLInputElement> | any) => {
        let file = e.target.files[0];
        if (!file) return;

        const url = file && URL.createObjectURL(file);
        
        setBackgroundImg({
            file,
            url
        }) 
    }

    const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement> | any) => {
        let file = e.target.files[0];
        if (!file) return;

        const url = file && URL.createObjectURL(file);
        
        setAvatar({
            file,
            url
        }) 
    }

    const handleSubmit = async() => {
        setIsFetching(true);
        const res = await axios.post(
            `http://localhost:8080/authentication/community/create/${user.userId}`,
            {
                name: data.name,
                description: data.description
            }
        )

        if (res.data.result) {
            const avatarFormData = new FormData();
            if (avatar?.file) {
                avatarFormData.append("avatar", avatar?.file)
            }
            
            await axios.post(
                `http://localhost:8080/authentication/community/${res.data.result.communityId}/upload-avatar`,
                avatarFormData
            )

            const bgImgFormData = new FormData();
            if (backgroundImg?.file) {
                bgImgFormData.append("backgroundImg", backgroundImg?.file)
            }
            
            await axios.post(
                `http://localhost:8080/authentication/community/${res.data.result.communityId}/upload-background`,
                bgImgFormData
            )

            setIsFetching(false);
            setMessage({
                type: "success",
                message: "Successfully created!",
                redirect: true
            })
            setShowMessage(true);
            setTimeout(() => {
                router.push(`/community/${res.data.result.communityId}`)
            }, 2000)
        }
        
    }

    return (
        <MainLayout>
            <main className="relative w-full h-[calc(100vh-112px)] flex items-center justify-center select-none overflow-hidden">
                <title>Create Community</title>
                {pageIdx == 1 && 
                    <div className="w-[900px] shadow-2xl rounded-lg p-10">
                        <h1 className="text-textHeadingColor font-bold text-[32px]">CREATE COMMUNITY</h1>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="w-[30px] h-[30px] rounded-full bg-slate-500 text-white flex items-center justify-center">
                                <p className="font-bold text-sm">1</p>
                            </div>
                            <p className="">Name and Description</p>
                        </div>
                        
                        <div className="mt-8 w-full flex">
                            <div className="w-[50%]">
                                <div className={`relative w-full h-[70px] border py-4 px-6 rounded-xl`}>
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
                            </div>
                            <div className="w-[50%] flex justify-center break-words">
                                <div className="w-[80%] h-fit rounded-md shadow-xl p-4">
                                    <h1 className="font-bold text-lg text-textHeadingColor">{data.name ? data.name : "Your community name"}</h1>
                                    <p className="text-textGrayColor1 text-sm">1 member</p>
                                    <p className="">{data.description ? data.description : "Your community description"}</p>
                                </div>                            
                            </div>
                        </div>

                        <div className="flex mt-8 justify-between">
                            <div className="flex gap-1">
                                <Image 
                                    src={OnCirleIcon}
                                    alt="Circle Icon"
                                    className="w-[13px]"
                                />
                                <Image 
                                    src={OffCirleIcon}
                                    alt="Circle Icon"
                                    className="w-[10px]"
                                />
                            </div>
                            <button onClick={() => {setPageIdx(n => n+1)}} className="w-[100px] h-[40px] bg-mainColor rounded-lg text-white hover:scale-[1.05] duration-150">
                                Next
                            </button>
                        </div>                        
                    </div>
                }

                {pageIdx == 2 && 
                    <div className="w-[900px] shadow-2xl rounded-lg p-10">
                        <h1 className="text-textHeadingColor font-bold text-[32px]">CREATE COMMUNITY</h1>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="w-[30px] h-[30px] rounded-full bg-slate-500 text-white flex items-center justify-center">
                                <p className="font-bold text-sm">2</p>
                            </div>
                            <p className="">Avatar and Background Image</p>
                        </div>
                        
                        <div className="mt-8 w-full flex items-center">
                            <div className="w-[40%]">
                                <div className="flex w-full justify-between items-center p-4">
                                    <p>Background Image</p>
                                    <label htmlFor="bgImg" className="w-[120px] h-[40px] bg-boxBackground rounded-full flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.05] duration-150">
                                        <Image 
                                            src={ImageIcon}
                                            alt="Image Icon"
                                            className="w-[20px]"
                                        />
                                        <p>Change</p>
                                        <input onChange={handleChangeBgImg} id="bgImg" type="file" className="hidden" accept="image/png, image/jpeg"/>
                                    </label>
                                </div>
                                {backgroundImg &&
                                    <div className="mt-4 border border-lineColor flex w-full justify-between items-center h-[40px] rounded-lg p-4 shadow-lg">
                                        <div className="w-[80%]">
                                            <p className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">{backgroundImg?.file.name}</p>
                                        </div>
                                        <Image 
                                            src={TrashIcon}
                                            alt="Trash Icon"
                                            className="w-[15px] cursor-pointer hover:scale-[1.03] duration-150"
                                            onClick={() => setBackgroundImg(undefined)}
                                        />
                                    </div>
                                }
                                <div className="mt-6 flex w-full justify-between items-center p-4">
                                    <p>Avatar</p>
                                    <label htmlFor="avatar" className="w-[120px] h-[40px] bg-boxBackground rounded-full flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.05] duration-150">
                                        <Image 
                                            src={ImageIcon}
                                            alt="Image Icon"
                                            className="w-[20px]"
                                        />
                                        <p>Change</p>
                                        <input onChange={handleChangeAvatar} id="avatar" type="file" className="hidden" accept="image/png, image/jpeg"/>
                                    </label>
                                </div>
                                {avatar &&
                                    <div className="mt-4 border border-lineColor flex w-full justify-between items-center h-[40px] rounded-lg p-4 shadow-lg">
                                        <div className="w-[80%]">
                                            <p className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">{avatar?.file.name}</p>
                                        </div>
                                        <Image 
                                            src={TrashIcon}
                                            alt="Trash Icon"
                                            className="w-[15px] cursor-pointer hover:scale-[1.03] duration-150"
                                            onClick={() => setAvatar(undefined)}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="w-[60%] pl-8 py-4">
                                <div className="w-full rounded-md border  shadow-xl">
                                    <div className="w-full h-[40px] overflow-hidden rounded-tl-md rounded-tr-md">
                                        <img src={backgroundImg?.url} alt="" className="w-full object-contain"/>
                                    </div>
                                    <div className="w-full p-4 bg-textHeadingColor rounded-bl-md rounded-br-md break-words">
                                        <div className="w-full h-[80px] flex items-center gap-2">
                                            <div className="w-[60px] h-[60px] rounded-full bg-boxBackground overflow-hidden border border-white">
                                                {avatar?.url && 
                                                    <img src={avatar?.url} alt="" className="w-full h-full object-cover"/>
                                                }
                                            </div>
                                            <div className="">
                                                <h1 className="text-white text-lg font-bold">{data.name}</h1>
                                                <p className="text-sm text-textGrayColor1">1 member</p>
                                            </div>
                                        </div>
                                        <p className=" text-white">{data.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                        <div className="flex mt-8 justify-between">
                            <div className="flex gap-1">
                                <Image 
                                    src={OffCirleIcon}
                                    alt="Circle Icon"
                                    className="w-[10px]"
                                />
                                <Image 
                                    src={OnCirleIcon}
                                    alt="Circle Icon"
                                    className="w-[13px]"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => {setPageIdx(n => n-1)}} className="w-[100px] h-[40px] bg-mainColor rounded-lg text-white hover:scale-[1.05] duration-150">
                                    Back
                                </button>
                                <div onClick={handleSubmit} className="w-[100px] h-[40px] bg-mainColor rounded-lg text-white hover:scale-[1.05] duration-150 flex items-center justify-center gap-2"> 
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
                    </div>
                }
                {showMessage && <ToastMessage type={message.type} message={message.message} redirect={message.redirect} setShowMessage={setShowMessage} position="top-right"/>}
            </main>
        </MainLayout>
    )
}