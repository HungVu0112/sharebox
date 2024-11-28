'use client'

import Image from "next/image";
import CameraIcon from "../../../public/camera-solid.svg";
import ArrowIcon from "../../../public/arrow-right-solid.svg";
import LoadingIcon from "../../../public/spinner-solid.svg";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserInfo() {
    const router = useRouter();
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};

    const [avatar, setAvatar] = useState<string>(user.avatar);
    const [username, setUsername] = useState<string>(user.username);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: any) => {
        const newUsername = e.target.value;
        setUsername(newUsername);
    }

    const handleSubmit = async () => {
        if (username != user.username) {
            const formData = new FormData();
            formData.append("username", username);
            const res = await axios.put(
                `http://localhost:8080/authentication/users/update/${user.userId}`,
                formData
            )

            if (res.data.result) {
                const updatedUser = {
                    ...user,
                    username: username,
                };
                sessionStorage.setItem("user", JSON.stringify(updatedUser));
                router.push("/setupuser/usertopic");
            }            
        } else {
            router.push("/setupuser/usertopic");
        }
    }

    const handleUploadImage = async (e: any) => {
        let file = e.target.files[0];

        if (!file) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        setIsLoading(true);
        const res = await axios.post(
            `http://localhost:8080/authentication/users/${user.userId}/upload-avatar`,
            formData
        )
        
        if (res.data) {
            const url = res.data.match(/https?:\/\/[^\s]+/);
            const avatarURL = url ? url[0] : null;
            const newUser = {
                ...user,
                avatar: avatarURL
            }
            sessionStorage.setItem("user", JSON.stringify(newUser));
            setAvatar(avatarURL);
            setIsLoading(false);
        }
    }
    
    return (
        <main className="w-[800px] h-[600px] bg-lightWhiteColor rounded-2xl flex flex-col items-center">
            <title>Share Box | Username & Avatar</title> 
            <section className="w-[250px] h-[250px] rounded-full mt-10 border border-inputBorderColor relative">
                <img 
                    src={avatar}
                    alt="Avatar"
                    width={250}
                    height={250}
                    className="w-full h-full rounded-full"
                />

                {isLoading ? 
                    <Image
                        src={LoadingIcon}
                        alt="Loading Icon"
                        className="animate-spin absolute w-[40px] bottom-0 right-[28px]"
                    />
                :
                    <label htmlFor="files">
                        <Image
                            src={CameraIcon}
                            alt="Camera Icon"
                            className="absolute w-[40px] bottom-0 right-[28px] hover:scale-[1.05] duration-100 cursor-pointer"
                        />

                        <input id="files" type="file" className="hidden" onChange={(e) => handleUploadImage(e)} accept="image/png, image/jpeg"/>
                    </label>
                }
            </section>

            <input type="text" value={username} onChange={handleChange} className="mt-16 w-[70%] h-[70px] text-lg text-white p-4 rounded-xl bg-buttonColor outline-none placeholder:text-white" placeholder="Username"/>

            <button onClick={handleSubmit} className="flex items-center justify-center mt-14 w-[80px] h-[80px] rounded-full bg-lightButtonColor hover:scale-[1.03] duration-100 cursor-pointer">
                <Image
                    src={ArrowIcon}
                    alt="Arrow Icon"
                    className="w-[30px]"
                />
            </button>
        </main>
    )
}