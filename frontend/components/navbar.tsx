import HouseIcon from "../public/house-solid.svg";
import FireIcon from "../public/fire-solid.svg";
import ExploreIcon from "../public/users-viewfinder-solid-white.svg";
import EarthIcon from "../public/earth-asia-solid.svg";
import HouseBlackIcon from "../public/house-solid-black.svg";
import FireBlackIcon from "../public/fire-solid-black.svg";
import ExploreBlackIcon from "../public/users-viewfinder-solid.svg";
import EarthBlackIcon from "../public/earth-asia-solid-black.svg";
import Dropdown from "../public/angle-up-solid.svg";
import PlusIcon from "../public/plus-solid-black.svg";

import Image from "next/image";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import CommunityCard from "./communityCard";
import CustomFeedCard from "./customFeedCard";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const home = useRef<HTMLAnchorElement>(null);
    const popular = useRef<HTMLAnchorElement>(null);
    const explore = useRef<HTMLAnchorElement>(null);
    const all = useRef<HTMLAnchorElement>(null);
    const feeds = useRef<HTMLDivElement>(null);
    const communities = useRef<HTMLDivElement>(null);
    const [communityList, setCommunityList] = useState<any>();
    const [customFeedList, setCustomFeedList] = useState<any>();

    useEffect(() => {
        home.current?.classList.remove("active");
        popular.current?.classList.remove("active");
        explore.current?.classList.remove("active");
        all.current?.classList.remove("active");

        switch (pathname) {
            case "/":
                home.current?.classList.add("active");
                break;
            case "/popular":
                popular.current?.classList.add("active");
                break;
            case "/explore":
                explore.current?.classList.add("active");
                break;
            case "/all":
                all.current?.classList.add("active");
                break;
        }
    }, [pathname]);

    useEffect(() => {
        const getCommunityList = async() => {
            const res = await axios.get(
                `http://localhost:8080/authentication/community/user/${user.userId}`
            )
            if (res.data.result) setCommunityList(res.data.result);
        }
        getCommunityList();
        const getCustomFeedList = async() => {
            const res = await axios.get(
                `http://localhost:8080/authentication/custom-feed/user/${user.userId}`
            )
            if (res.data.result) setCustomFeedList(res.data.result);
        }
        getCustomFeedList();
    },[])

    return (
        <div className="fixed top-[80px] left-0 p-4 w-[300px] h-[calc(100vh-80px)] border-r border-r-lineColor select-none overflow-y-scroll com">
            <div className="border-b border-b-lineColor">
                <Link
                    href="/"
                    ref={home}
                    className="mb-4 flex gap-3 items-center px-8 py-4 w-full h-[60px] rounded-3xl"
                >
                    <Image
                        src={pathname === "/" ? HouseIcon : HouseBlackIcon}
                        alt="House Icon"
                        className="w-[25px]"
                    />
                    <p className="text-lg font-bold">Home</p>
                </Link>

                <Link
                    href="/popular"
                    ref={popular}
                    className="mb-4 flex gap-3 items-center px-8 py-4 w-full h-[60px] rounded-3xl"
                >
                    <Image
                        src={pathname === "/popular" ? FireIcon : FireBlackIcon}
                        alt="Fire Icon"
                        className="w-[25px]"
                    />
                    <p className="text-lg font-bold">Popular</p>
                </Link>

                <Link
                    href="/explore"
                    ref={explore}
                    className="mb-4 flex gap-3 items-center px-8 py-4 w-full h-[60px] rounded-3xl"
                >
                    <Image
                        src={pathname === "/explore" ? ExploreIcon : ExploreBlackIcon}
                        alt="Explore Icon"
                        className="w-[25px]"
                    />
                    <p className="text-lg font-bold">Explore</p>
                </Link>

                <Link
                    href="/all"
                    ref={all}
                    className="mb-4 flex gap-3 items-center px-8 py-4 w-full h-[60px] rounded-3xl"
                >
                    <Image
                        src={pathname === "/all" ? EarthIcon : EarthBlackIcon}
                        alt="Earth Icon"
                        className="w-[25px]"
                    />
                    <p className="text-lg font-bold">All</p>
                </Link>
            </div>

            <div className="p-4 border-b border-b-lineColor">
                <div className="flex justify-between items-center">
                    <p className="text-textGrayColor1 font-bold text-[22px]">Custom Feeds</p>
                    <Image
                        src={Dropdown}
                        alt="Dropdown Icon"
                        className="w-[20px] -rotate-180 transition-transform duration-200 hover:scale-[1.1] cursor-pointer"
                        onClick={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.classList.toggle("-rotate-180");
                            feeds.current?.classList.toggle("max-h-0");
                            feeds.current?.classList.toggle("max-h-[300px]");
                        }}
                    />
                </div>
                <div
                    ref={feeds}
                    className="mt-2 overflow-hidden duration-200 ease-linear max-h-0"
                >
                    <div className="flex gap-2">
                        <Image
                            src={PlusIcon}
                            alt="Plus Icon"
                            className="w-[20px] hover:scale-[1.1] cursor-pointer"
                            onClick={() => {router.push("/feed/create")}}
                        />
                        <p className="text-lg">Create a custom feeds</p>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 max-h-[250px] overflow-y-scroll com">
                        {customFeedList && customFeedList?.map((customFeed: any, index: number) => {
                            return <CustomFeedCard key={index} customFeed={customFeed}/>
                        })}
                    </div>
                </div>
            </div>

            <div className="p-4 border-b border-b-lineColor">
                <div className="flex justify-between items-center">
                    <p className="text-textGrayColor1 font-bold text-[22px]">Communities</p>
                    <Image
                        src={Dropdown}
                        alt="Dropdown Icon"
                        className="w-[20px] -rotate-180 transition-transform duration-200 hover:scale-[1.1] cursor-pointer"
                        onClick={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.classList.toggle("-rotate-180");
                            communities.current?.classList.toggle("max-h-0");
                            communities.current?.classList.toggle("max-h-[300px]");
                        }}
                    />
                </div>
                <div
                    ref={communities}
                    className="mt-2 overflow-hidden duration-300 ease-linear max-h-0"
                >   
                    <div className="flex gap-2">
                        <Image
                            src={PlusIcon}
                            alt="Plus Icon"
                            className="w-[20px] hover:scale-[1.1] cursor-pointer"
                            onClick={() => {router.push("/community/create")}}
                        />
                        <p className="text-lg">Create a community</p>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 max-h-[250px] overflow-y-scroll com">
                        {communityList && communityList?.map((community: any, index: number) => {
                            return <CommunityCard key={index} community={community}/>
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
