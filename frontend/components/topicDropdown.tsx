'use client'

import { Anime, Game, Manga, Movie, Music, Sport } from "@/components/topics";
import Plus from "../public/plus-solid-gray.svg"
import Image from "next/image";

import { SetStateAction, useRef } from "react";

export function AddTopicDropdown({ setTopic } : { setTopic: (value: SetStateAction<string>) => void }) {
    const addTagRef = useRef<HTMLDivElement>(null);
    const topicListRef = useRef<HTMLDivElement>(null);
    const container = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        addTagRef.current?.classList.toggle("bg-boxBackground");
        topicListRef.current?.classList.toggle("max-h-0");
        topicListRef.current?.classList.toggle("max-h-[400px]");
        container.current?.classList.toggle("border");
    }

    return (
        <div ref={container} className="absolute w-[110px] border-mainColor rounded-2xl overflow-hidden z-50 bg-white">
            <div onClick={handleClick} ref={addTagRef} className="w-[110px] h-[40px] flex gap-2 items-center justify-center rounded-full bg-boxBackground select-none cursor-pointer">
                <p className="text-textGrayColor1 text-sm">Add Tags</p>
                <Image 
                    src={Plus}
                    alt="Plus Icon"
                    className="w-[15px]"
                />
            </div>
            <div ref={topicListRef} className="flex flex-col gap-2 max-h-0 duration-100 ease-linear">
                <div onClick={() => {
                    handleClick();
                    setTopic("music")}}>
                    <Music canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("game")}}>
                    <Game canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("anime")}}>
                    <Anime canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("movie")}}>
                    <Movie canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("manga")}}>
                    <Manga canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("sport")}}>
                    <Sport canHover isSmall isHaveBg={false}/>
                </div>
            </div>
        </div>
    )
}