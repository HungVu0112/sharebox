'use client'

import Image from "next/image";
import loginImage from '../../public/login_image.svg';
import loginImage2 from '../../public/login_image_2.svg';
import gmailIcon from '../../public/envelope-regular.svg';
import lockIcon from '../../public/lock-solid.svg';
import googleIcon from '../../public/google_icon.svg';
import eyeSlashIcon from '../../public/eye-slash-solid.svg';
import eyeIcon from '../../public/eye-solid.svg';
import warningIcon from "../../public/triangle-exclamation-solid.svg";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import ToastMessage from "@/components/toastMessage";
import { log } from "console";
import { authValid } from "@/validation/validation";

export default function Login() {
    const router = useRouter();
    const [isShowed, setIsShowed] = useState<boolean>(false);
    const [errors, setErrors] = useState<{
      email: string,
      password: string
    }>({
      email: "",
      password: ""
    });
    const [showMessage, setShowMessage] = useState<boolean>(false);
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
      email: string,
      password: string
    }>({
      email: "",
      password: ""
    });

    const handleChange = (e: any) => {
      const { name, value } = e.target;
        setData((prev: any) => ({
            ...prev,
            [name]: value,
        }));

      const validationErrors = authValid({ ...data, [name]: value });
      setErrors(validationErrors);
    }

    const handleLoginWithGoogle = () => {
      window.location.href =
        "http://localhost:8080/authentication/oauth2/authorization/google"
    }

    const handleSubmit = async () => {
      if (errors.email == "" && errors.password == "" && data.email != "" && data.password != "") {
        try {
          const res = await axios.post(
            `http://localhost:8080/authentication/auth/login`,
            {
              "userEmail": data.email,
              "password": data.password
            }
          )    
          
          if (res.data.result) {
            const user = new Object({
              ...res.data.result.user,
              token: res.data.result.token
            })
            sessionStorage.setItem("user", JSON.stringify(user));
            setMessage({
              type: "success",
              message: "Successfully logined!",
              redirect: true
            })
            setShowMessage(true);
            setTimeout(() => {
              router.push('/');
            }, 2000)
          }
        } catch (error) {
          setMessage({
            type: "warning",
            message: "Wrong email or password!",
            redirect: false
          })
          setShowMessage(true);
        }
      }
    }

    useEffect(() => {
      const urlParam = new URLSearchParams(window.location.search);
      const code = urlParam.get("code");

      if (code) {
        const fetchAccessToken = async () => {
          const res = await axios.post(process.env.NEXT_PUBLIC_GOOGLE_TOKEN_ENDPOINT!, {
            code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
          });

          const { access_token } = res.data;
          
          // Dùng access token để lấy thông tin người dùng
          const userInfoRes = await axios.get(process.env.NEXT_PUBLIC_GOOGLE_USERINFO_ENDPOINT!, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (userInfoRes.data) {
            console.log(userInfoRes);
            
            try {
              const formData = new FormData();
              formData.append("email", userInfoRes.data.email);
              formData.append("username", userInfoRes.data.name);
              formData.append("avatar", userInfoRes.data.picture);

              const res = await axios.post(
                "http://localhost:8080/authentication/users/google/login",
                formData
              )

              if (res.data.result) {
                sessionStorage.setItem("user", JSON.stringify(res.data.result));
                setMessage({
                  type: "success",
                  message: "Successfully logined!",
                  redirect: true
                })
                setShowMessage(true);
                setTimeout(() => {
                  if (res.data.result.status == "new") {
                    router.push("/setupuser/userinfo");
                  } else {
                    router.push("/");
                  }
                }, 2000)
              }
            } catch (error) {
              setMessage({
                type: "warning",
                message: "Account already exists! Try login with credentials!",
                redirect: false
              })
              setShowMessage(true);
              router.push("/login");
            }
          }
        }

        fetchAccessToken();
      }
    }, [])

    return (
        <main className="relative w-full h-[100vh] flex items-center py-[64px] pl-[64px] overflow-hidden">
          <title>Share box | Login</title>
          <section className="w-[50%] h-[650px] bg-imageBackground relative rounded-2xl">
            <Image 
              src={loginImage}
              alt="Login Image"
              className="absolute w-[80%] left-[-50px] top-[100px]"
            />
            <Image 
              src={loginImage2}
              alt="Disc Image"
              className="absolute w-[60%] right-[-140px] top-[-40px]"
            />
          </section>
          
          <section className="w-[50%] h-[650px] flex flex-col pt-[64px] pl-[128px] pr-[64px] items-center">
            <h1 className="text-4xl font-bold text-center select-none">LOGIN</h1>
            
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
                  <input onChange={handleChange} name="email" type="email" className="w-[85%] h-full text-xl outline-none" placeholder="Email"/>
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
                  <input onChange={handleChange} name="password" type={isShowed ? "text" : "password"} className="w-[85%] h-full text-xl outline-none" placeholder="Password"/>
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
    
            <button onClick={handleSubmit} className="mt-[64px] w-[80%] h-[70px] bg-buttonColor rounded-xl text-white font-bold text-2xl hover:scale-[1.01] ease-linear duration-100 shadow-lg">
              LOGIN
            </button>
            
            <h1 className="mt-2 middle-line w-[80%] select-none">
              Or continue with
            </h1>
            
            <button onClick={handleLoginWithGoogle} className="mt-2 w-[50px] h-[50px] flex items-center justify-center border border-textGrayColor2 rounded-[100%] shadow-lg hover:scale-[1.05] ease-linear duration-100">
              <Image
                src={googleIcon}
                alt="Google Icon"
                className="w-[20px] h-[20px]"
              />
            </button>
    
            <p className="mt-4 font-semibold select-none">
              Don't have an account ? <Link href="/signup" className="text-textGrayColor1 hover:underline underline-offset-4">Sign Up here</Link>
            </p>
          </section>
          {showMessage ? <ToastMessage type={message.type} message={message.message} redirect={message.redirect} setShowMessage={setShowMessage}/> : <></>}
        </main>
    );
}