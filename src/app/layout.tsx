"use client"

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import menu from '@/image/menub.png'
import person from '@/image/user.png'
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import profilePic from "@/image/user.png"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [open, setOpen] = useState(false)
  function toggleMenu(){
    setOpen((prev) => !prev);
  }
  const router = useRouter()

  type dataType = {
    imgUrl: string,
    userName: string,
    email: string,
  }
  const [data, setData] = useState<dataType>({
    imgUrl: "",
    userName: "",
    email: "",
  });
  const userImage = data?.imgUrl

  useEffect(() => {
    const getUserDetail = async () => {
      const res = await axios.get('/api/users/me');
      setData(res.data.data);
    };
  
    const timeout = setTimeout(() => {
      getUserDetail();
    }, 2000); // Runs after 2 seconds
  
    return () => clearTimeout(timeout); // Cleanup on unmount
  }, []);


  const logout = async()=>{
    if(data?.userName){
        try {
            await axios.get("/api/users/logout")
            toast.success("logout successfull")
            router.replace("/login")
        } catch (error) {
            console.log(error);
        }
    }else{
        router.replace("/login")
    }  
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

<header>
        <div className="w-full  z-10 fixed top-0 h-14 ">
            <div className="w-full h-14 items-center flex justify-between bg-white shadow-blue-500 shadow-sm">
                <div className="px-2 text-black font-semibold text-3xl">
                    {/* <Image
                    src={logo} 
                    alt="logo"
                    className="h-10 rounded-sm w-28"
                    priority
                    /> */}
                    Laws & Legal
                </div>
                <div className="hidden text-black lg:flex">
                  <ul className="flex gap-8">
                    <li className="hover:text-zinc-500">
                      <Link href="/">
                      Home
                      </Link>
                    </li>
                    <li className="hover:text-zinc-500">
                      <Link href="/login">
                      Login
                      </Link>
                    </li>
                    <li className="hover:text-zinc-500">
                    <Link href="/signup">
                      Signup
                      </Link>
                    </li>
                    <li onClick={toggleMenu} className="hover:text-zinc-500">
                    <Link href="/admin">
                      Admin
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="flex gap-3 mr-5 ">
                    <Sheet>
                      <SheetTrigger>
                      
                        <Image
                        src={userImage || person} 
                        alt="user"
                        className="w-10 h-10 object-cover rounded-full"
                        width={80}
                        height={80}
                        unoptimized
                        priority
                        />
                      
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle></SheetTitle>
                          <SheetDescription>
                          <div className="" >
                          <Image
                              className="h-32 w-32 mt-10  rounded-lg object-cover"
                              src={userImage || profilePic}
                              alt="User Image"
                              width={80}
                              height={80}
                              unoptimized
                              />
                              <div className=" mt-2 text-xl text-left">
                                  <h1>{data?.userName}</h1>
                                  <h1 className="text-base">{data?.email}</h1>
                              </div>
                          </div>
                          <div className="w-full mt-5">
                          <Button  className="w-60  bg-zinc-100 text-zinc-950 hover:text-[#588157]">Edit Profile</Button>
                          <Button onClick={logout} className="w-60 mt-2  bg-red-400  hover:text-red-800">{data?.userName ? "Logout" : "Login"}</Button>
                          </div>
                          </SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                    <button onClick={toggleMenu} className="lg:hidden">
                        <Image
                        src={menu} 
                        alt="menu"
                        className="w-11"
                        priority 
                        />
                    </button>
                </div>
            </div>
        </div>
        <div className="top-16 flex lg:hidden text-black w-full h-14 fixed z-10">
            <div className={`h-12 flex ${open?"flex":"hidden"} items-center justify-center border-[1px] border-black shadow-sm shadow-black w-full bg-white`}>
            <ul className="flex gap-5">
                    <li onClick={toggleMenu} className="hover:text-zinc-500">
                      <Link href="/">
                      Home
                      </Link>
                    </li>
                    <li onClick={toggleMenu} className="hover:text-zinc-500">
                      <Link href="/login">
                      Login
                      </Link>
                    </li>
                    <li onClick={toggleMenu} className="hover:text-zinc-500">
                    <Link href="/signup">
                      Signup
                      </Link>
                    </li>
                    <li onClick={toggleMenu} className="hover:text-zinc-500">
                    <Link href="/admin">
                      Admin
                      </Link>
                    </li>
                  </ul>
            </div>       
        </div>
      </header>

        {children}
      </body>
    </html>
  );
}
