"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
 
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Home() {

  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(false);
  const [newsVisible, setNewsVisible] = useState(true)
  const [videoVisible, setVideoVisible] = useState(false)
  const notFilledMessage = "not filled by user"

  type prevReportType = {
    date: string;
    time: string;
    headline: string;
    content: string;
    fileUrl: string;
  }[];
  
  const [news, setNews] = useState<prevReportType>([]);

  type videoType = {
    date: string;
    time: string;
    videoHeadline: string;
    videoContent: string;
    videoUrl: string;
  }[];
  const [videos, setVideos] = useState<videoType>([])
  
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
        const res = await axios.post("/api/report/getReport", {category});
        setNews(res.data.report)      
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
    fetchNews();
  },[category])  

  useEffect(()=>{
    const fetchVideo = async() => {
      try {
        setLoading(true);
        const res = await axios.post("/api/report/getVideos", {category});
        console.log(res);
        
        setVideos(res.data.report)      
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
    fetchVideo();
  },[category])  

  //bg-[#ffe0e0]
  return (
   <>
   <div className="pt-14 w-full">
    <div className="w-full ">
    <h1 className="text-6xl font-bold pt-20 px-5 text-zinc-100">Welcome Back <span className="text-blue-500">{data.userName}</span></h1>
    <h1 className="text-4xl font-bold pt-5 pb-3 px-5 text-zinc-100">Here are all listed news</h1>
    </div>

    <div className="h-16 w-full mt-10 text-black flex justify-end  bg-orange-400">
        <div className="flex gap-8 w-96 justify-center items-center">
        <button onClick={()=>{setNewsVisible(false) ; setVideoVisible(true)}} className={`text-xl ${videoVisible ? "underline" : ""}`}>videos</button>
        <button onClick={()=>{setVideoVisible(false); setNewsVisible(true)}} className={`text-xl ${newsVisible ? "underline" : ""}`}>news</button>
        <Select onValueChange={(value) => setCategory(value)}>
        <SelectTrigger className="w-[180px] border-none shadow-none text-xl underline ">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-100">
          <SelectGroup className=" text-zinc-950">
                <SelectItem value="all">All News</SelectItem>
             <SelectItem value="politics">Politics </SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="technology">Technology </SelectItem>
                <SelectItem value="sports">Sports </SelectItem>
                <SelectItem value="entertainment">Entertainment </SelectItem>
                <SelectItem value="education">Education  </SelectItem>
                <SelectItem value="weather">Weather  </SelectItem>
          </SelectGroup>
        </SelectContent>
        </Select>

        </div>
    {/* select state/ national */}
       
    </div>

     <div className="w-full py-10 bg-zinc-100 grid sm:grid-cols-2  lg:grid-cols-3  items-center justify-center  ">
      {loading ? (
      <div className="text-black text-center">
        Loading...
      </div>
      ) : ""}
     {newsVisible && (
      <div className="w-full bg-zinc-100  ">
        {
       news.map((rep, index)=>(
         <div key={index} className="mx-auto w-96 p-4">
           <div className="bg-white shadow-lg rounded-md  p-4 ">
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
               <p className="text-zinc-900 mt-1">{rep.content ? rep.content.split(" ").slice(0, 30).join(" ") + "..." : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
               <AlertDialog >
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="mt-2">read full news</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="h-screen  py-12 w-full border-none bg-white overflow-y-auto text-zinc-950">
                  <AlertDialogHeader className="text-left">
                    <Image
                      src={rep.fileUrl}
                      alt="Task Image"
                      width={80}
                      height={80}
                      unoptimized
                      className="w-full object-cover rounded-sm"
                    />
                    <p className="text-gray-500 text-sm">{rep.date} | {rep.time}</p>
                    <p className="text-black text-xl font-semibold mt-1">
                      {rep.headline ? rep.headline : <div className="text-red-500">{notFilledMessage}</div>}
                    </p>
                    <p className="text-zinc-900 mt-1">
                      {rep.content ? rep.content : <div className="text-red-500">{notFilledMessage}</div>}
                    </p>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-zinc-100">Back</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

             </div>
           </div>
         </div>
       ))
     }
      </div>
     )}

    
    {/* video news section */}

    {videoVisible && (
      <div>
          {
       videos.map((rep, index)=>(
         <div key={index} className="mx-auto w-96 p-4">
           <div className="bg-white shadow-lg rounded-md  p-4 ">
             <iframe
                className="w-full aspect-video"
                src={rep.videoUrl}
                allowFullScreen
              />
             <div className="mt-3">
               <p className="text-gray-500 text-sm"> {rep.date} |  {rep.time}</p>
               {/* <p className="text-gray-600 mt-1 w-80 bg-orange-600">file link - {rep.fileUrl}</p> */}
               <p className="text-black text-xl font-semibold mt-1">{rep.videoHeadline ? rep.videoHeadline : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
               <p className="text-zinc-900 mt-1">{rep.videoContent ? rep.videoContent.split(" ").slice(0, 30).join(" ") + "..." : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
               <AlertDialog >
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="mt-2">read full news</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="h-screen  py-12 w-full border-none bg-white overflow-y-auto text-zinc-950">
                  <AlertDialogHeader className="text-left">
                  <iframe
                    className="w-full aspect-video"
                    src={rep.videoUrl}
                    allowFullScreen
                  />
                    <p className="text-gray-500 text-sm">{rep.date} | {rep.time}</p>
                    <p className="text-black text-xl font-semibold mt-1">
                      {rep.videoHeadline ? rep.videoHeadline : <div className="text-red-500">{notFilledMessage}</div>}
                    </p>
                    <p className="text-zinc-900 mt-1">
                      {rep.videoContent ? rep.videoContent : <div className="text-red-500">{notFilledMessage}</div>}
                    </p>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-zinc-100">Back</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

             </div>
           </div>
         </div>
       ))
     }
      </div>
    )}


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
