'use client'

import Image from "next/image";
import signupImage from '../../public/signup_image.svg';
import signupImage2 from '../../public/signup_image_2.svg';
import gmailIcon from '../../public/envelope-regular.svg';
import lockIcon from '../../public/lock-solid.svg';
import googleIcon from '../../public/google_icon.svg';
import eyeSlashIcon from '../../public/eye-slash-solid.svg';
import eyeIcon from '../../public/eye-solid.svg';
import warningIcon from "../../public/triangle-exclamation-solid.svg";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Link from "next/link";
import ToastMessage from "@/components/toastMessage";
import { authValid } from "@/validation/validation";

export default function Signup() {
    const router = useRouter();
    const [isShowed, setIsShowed] = useState<boolean>(false);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [errors, setErrors] = useState<{
      email: string,
      password: string
    }>({
      email: "",
      password: ""
    });
    const [message, setMessage] = useState<{
      type: string,
      message: string,
      redirect: boolean
    }>({
      type: "",
      message: "",
      redirect: false
    });
    const [data, setData] = useState<{
      email: string | Blob,
      password: string | Blob
    }>({
      email: "",
      password: ""
    })

    const handleChange = (e: any) => {
      const { name, value } = e.target;
        setData((prev: any) => ({
            ...prev,
            [name]: value,
        }));

      const validationErrors = authValid({ ...data, [name]: value });
      setErrors(validationErrors);
    }

    const handleSubmit = async () => {
      if (errors.email == "" && errors.password == "" && data.email != "" && data.password != "") {
        try {
          const formData = new FormData();
          formData.append("userEmail", data.email);
          formData.append("password", data.password);
  
          const res = await axios.post(
            "http://localhost:8080/authentication/users/register",
            formData
          )
          
          if (res.data.result) {
            sessionStorage.setItem("user", JSON.stringify(res.data.result));
            setMessage({
              type: "success",
              message: "Successfully created account!",
              redirect: true
            })
            setShowMessage(true);
            setTimeout(() => {
              router.push('/setupuser/userinfo');
            }, 2000)
          }
        } catch (error) {
          setMessage({
            type: "warning",
            message: "Account already exists! Try login with credentials!",
            redirect: false
          })
          setShowMessage(true);
        }
      }
    }

    return (
        <main className="relative w-full h-[100vh] flex items-center py-[64px] pl-[64px] overflow-hidden">
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
                  <input type="email" name="email" onChange={handleChange} className="w-[85%] h-full text-xl outline-none" placeholder="Email"/>
                </div>
                {errors.email && 
                  <div className="ml-7 mt-2 -mb-4 flex gap-2 items-center">
                    <Image 
                      src={warningIcon}
                      alt="Warning Icon"
                      className="w-[20px]"
                    />
                    <p className="text-[16px] text-warningMessageBackground font-bold">{errors.email}</p>
                  </div>
                }
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
                  <input type={isShowed ? "text" : "password"} name="password" onChange={handleChange} className="w-[85%] h-full text-xl outline-none" placeholder="Password"/>
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
                {errors.password && 
                  <div className="ml-7 mt-2 -mb-4 flex gap-2 items-center">
                    <Image 
                      src={warningIcon}
                      alt="Warning Icon"
                      className="w-[20px]"
                    />
                    <p className="text-[16px] text-warningMessageBackground font-bold">{errors.password}</p>
                  </div>
                }
              </div>
            </div>
    
            <button onClick={handleSubmit} className="mt-[64px] w-[80%] h-[70px] flex items-center justify-center bg-buttonColor rounded-xl text-white font-bold text-2xl hover:scale-[1.01] ease-linear duration-100 shadow-lg cursor-pointer">
              SIGN UP
            </button>
    
            <p className="mt-4 font-semibold select-none">
              Already have an account ? <Link href="/login" className="text-textGrayColor1 hover:underline underline-offset-4">Login here</Link>
            </p>
          </section>
          {showMessage ? <ToastMessage type={message.type} message={message.message} redirect={message.redirect} setShowMessage={setShowMessage}/> : <></>}
        </main>
      );
}