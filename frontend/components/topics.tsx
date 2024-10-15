import Image from "next/image";
import MusicWhiteIcon from "../public/music-solid-white.svg";
import MusicGrayIcon from "../public/music-solid.svg";
import CloseIcon from "../public/xmark-solid.svg";
import GameWhiteIcon from "../public/gamepad-solid-white.svg";
import GameGrayIcon from "../public/gamepad-solid.svg";
import AnimeWhiteIcon from "../public/dragon-solid-white.svg";
import AnimeGrayIcon from "../public/dragon-solid.svg";
import MovieWhiteIcon from "../public/film-solid-white.svg";
import MovieGrayIcon from "../public/film-solid.svg";
import MangaWhiteIcon from "../public/book-skull-solid-white.svg";
import MangaGrayIcon from "../public/book-skull-solid.svg";
import SportWhiteIcon from "../public/volleyball-solid-white.svg";
import SportGrayIcon from "../public/volleyball-solid.svg";


export function Music({ isHaveBg, isSmall, canHover }: { isHaveBg: boolean, isSmall: boolean, canHover: boolean }) {
    return (
        <div className={`relative select-none flex items-center justify-center gap-2 ${canHover ? "cursor-pointer hover:bg-textHeadingColor hover:scale-[1.05] duration-100" : "rounded-full"} ${isHaveBg && "bg-mainColor"} ${isSmall ? "w-[110px] h-[40px]" : "w-[150px] h-[60px]"} }`}>
            <Image 
                src={isHaveBg ? MusicWhiteIcon : MusicGrayIcon}
                alt="Music Icon"
                className={`${isSmall ? "w-[20px]" : "w-[30px]" }`}
            />
            <p className={`${isHaveBg ? "text-white" : "text-textGrayColor1"} ${!isSmall && "text-[24px]"}`}>Music</p>
        </div>
    )
}

export function Game({ isHaveBg, isSmall, canHover }: { isHaveBg: boolean, isSmall: boolean, canHover: boolean }) {
    return (
        <div className={`relative select-none flex items-center justify-center gap-2 ${canHover ? "cursor-pointer hover:bg-textHeadingColor hover:scale-[1.05] duration-100" : "rounded-full"} ${isHaveBg && "bg-mainColor"} ${isSmall ? "w-[110px] h-[40px]" : "w-[150px] h-[60px]"} }`}>
            <Image 
                src={isHaveBg ? GameWhiteIcon : GameGrayIcon}
                alt="Game Icon"
                className={`${isSmall ? "w-[25px]" : "w-[35px]" }`}
            />
            <p className={`${isHaveBg ? "text-white" : "text-textGrayColor1"} ${!isSmall && "text-[24px]"}`}>Game</p>
        </div>
    )
}

export function Anime({ isHaveBg, isSmall, canHover }: { isHaveBg: boolean, isSmall: boolean, canHover: boolean }) {
    return (
        <div className={`relative select-none flex items-center justify-center gap-2 ${canHover ? "cursor-pointer hover:bg-textHeadingColor hover:scale-[1.05] duration-100" : "rounded-full"} ${isHaveBg && "bg-mainColor"} ${isSmall ? "w-[110px] h-[40px]" : "w-[150px] h-[60px]"} }`}>
            <Image 
                src={isHaveBg ? AnimeWhiteIcon : AnimeGrayIcon}
                alt="Anime Icon"
                className={`${isSmall ? "w-[20px]" : "w-[30px]" }`}
            />
            <p className={`${isHaveBg ? "text-white" : "text-textGrayColor1"} ${!isSmall && "text-[24px]"}`}>Anime</p>
        </div>
    )
}

export function Movie({ isHaveBg, isSmall, canHover }: { isHaveBg: boolean, isSmall: boolean, canHover: boolean }) {
    return (
        <div className={`relative select-none flex items-center justify-center gap-2 ${canHover ? "cursor-pointer hover:bg-textHeadingColor hover:scale-[1.05] duration-100" : "rounded-full"} ${isHaveBg && "bg-mainColor"} ${isSmall ? "w-[110px] h-[40px]" : "w-[150px] h-[60px]"} }`}>
            <Image 
                src={isHaveBg ? MovieWhiteIcon : MovieGrayIcon}
                alt="Movie Icon"
                className={`${isSmall ? "w-[20px]" : "w-[30px]" }`}
            />
            <p className={`${isHaveBg ? "text-white" : "text-textGrayColor1"} ${!isSmall && "text-[24px]"}`}>Movie</p>
        </div>
    )
}

export function Manga({ isHaveBg, isSmall, canHover }: { isHaveBg: boolean, isSmall: boolean, canHover: boolean }) {
    return (
        <div className={`relative select-none flex items-center justify-center gap-2 ${canHover ? "cursor-pointer hover:bg-textHeadingColor hover:scale-[1.05] duration-100" : "rounded-full"} ${isHaveBg && "bg-mainColor"} ${isSmall ? "w-[110px] h-[40px]" : "w-[150px] h-[60px]"} }`}>
            <Image 
                src={isHaveBg ? MangaWhiteIcon : MangaGrayIcon}
                alt="Manga Icon"
                className={`${isSmall ? "w-[18px]" : "w-[25px]" }`}
            />
            <p className={`${isHaveBg ? "text-white" : "text-textGrayColor1"} ${!isSmall && "text-[24px]"}`}>Manga</p>
        </div>
    )
}

export function Sport({ isHaveBg, isSmall, canHover }: { isHaveBg: boolean, isSmall: boolean, canHover: boolean }) {
    return (
        <div className={`relative select-none flex items-center justify-center gap-2 ${canHover ? "cursor-pointer hover:bg-textHeadingColor hover:scale-[1.05] duration-100" : "rounded-full"} ${isHaveBg && "bg-mainColor"} ${isSmall ? "w-[110px] h-[40px]" : "w-[150px] h-[60px]"} }`}>
            <Image 
                src={isHaveBg ? SportWhiteIcon : SportGrayIcon}
                alt="Sport Icon"
                className={`${isSmall ? "w-[20px]" : "w-[30px]" }`}
            />
            <p className={`${isHaveBg ? "text-white" : "text-textGrayColor1"} ${!isSmall && "text-[24px]"}`}>Sport</p>
        </div>
    )
}