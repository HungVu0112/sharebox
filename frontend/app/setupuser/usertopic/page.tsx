'use client'

import Image from "next/image";
import ArrowIcon from "../../../public/arrow-right-solid.svg";
import MusicImage from "../../../public/music_image.svg";
import GameImage from "../../../public/game_image.svg";
import AnimeImage from "../../../public/anime_image.svg";
import MovieImage from "../../../public/movie_image.svg";
import MangaImage from "../../../public/manga_image.svg";
import SportImage from "../../../public/sport_image.svg";
import CheckIcon from "../../../public/check-solid.svg";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserTopic() {
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const router = useRouter();

    const [chooseMusic, setChooseMusic] = useState<boolean>(false);
    const [chooseGame, setChooseGame] = useState<boolean>(false);
    const [chooseAnime, setChooseAnime] = useState<boolean>(false);
    const [chooseMovie, setChooseMovie] = useState<boolean>(false);
    const [chooseManga, setChooseManga] = useState<boolean>(false);
    const [chooseSport, setChooseSport] = useState<boolean>(false);

    const handleSubmit = async () => {
        var topicList = [];
        
        if (chooseMusic) topicList.push(1);
        if (chooseGame) topicList.push(2);
        if (chooseAnime) topicList.push(3);
        if (chooseMovie) topicList.push(4);
        if (chooseManga) topicList.push(5);
        if (chooseSport) topicList.push(6);

        const res = await axios.post(
            `http://localhost:8080/authentication/users/${user.userId}/select-topics`,
            {
                "topicsId": topicList
            }
        ) 

        if (res.data.result) {
            const updatedUser = {
                ...user,
                userTopics: res.data.result.userTopics,
            };
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
            router.push("/");            
        }
    }

    return (
        <main className="w-[800px] h-[570px] bg-lightWhiteColor rounded-2xl px-10 py-8 pb-0">
            <title>Share Box | User Topic</title>
            <h1 className="text-2xl text-buttonColor font-semibold select-none">
                Find your cup of tea
            </h1>

            <section className="mt-8 w-full flex flex-wrap gap-4">
                <div onClick={e => setChooseMusic(!chooseMusic)} className="h-[108px] w-[352px] relative rounded-xl hover:scale-[1.02] duration-100 cursor-pointer">
                    <Image
                        src={MusicImage}
                        alt="Music Image"
                        className="w-[350px] rounded-xl"
                    />
                    {chooseMusic ? (
                        <div className="absolute flex justify-end items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl">
                            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-mainColor">
                                <Image 
                                    src={CheckIcon}
                                    alt="Check Icon"
                                    className="w-[30px] select-none"
                                />
                            </div>
                        </div>
                    ) : 
                    (
                        <div className="absolute flex items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl bg-lightBlackColor">
                            <p className="text-mainColor text-4xl font-bold select-none">MUSIC</p>
                        </div>

                    )}
                </div>
                <div onClick={e => setChooseGame(!chooseGame)} className="h-[108px] w-[352px] relative rounded-xl hover:scale-[1.02] duration-100 cursor-pointer">
                    <Image
                        src={GameImage}
                        alt="Game Image"
                        className="w-[350px] rounded-xl"
                    />
                    {chooseGame ? (
                        <div className="absolute flex justify-end items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl">
                            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-mainColor">
                                <Image 
                                    src={CheckIcon}
                                    alt="Check Icon"
                                    className="w-[30px] select-none"
                                />
                            </div>
                        </div>
                    ) : 
                    (
                        <div className="absolute flex items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl bg-lightBlackColor">
                            <p className="text-mainColor text-4xl font-bold select-none">GAME</p>
                        </div>
                    )}
                </div>
                <div onClick={e => setChooseAnime(!chooseAnime)} className="h-[108px] w-[352px] relative rounded-xl hover:scale-[1.02] duration-100 cursor-pointer">
                    <Image
                        src={AnimeImage}
                        alt="Anime Image"
                        className="w-[350px] rounded-xl"
                    />
                    {chooseAnime ? (
                        <div className="absolute flex justify-end items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl">
                            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-mainColor">
                                <Image 
                                    src={CheckIcon}
                                    alt="Check Icon"
                                    className="w-[30px] select-none"
                                />
                            </div>
                        </div>
                    ) : 
                    (
                        <div className="absolute flex items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl bg-lightBlackColor">
                            <p className="text-mainColor text-4xl font-bold select-none">ANIME</p>
                        </div>
                    )}
                </div>
                <div onClick={e => setChooseMovie(!chooseMovie)} className="h-[108px] w-[352px] relative rounded-xl hover:scale-[1.02] duration-100 cursor-pointer">
                    <Image
                        src={MovieImage}
                        alt="Movie Image"
                        className="w-[350px] rounded-xl"
                    />
                    {chooseMovie ? (
                        <div className="absolute flex justify-end items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl">
                            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-mainColor">
                                <Image 
                                    src={CheckIcon}
                                    alt="Check Icon"
                                    className="w-[30px] select-none"
                                />
                            </div>
                        </div>
                    ) : 
                    (
                        <div className="absolute flex items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl bg-lightBlackColor">
                            <p className="text-mainColor text-4xl font-bold select-none">MOVIE</p>
                        </div>
                    )}
                </div>
                <div onClick={e => setChooseManga(!chooseManga)} className="h-[108px] w-[352px] relative rounded-xl hover:scale-[1.02] duration-100 cursor-pointer">
                    <Image
                        src={MangaImage}
                        alt="Manga Image"
                        className="w-[350px] rounded-xl"
                    />
                    {chooseManga ? (
                        <div className="absolute flex justify-end items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl">
                            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-mainColor">
                                <Image 
                                    src={CheckIcon}
                                    alt="Check Icon"
                                    className="w-[30px] select-none"
                                />
                            </div>
                        </div>
                    ) : 
                    (
                        <div className="absolute flex items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl bg-lightBlackColor">
                            <p className="text-mainColor text-4xl font-bold select-none">MANGA</p>
                        </div>
                    )}
                </div>
                <div onClick={e => setChooseSport(!chooseSport)} className="h-[108px] w-[352px] relative rounded-xl hover:scale-[1.02] duration-100 cursor-pointer">
                    <Image
                        src={SportImage}
                        alt="Sport Image"
                        className="w-[350px] rounded-xl"
                    />
                    {chooseSport ? (
                        <div className="absolute flex justify-end items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl">
                            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-mainColor">
                                <Image 
                                    src={CheckIcon}
                                    alt="Check Icon"
                                    className="w-[30px] select-none"
                                />
                            </div>
                        </div>
                    ) : 
                    (
                        <div className="absolute flex items-center p-6 top-0 left-0 w-[350px] h-[106px] rounded-xl bg-lightBlackColor">
                            <p className="text-mainColor text-4xl font-bold select-none">SPORT</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="mt-4 w-full flex justify-center">
                <button onClick={handleSubmit} className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-lightButtonColor hover:scale-[1.03] duration-100 cursor-pointer">
                    <Image
                        src={ArrowIcon}
                        alt="Arrow Icon"
                        className="w-[30px]"
                    />
                </button>   
            </section>
        </main>
    )
}