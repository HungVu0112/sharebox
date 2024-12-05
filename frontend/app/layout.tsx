
'use client'
import { ChatroomProvider } from "@/context/ChatroomContext";
import "./globals.css";
import { FriendReqListProvider } from "@/context/FriendReqContext";
import { NotiProvider } from "@/context/NotiContext";
import { OnlineFriendProvider } from "@/context/OnlineFriendContext";
import { SelectedRoomProvider } from "@/context/SelectedRoomContext";
import { ChatroomListProvider } from "@/context/ChatroomListContext";
import { UnreadMesProvider } from "@/context/UnreadMesContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/parachute-box-solid.svg" />
      </head>
      <body>
        <UnreadMesProvider>
          <ChatroomListProvider>
            <SelectedRoomProvider>
              <ChatroomProvider>
                <OnlineFriendProvider>
                  <FriendReqListProvider>
                    <NotiProvider>
                      {children}
                    </NotiProvider>
                  </FriendReqListProvider>  
                </OnlineFriendProvider>  
              </ChatroomProvider>
            </SelectedRoomProvider>
          </ChatroomListProvider>  
        </UnreadMesProvider>
      </body>
    </html>
  );
}
