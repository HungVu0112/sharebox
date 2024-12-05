import axios from "axios";
import { SetStateAction, useState } from "react";

export default function FriendReqCard({ user, setRefresh, ownerId }: { user: any, setRefresh: (value: SetStateAction<number>) => void, ownerId: number }) {
    const [status, setStatus] = useState<"PENDING" | "ACCEPT" | "REJECT">("PENDING");
    const handleAddFriend = async() => {
        await axios.post(
            `http://localhost:8080/authentication/friend/response?requesterId=${user.userId}&receiverId=${ownerId}&status=ACCEPTED`
        )
        setStatus("ACCEPT")
        setTimeout(() => {
            setRefresh(n=>n+1);
        }, 2000)
    }

    const handleDeclineFriend = async() => {
        await axios.post(
            `http://localhost:8080/authentication/friend/response?requesterId=${user.userId}&receiverId=${ownerId}&status=REJECTED`
        )
        setStatus("REJECT")
        setTimeout(() => {
            setRefresh(n=>n+1);
        }, 2000)
    }

    return (
        <div className="w-full p-4 flex items-center">
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover"/>
            </div>
            <div className="ml-6">
                <h3 className="text-textHeadingColor font-bold">{user.username}</h3>
                {status == "PENDING" &&
                    <div className="flex gap-3 mt-2">
                        <button onClick={handleAddFriend} className="w-[100px] p-1 text-sm bg-mainColor rounded-lg text-white hover:scale-[1.03] duration-150">
                            Accept
                        </button>
                        <button onClick={handleDeclineFriend} className="w-[100px] bg-voteDownColor rounded-lg text-white hover:scale-[1.03] duration-150">
                            Decline
                        </button>
                    </div>
                }

                {status == "ACCEPT" && 
                    <p className="text-sm text-textGrayColor1">You're now friend with {user.username}.</p>
                }

                {status == "REJECT" &&
                    <p className="text-sm text-textGrayColor1">You have declien request from {user.username}.</p>
                }
            </div>
        </div>
    )
}