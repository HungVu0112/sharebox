'use client'

import DropdownIcon from "../../public/angle-up-solid-black.svg";
import UserGroup from "../../public/user-group-solid.svg";
import ImageIcon from "@/public/camera-solid.svg";
import VideoIcon from "@/public/clapperboard-solid.svg";

import MainLayout from "@/components/mainLayout";
import { AddTopicDropdown } from "@/components/topicDropdown";
import { Anime, Game, Manga, Movie, Music, Sport } from "@/components/topics";
import Image from "next/image";
import { useState } from "react";
import ImageCard from "@/components/imageCard";
import VideoCard from "@/components/videoCard";
import ImageSlide from "@/components/imageSlide";
import VideoSlide from "@/components/videoSlide";

export default function CreatePost() {
    const [topic, setTopic] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<string[]>();
    const [selectedVideos, setSelectedVideos] = useState<string[]>();
    const [fileArr, setFileArr] = useState<{
        file: File,
        url: string
    }[]>([]);
    const [postContent, setPostContent] = useState<{
        title: string,
        content: string
    }>({
        title: "",
        content: ""
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setPostContent((prev: any) => ({
            ...prev,
            [name]: value,
        }));
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
    
    return (
        <MainLayout>
            <main className={`w-full py-6 flex gap-8 ${selectedImages && selectedImages.length != 0 || selectedVideos && selectedVideos.length != 0 ? "px-8" : "px-16"} duration-200 ease-linear`}>
                <title>Share Box | Create Post</title>
                <div className="w-[60%]">
                    <p className="text-3xl font-bold text-textHeadingColor">Create post</p>

                    <div className="mt-8 w-[240px] h-[40px] px-4 bg-boxBackground rounded-full flex items-center justify-between select-none cursor-pointer">
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

                    <div className="mt-16 relative w-full h-[70px] border border-lineColor py-4 px-6 rounded-xl">
                        <label className="orms-input">
                            <input type="text" onChange={handleChange} name="title" className="border-none w-full h-full outline-none" required />
                            <span className="flex gap-1 bg-white orms-input-label text-xl absolute top-[20px] left-[20px]">
                                Title
                                <p className="text-red-600">*</p>
                            </span>
                        </label>
                        <p className={`absolute -bottom-[30px] right-0 ${postContent.title.length > 300 && "text-red-600"}`}>{postContent.title.length}/300</p>
                    </div>
                    
                    <div className="mt-14 w-full relative">
                        <AddTopicDropdown setTopic={setTopic} />
                        <div className="absolute left-[150px]">
                            {topic == "music" && <Music isSmall isHaveBg canHover={false} />}
                            {topic == "game" && <Game isSmall isHaveBg canHover={false} />}
                            {topic == "anime" && <Anime isSmall isHaveBg canHover={false} />}
                            {topic == "movie" && <Movie isSmall isHaveBg canHover={false} />}
                            {topic == "manga" && <Manga isSmall isHaveBg canHover={false} />}
                            {topic == "sport" && <Sport isSmall isHaveBg canHover={false} />}
                        </div>
                        <div className="absolute right-0 flex gap-4">
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

                    <div className="mt-[8.5rem] relative w-full border border-lineColor py-4 px-6 rounded-xl">
                        <label className="orms-textarea">
                            <textarea onChange={handleChange} name="content" className="border-none w-full h-[100px] outline-none" required />
                            <span className="flex gap-1 orms-textarea-label bg-white text-xl absolute top-[20px] left-[20px]">
                                Body
                                <p className="text-red-600">*</p>
                            </span>
                        </label>
                    </div>

                    <div className="mt-8 flex justify-end w-full">
                        <button className="w-[100px] h-[40px] rounded-full bg-mainColor text-sm text-white font-bold hover:scale-[1.05]">
                            CREATE
                        </button>
                    </div>
                </div>

                <div className="w-[37%]">
                    {selectedImages && selectedImages?.length != 0 && <ImageSlide handleDelete={handleDeleteMedia} urlArr={selectedImages} />}
                    {selectedVideos && selectedVideos?.length != 0 && <VideoSlide handleDelete={handleDeleteMedia} urlArr={selectedVideos} />}
                </div>
            </main>
        </MainLayout>
    )
}