"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner"
import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export default function Home() {

  const [loading, setLoading] = useState(false);
  const notFilledMessage = "not filled by user"

  type prevReportType = {
    date: string;
    time: string;
    headline: string;
    content: string;
    fileUrl: string;
  }[];
  
  const [news, setNews] = useState<prevReportType>([]);
  
  type dataType = {
    userName: string,
    email: string,
  }
  const [data, setData] = useState<dataType>({
    userName: "",
    email: "",
  });

  useEffect(()=>{
   async function getUserDetail(){
    try {
      const res = await axios.get("/api/users/me")
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
   }
   getUserDetail()
  },[])

  useEffect(()=>{
    const fetchNews = async() => {
      try {
        setLoading(true);
        const res = await axios.get("/api/report/getReport");
        setNews(res.data.report)      
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
    fetchNews();
  },[])  

  //bg-[#ffe0e0]
  return (
   <>
   <div className="bg-zinc-950 pt-14 w-full">
    <div className="w-full ">
    <h1 className="text-6xl font-bold pt-20 px-5 text-zinc-100">Welcome Back <span className="text-blue-500">{data.userName}</span></h1>
    <h1 className="text-4xl font-bold pt-5 pb-3 px-5 text-zinc-100">Here are all listed news</h1>

    </div>
  
   
     <div className="w-full mt-10 py-10 bg-zinc-100 grid sm:grid-cols-2  lg:grid-cols-3 gap-3 items-center justify-center  ">
      {loading ? (
      <div className="text-black">
        Loading...
      </div>
      ) : ""}
     {
       news.map((rep, index)=>(
         <div key={index} className="mx-auto p-4">
           <div className=" bg-white shadow-lg rounded-md  p-4 ">
             {rep.fileUrl && (
             <div>
             <Image
             src={rep.fileUrl}
             alt="Task Image"
             width={80}
             height={80}
             unoptimized
             className="w-full h-40 object-cover rounded-sm"
             />
             <Popover>
             <PopoverTrigger asChild>
                 <button className='text-xs  rounded-none text-blue-500'>open file</button>
             </PopoverTrigger>
             <PopoverContent className="w-80 mx-5 ">
               <div>
               <Image
                 src={rep.fileUrl}
                 alt="Task Image"
                 width={80}
                 height={80}
                 unoptimized
                 className="w-full object-cover rounded-sm"
                 />
               </div>
             </PopoverContent>
             </Popover>
         </div>
             )}
             <div className="mt-3">
               <p className="text-gray-500 text-sm"> {rep.date} |  {rep.time}</p>
               {/* <p className="text-gray-600 mt-1 w-80 bg-orange-600">file link - {rep.fileUrl}</p> */}
               <p className="text-black text-xl font-semibold mt-1">{rep.headline ? rep.headline : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
               <p className="text-zinc-900 mt-1">{rep.content ? rep.content : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
             </div>
           </div>
         </div>
       ))
     }
     </div>
   
   
   <Toaster position="top-center" />
   </div>
   <footer className="bg-zinc-950 text-zinc-300 py-8 sm:px-10 ">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Company Info */}
        <div className="text-center md:text-left">
          <h2 className="text-xl text-zinc-100 font-semibold">Comapany Name</h2>
          <p>Office Address :
          20 Devi nagar,mission compound, hathroi, near Ajmeri puliya c scheme Jaipur, Rajasthan</p>
          <p>Email: info@xyz.org</p>
          <p>Phone: +91-1234567890</p>
        </div>

        {/* Copyright */}
        <div className="mt-4 md:mt-0">
          <p>&copy; {new Date().getFullYear()} <span className="text-blue-400"><a href="https://www.linkedin.com/company/byteedu/posts/?feedView=all&viewAsMember=true">ByteEdu</a></span> All rights reserved.</p>
          <p>This website is created by <span className="text-blue-400"><a href="https://www.linkedin.com/in/yash-tiwari20/">Yash</a></span></p>
        </div>
      </div>
    </footer>
   </>
  );
}
