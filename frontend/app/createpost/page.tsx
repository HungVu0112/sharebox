'use client'

import DropdownIcon from "../../public/angle-up-solid-black.svg";
import UserGroup from "../../public/user-group-solid.svg";
import ImageIcon from "@/public/camera-solid.svg";
import VideoIcon from "@/public/clapperboard-solid.svg";
import LoadingIcon from "@/public/spinner-solid-white.svg";

import MainLayout from "@/components/mainLayout";
import { AddTopicDropdown } from "@/components/topicDropdown";
import { Anime, Game, Manga, Movie, Music, Sport } from "@/components/topics";
import Image from "next/image";
import { useEffect, useState } from "react";
import ImageSlide from "@/components/imageSlide";
import VideoSlide from "@/components/videoSlide";
import axios from "axios";
import ToastMessage from "@/components/toastMessage";
import { useRouter } from "next/navigation";

export default function CreatePost() {
    const router = useRouter();
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const [topic, setTopic] = useState<number>(0);
    const [selectedImages, setSelectedImages] = useState<string[]>();
    const [selectedVideos, setSelectedVideos] = useState<string[]>();
    const [chooseTopic, setChooseTopic] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [fileArr, setFileArr] = useState<{
        file: File,
        url: string
    }[]>([]);
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
    const [postContent, setPostContent] = useState<{
        title: string,
        content: string
    }>({
        title: "",
        content: ""
    });
    const [error, setError] = useState<{
        title: boolean,
        content: boolean
    }>({
        title: false,
        content: false
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setPostContent((prev: any) => ({
            ...prev,
            [name]: value,
        }));
        setError({
            title: false,
            content: false
        })
    }

    const handleUploadImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        let files = e.target.files;
        console.log("in");
        if (!files) return;

        let previewSrc : string[] = selectedImages ? [...selectedImages] : [];
        let previewFileArr : {
            file: File,
            url: string
        }[] = [...fileArr];

        Array.from(files).forEach((file : File) => {
            const url = file && URL.createObjectURL(file);
            previewSrc.push(url);
            const save = {
                file: file,
                url: url
            }
            previewFileArr.push(save);
        });
        
        setFileArr(previewFileArr);
        setSelectedImages(previewSrc);

        e.target.value = "";
    }

    const handleUploadVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
        let files = e.target.files;
        if (!files) return;

        let previewSrc : string[] = selectedVideos ? [...selectedVideos] : [];
        let previewFileArr : {
            file: File,
            url: string
        }[] = [...fileArr];

        Array.from(files).forEach((file : File) => {
            const url = file && URL.createObjectURL(file);
            previewSrc.push(url);
            const save = {
                file: file,
                url: url
            }
            previewFileArr.push(save);
        });
        
        setFileArr(previewFileArr);
        setSelectedVideos(previewSrc);

        e.target.value = "";
    }

    const handleDeleteMedia = (url: string) => {
        const newFileArr = fileArr.filter(fileObj => fileObj.url !== url);
        setFileArr(newFileArr);

        const checkImage = selectedImages?.filter(urlImage => urlImage !== url);
        if (checkImage?.length != selectedImages?.length) setSelectedImages(checkImage);

        const checkVideo = selectedVideos?.filter(urlVideo => urlVideo !== url);
        if (checkVideo?.length != selectedVideos?.length) setSelectedVideos(checkVideo);
    }

    const handleSubmit = async () => {
        const newError = { ...error };
        if (postContent.title == "") {
            newError.title = true;
        }
        if (postContent.content == "") {
            newError.content = true;
        }
        setError(newError);

        if (!topic) setChooseTopic(true);

        if (postContent.title && postContent.content && topic) {
            const mediaArr = fileArr.map(item => item.file);
            console.log(mediaArr);
            
            const formData = new FormData();
            formData.append("title", postContent.title);
            formData.append("content", postContent.content);
            mediaArr.forEach((file) => {
                formData.append("media", file);
            });
            formData.append("postTopics", topic.toString());
            
            setFetching(true);
            const res = await axios.post(
                `http://localhost:8080/authentication/post/create-post/${user.userId}`,
                formData
            )
            setFetching(false);
            if (res.data.result) {
                setMessage({
                    type: "success",
                    message: "Successfully created!",
                    redirect: true
                })
                setShowMessage(true);
                setTimeout(() => {
                    router.push("/");
                }, 3000)
            }
        }        
    }
    
    return (
        <MainLayout>
            <main className={`relative select-none w-full py-6 flex gap-8 ${selectedImages && selectedImages.length != 0 || selectedVideos && selectedVideos.length != 0 ? "px-8" : "justify-center"} duration-300 ease-in-out`}>
                <title>Share Box | Create Post</title>
                <div className="w-[60%]">
                    <p className="text-3xl font-bold text-textHeadingColor">Create post</p>

                    <div className="mt-8 w-[240px] h-[40px] px-4 bg-boxBackground rounded-full flex items-center justify-between  cursor-pointer">
                        <Image
                            src={UserGroup}
                            alt="UserGroup Icon"
                            className="w-[20px]"
                        />
                        <p>Select a community</p>
                        <Image
                            src={DropdownIcon}
                            alt="Dropdown Icon"
                            className="w-[18px] -rotate-180"
                        />
                    </div>

                    <div className={`mt-16 relative w-full h-[70px] border ${error.title ? "border-red-600" : "border-lineColor"} py-4 px-6 rounded-xl`}>
                        <label className="orms-input">
                            <input type="text" onChange={handleChange} name="title" className="border-none w-full h-full outline-none" required />
                            <span className="flex gap-1 bg-white orms-input-label text-xl absolute top-[20px] left-[20px] ">
                                Title
                                <p className="text-red-600">*</p>
                            </span>
                        </label>
                        <p className={` absolute -bottom-[30px] right-0 ${postContent.title.length > 300 && "text-red-600"}`}>{postContent.title.length}/300</p>
                    </div>
                    
                    <div className="mt-14 w-full relative">
                        {!topic && chooseTopic && 
                            <div className="left-32 absolute rounded-md p-2 h-[40px] bg-warningMessageBackground text-white">
                                <p>Please choose a topic</p>
                            </div>
                        }
                        <AddTopicDropdown setTopic={setTopic} />
                        <div className="absolute left-[120px]">
                            {topic == 1 && <Music isSmall isHaveBg canHover={false} />}
                            {topic == 2 && <Game isSmall isHaveBg canHover={false} />}
                            {topic == 3 && <Anime isSmall isHaveBg canHover={false} />}
                            {topic == 4 && <Movie isSmall isHaveBg canHover={false} />}
                            {topic == 5 && <Manga isSmall isHaveBg canHover={false} />}
                            {topic == 6 && <Sport isSmall isHaveBg canHover={false} />}
                        </div>
                        <div className="absolute right-0 flex gap-4 ">
                            <label htmlFor="images" className="flex items-center justify-center w-[40px] h-[40px] bg-boxBackground rounded-full hover:scale-[1.1] cursor-pointer">
                                <Image 
                                    src={ImageIcon}
                                    alt="Image Icon"
                                    className="w-[15px]"
                                />
                                <input id="images" multiple onChange={handleUploadImages} type="file" className="hidden" accept="image/png, image/jpeg"/>
                            </label>
                            <label htmlFor="videos" className="flex items-center justify-center w-[40px] h-[40px] bg-boxBackground rounded-full hover:scale-[1.1] cursor-pointer">
                                <Image 
                                    src={VideoIcon}
                                    alt="Video Icon"
                                    className="w-[15px]"
                                />
                                <input id="videos" multiple onChange={handleUploadVideos} type="file" className="hidden" accept="video/*"/>
                            </label>
                        </div>
                    </div>

                    <div className={`mt-[8.5rem] relative w-full border ${error.content ? "border-red-600" : "border-lineColor"} py-4 px-6 rounded-xl`}>
                        <label className="orms-textarea">
                            <textarea onChange={handleChange} name="content" className="border-none w-full h-[100px] outline-none" required />
                            <span className="flex gap-1 orms-textarea-label  bg-white text-xl absolute top-[20px] left-[20px]">
                                Body
                                <p className="text-red-600">*</p>
                            </span>
                        </label>
                    </div>

                    <div className="mt-8 flex justify-end w-full">
                        <button onClick={handleSubmit} className="flex items-center justify-center gap-2 w-[100px] h-[40px] rounded-full bg-mainColor text-sm text-white font-bold hover:scale-[1.05]">
                            <p>CREATE</p>
                            {fetching && 
                                <Image 
                                    src={LoadingIcon}
                                    alt="Loading Icon"
                                    className="w-[15px] animate-spin"
                                />
                            }
                        </button>
                    </div>
                </div>

                <div className={`${selectedImages && selectedImages.length != 0 || selectedVideos && selectedVideos.length != 0 ? "w-[37%]" : "hidden"}`}>
                    {selectedImages && selectedImages?.length != 0 && <ImageSlide handleDelete={handleDeleteMedia} urlArr={selectedImages} />}
                    {selectedVideos && selectedVideos?.length != 0 && <VideoSlide handleDelete={handleDeleteMedia} urlArr={selectedVideos} />}
                </div>
            {showMessage ? <ToastMessage type={message.type} message={message.message} redirect={message.redirect} setShowMessage={setShowMessage}/> : <></>}
            </main>
        </MainLayout>
    )
}