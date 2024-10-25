'use client'

import { Anime, Game, Manga, Movie, Music, Sport } from "@/components/topics";
import Plus from "../public/plus-solid-gray.svg";
import Arrow from "@/public/angle-up-solid.svg";
import Image from "next/image";

import { SetStateAction, useRef } from "react";

export function AddTopicDropdown({ setTopic } : { setTopic: (value: SetStateAction<number>) => void }) {
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
                <p className="text-textGrayColor1 text-sm">Add Topic</p>
                <Image 
                    src={Plus}
                    alt="Plus Icon"
                    className="w-[15px]"
                />
            </div>
            <div ref={topicListRef} className="flex flex-col gap-2 max-h-0 duration-100 ease-linear">
                <div onClick={() => {
                    handleClick();
                    setTopic(1)}}>
                    <Music canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic(2)}}>
                    <Game canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic(3)}}>
                    <Anime canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic(4)}}>
                    <Movie canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic(5)}}>
                    <Manga canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic(6)}}>
                    <Sport canHover isSmall isHaveBg={false}/>
                </div>
            </div>
        </div>
    )
}

export function ChooseTopicDropdown({ topic, setTopic } : { topic: string, setTopic: (value: SetStateAction<string>) => void }) {
    const topicListRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLImageElement>(null);

    const handleClick = () => {
        topicListRef.current?.classList.toggle("max-h-0");
        topicListRef.current?.classList.toggle("max-h-[400px]");
        topicListRef.current?.classList.toggle("border");
        dropdownRef.current?.classList.toggle("-rotate-180");
    }

    return (
        <div className="w-[160px] flex flex-col items-center absolute rounded-2xl z-40 bg-white">
            <div onClick={handleClick} className="flex gap-2 items-center justify-center rounded-full select-none cursor-pointer">
                {topic == "0" && 
                    <div className="h-[40px] flex items-center">
                        <p className="text-textGrayColor1 text-lg">Recommend</p>
                    </div>}
                {topic == "1" && <Music isHaveBg={false} isSmall={false} canHover={false} />}
                {topic == "2" && <Game isHaveBg={false} isSmall={false} canHover={false} />}
                {topic == "3" && <Anime isHaveBg={false} isSmall={false} canHover={false} />}
                {topic == "4" && <Movie isHaveBg={false} isSmall={false} canHover={false} />}
                {topic == "5" && <Manga isHaveBg={false} isSmall={false} canHover={false} />}
                {topic == "6" && <Sport isHaveBg={false} isSmall={false} canHover={false} />}
                <Image
                    ref={dropdownRef}
                    src={Arrow}
                    alt="Arrow Icon"
                    className="w-[15px] -rotate-180 transition-transform duration-200"
                />
            </div>
            <div ref={topicListRef} className="overflow-hidden mt-2 w-[110px] border-mainColor flex flex-col gap-2 max-h-0 duration-100 ease-in-out rounded-lg">
                <div className="flex items-center justify-center w-[110px] h-[40px] border-b border-b-lineColor select-none">
                    <p>Sort by</p>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("0");
                }} className="flex text-textGrayColor1 items-center justify-center w-[110px] h-[40px] cursor-pointer hover:bg-textHeadingColor hover:scale-[1.05] duration-100">
                    <p>Recommend</p>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("1")}}>
                    <Music canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("2")}}>
                    <Game canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("3")}}>
                    <Anime canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("4")}}>
                    <Movie canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("5")}}>
                    <Manga canHover isSmall isHaveBg={false}/>
                </div>
                <div onClick={() => {
                    handleClick();
                    setTopic("6")}}>
                    <Sport canHover isSmall isHaveBg={false}/>
                </div>
            </div>
        </div>
    )
}