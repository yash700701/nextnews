"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from '@/components/ui/textarea';


type PageProps = {
  params: Promise<{ id: string }>;
};

function Page({params}: PageProps) {
    const resolvedParams = React.use(params); // Unwrap params
    const id = resolvedParams.id; // Now safe to access
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    

    type newsType = {
        _id: string,
        email: string,
        date: string,
        time: string,
        userName: string,
        headline: string,
        fileUrl: string,
        content: string,
    }
    const [news, setNews] = useState<newsType>()
    const [headline, setHeadline] = useState("")
    const [content, setContent] = useState("")
    const [updatedHeadline, setUpdatedHeadline] = useState("")
    const [updatedContent, setUpdatedContent] = useState("")
  

    useEffect(()=>{
      async function getNews() {
        try {
          setLoading(true)
          const res = await axios.post("/api/report/getReportById", {id})
          console.log(res.data.report);
          setNews(res.data.report);
          setHeadline(res.data.report.headline);
          setContent(res.data.report.content);
          console.log("Component re-rendered 2")
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false)
        }
      }
      getNews()
    },[id])

    const handleChangeHeadline = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHeadline(e.target.value); // Update input field
      setUpdatedHeadline(e.target.value); // Store new value separately
    };
    const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value); // Update input field
      setUpdatedContent(e.target.value); // Store new value separately
    };

  
    async function updateNews() {
      try {
        const id = news?._id
        await axios.post("/api/report/updateReport", {id, updatedHeadline, updatedContent });
        toast("news updated successfully")
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <div className='w-full h-screen bg-zinc-100'>
    {loading ? (
      <div className='text-black'>
        Loading...
      </div>
    ) : (
      <div className="flex justify-center  pt-20 p-5">
      <div className="bg-white p-6 rounded-2xl shadow-lg  w-full">
        
         <div className="mx-auto">
                  <div className="">
                    {news?.fileUrl && (
                    <div>
                    <Image
                    src={news.fileUrl}
                    alt="Task Image"
                    width={80}
                    height={80}
                    unoptimized
                    className="w-full sm:w-96 h-40 object-cover rounded-sm"
                    />
                    <Popover>
                    <PopoverTrigger asChild>
                        <button className='text-xs  rounded-none text-blue-500'>open file</button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 mx-5 ">
                      <div>
                      <Image
                        src={news.fileUrl}
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
                      <p className="text-gray-500 text-sm"> {news?.date} |  {news?.time}</p>
                      <Textarea 
                       value={headline}
                       onChange={handleChangeHeadline}
                      className='text-black border-none h-20 shadow-none p-0'
                      />
                      <Textarea 
                       value={content}
                       onChange={handleChangeContent}
                      className='text-black border-none h-80 shadow-none p-0'
                      />
                    </div>
                  </div>
                </div>    
    
        <Button
          onClick={ ()=>{setVisible((prev)=> !prev) ; updateNews()}}
          className="mt-2 sm:w-60 w-full text-black bg-green-200 py-2 rounded-lg transition-all duration-300"
        >
          {visible ? "Hide" : "Update"}
        </Button>
      </div>
    </div>
    )}
  <Toaster position="top-center" />
    </div>
  )
}

export default Page