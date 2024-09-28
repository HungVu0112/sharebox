'use client'

import Image from "next/image";
import signupImage from '../../public/signup_image.svg';
import signupImage2 from '../../public/signup_image_2.svg';
import gmailIcon from '../../public/envelope-regular.svg';
import lockIcon from '../../public/lock-solid.svg';
import googleIcon from '../../public/google_icon.svg';
import eyeSlashIcon from '../../public/eye-slash-solid.svg';
import eyeIcon from '../../public/eye-solid.svg';

import { useState, useEffect } from "react";

import Link from "next/link";

export default function Signup() {
    const [isShowed, setIsShowed] = useState<boolean>(false);

    return (
        <main className="w-full h-[100vh] flex items-center py-[64px] pl-[64px] overflow-hidden">
          <title>Share box | Sign Up</title>
          <section className="w-[50%] h-[650px] bg-imageBackground relative rounded-2xl">
            <Image 
              src={signupImage}
              alt="Sign up Image"
              className="absolute w-[90%] left-[-150px] top-[60px]"
            />
            <Image 
              src={signupImage2}
              alt="Box Image"
              className="absolute w-[50%] right-[-140px] top-[-120px]"
            />
          </section>
          
          <section className="w-[50%] h-[650px] flex flex-col pt-[64px] pl-[128px] pr-[64px] items-center">
            <h1 className="text-4xl font-bold text-center select-none">SIGN UP</h1>
            
            <div className="mt-8 w-[80%]">
              <div className="">
                <p className="text-xl select-none">Email</p>
                <div className="w-full h-[60px] mt-2 rounded-2xl border-2 border-textGrayColor2 flex p-2 focus-within:border-inputBorderColor">
                  <div className="w-[60px] h-full flex items-center justify-center mr-2">
                    <Image 
                      src={gmailIcon}
                      alt="Gmail Icon"
                      className="w-[25px]"
                    />
                  </div>
                  <div className="w-[3px] h-full bg-textGrayColor2 mr-3"></div>
                  <input type="email" className="w-[85%] h-full text-xl outline-none" placeholder="Email"/>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-xl select-none">Password</p>
                <div className="w-full h-[60px] mt-2 rounded-2xl border-2 border-textGrayColor2 flex p-2 focus-within:border-inputBorderColor relative">
                  <div className="w-[60px] h-full flex items-center justify-center mr-2">
                    <Image 
                      src={lockIcon}
                      alt="Lock Icon"
                      className="w-[20px]"
                    />
                  </div>
                  <div className="w-[3px] h-full bg-textGrayColor2 mr-3"></div>
                  <input type={isShowed ? "text" : "password"} className="w-[85%] h-full text-xl outline-none" placeholder="Password"/>
                  <div onClick={e => setIsShowed(!isShowed)} className="w-[5%] h-full absolute right-5 top-[30%] cursor-pointer">
                    {isShowed ? 
                        <Image 
                            src={eyeSlashIcon} 
                            alt="Eye Icon"
                        />
                        :
                        <Image 
                            src={eyeIcon} 
                            alt="Eye Icon"
                        />
                    }
                  </div>
                </div>
              </div>
            </div>
    
            <button className="mt-[64px] w-[80%] h-[70px] bg-buttonColor rounded-xl text-white font-bold text-2xl hover:scale-[1.01] ease-linear duration-100 shadow-lg">
              SIGN UP
            </button>
            
            <h1 className="mt-2 middle-line w-[80%] select-none">
              Or continue with
            </h1>
            
            <button className="mt-2 w-[50px] h-[50px] flex items-center justify-center border border-textGrayColor2 rounded-[100%] shadow-lg hover:scale-[1.05] ease-linear duration-100">
              <Image
                src={googleIcon}
                alt="Google Icon"
                className="w-[20px] h-[20px]"
              />
            </button>
    
            <p className="mt-4 font-semibold select-none">
              Already have an account ? <Link href="/login" className="text-textGrayColor1 hover:underline underline-offset-4">Login here</Link>
            </p>
          </section>
        </main>
      );
}