"use client"

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



function Page() {
  
    const [isAdmin, setIsAdmin] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [notAdmin, setNotAdmin] = useState(true);
    const [loading, setLoading] = useState(true);
    const [inputKey, setInputKey] = useState("");
    const [headline, setHeadline] = useState("")
    const [videoHeadline, setVideoHeadline] = useState("")
    const [content, setContent] = useState("")
    const [videoContent, setVideoContent] = useState("")
    const [videoUrl, setVideoUrl] = useState("")
    const [category, setCategory] = useState("")
    const notFilledMessage = "this field is empty"

     type dataType = {
        userName: string,
        email: string,
      }
      const [data, setData] = useState<dataType>({
        userName: "",
        email: "",
      });

    type newsType = {
        _id: string,
        fileUrl: string,
        headline: string,
        content: string,
        time: string,
        date: string,
    }[];
    const [news, setNews] = useState<newsType>([])

    type videoType = {
        _id: string,
        videoUrl: string,
        videoHeadline: string,
        videoContent: string,
        time: string,
        date: string,
    }[];
    const [videos, setVideos] = useState<videoType>([])

    const router = useRouter();

    useEffect(()=>{
        async function getMe() {
            try {
                const res = await axios.get("/api/users/me")
                setIsAdmin(res.data.data.isAdmin)
                setNotAdmin(res.data.data.isAdmin)
                setData(res.data.data);
                setLoading(false)
                console.log("Component re-rendered 4")
            } catch (error) {
                console.log(error);
            }
        }
        getMe();
    },[])

    useEffect(()=>{
        async function getNews() {
            try {
                const category="all" 
                const res = await axios.post("/api/report/getReport", {category})
                setNews(res.data.report)
                console.log("Component re-rendered 3")
                
            } catch (error) {
                console.log(error);
            }
        }
        getNews();
    },[isAdmin])

    useEffect(()=>{
        async function getVideos() {
            try {
                const category="all" 
                const res = await axios.post("/api/report/getVideos", {category})
                setVideos(res.data.report)
                console.log("Component re-rendered 3")
                
            } catch (error) {
                console.log(error);
            }
        }
        getVideos();
    },[isAdmin])
    
    function submit(){
       if(inputKey.toLowerCase().trim() === process.env.NEXT_PUBLIC_ADMIN_KEY){
        async function createAdmin() {
            try {
                await axios.post("/api/users/admin", {inputKey})
                setNotAdmin(true)
                setIsAdmin(true)
            } catch (error) {
                console.log(error);
            } 
        }
        createAdmin();
       }else if(inputKey === ""){
           toast("please enter admin key");
       }else{
           toast("invalid admin key");
       }
    }

    type newsTypeForId = {
        _id: string;
      };

      function goToUpatePage(news: newsTypeForId) {
        if (!news._id) return alert("news ID not found!"); // Optional safety check
        router.push(`/profile/${news._id}`);
      }

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
      
        setImage(file);
        setPreview(URL.createObjectURL(file)); // Show preview
      };
    
      const handleUpload = async () => {
        setLoading(true);
      
        try {
          let imageUrl = null;
      
          if (image) {
            const formData = new FormData();
            formData.append("file", image);
            const res = await axios.post("api/upload", formData);
            console.log(res.data.imgUrl);
            imageUrl = res.data.imgUrl; // Get the uploaded image URL      
          }
          console.log(imageUrl);
          
    
          const name = data.userName
          const email = data.email
          const date = new Date(Date.now()).toISOString().split("T")[0]
          const time = new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
          console.log(time);
          console.log(date);
          
          
          const response = await axios.post("/api/report/createReport", {name, email, time, date, headline, content, category, imageUrl});
          toast("News Uploaded Successfully!");
          console.log(response.data);
          setHeadline("")
          setContent("")
          setImage(null)
          setPreview(null)
    
        } catch (error) {
          toast("Upload Failed");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      const handleUploadVideo = async () => {
        setLoading(true);
      
        try {
        
          const name = data.userName
          const email = data.email
          const date = new Date(Date.now()).toISOString().split("T")[0]
          const time = new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
          console.log(time);
          console.log(date);
          
          
          const response = await axios.post("/api/report/uploadVideo", {name, email, time, date, videoHeadline, category, videoContent, videoUrl});
          toast("Video Uploaded Successfully!");
          console.log(response.data);
          setVideoHeadline("")
          setVideoContent("")
          setVideoUrl("")
    
        } catch (error) {
          toast("Upload Failed");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

       async function handleDeleteNews(news: newsTypeForId){
              try {
                const id = news?._id;
                await axios.post("/api/report/delete", {id})
                toast("news deleted successfully")
              } catch (error) {
                console.log(error);
              }
        }

  return (
   <>
    {loading && (
        <div className='w-full mt-28 h-40'>
        <h1 className='text-center'>Loading...</h1>
        </div>
    )}   
    {!notAdmin && (
        <div className='w-full pt-14 flex flex-col items-center text-black h-screen bg-white'>
        <div className='pt-10'>
            <h1 className='text-red-500'>You Are Not Admin</h1>
            <h1>Enter Key To Become Admin</h1>
            <Input type='text' value={inputKey} onChange={(e)=> setInputKey(e.target.value)} className='mt-1 border-black border-[1px] w-80'></Input>
            <Button onClick={submit} className='w-80 mt-2 text-blue-500'>Submit</Button>
        </div>
    </div>
    )}
    {isAdmin && (
        <div className='w-full pt-28 flex flex-col items-center text-black  bg-white'>
        <h1 className='text-2xl font-semibold'>Create new news here</h1>
        <Drawer>
              <DrawerTrigger asChild>
                <Button className="ml-5 mt-2 text-blue-500 w-60 bg-zinc-50 hover:bg-zinc-50 hover:shadow-md border-[1px]" variant="outline">Create News</Button>
              </DrawerTrigger>
              <DrawerContent className='bg-zinc-100 text-zinc-950'>
                <div className="mx-auto h-[550px] w-full  max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Create New News</DrawerTitle>
                  </DrawerHeader>
                  <div className="">
                  <div className=" backdrop-blur-sm p-4 max-w-md">
                    <Input
                    placeholder="Headline"
                    className="bg-white mb-2"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    />
                    <Textarea
                      className="bg-white mb-2"
                      placeholder="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    ></Textarea>
                     <Select onValueChange={(value) => setCategory(value)}>
                      <SelectTrigger className="bg-white mb-2">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className='bg-white text-zinc-950'>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
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
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
                      // onChange={(e) => setFile(e.target.files[0])}
                    />
                   <div className="w-20 h-20 rounded-lg bg-slate-50 mt-2">
                   {preview && 
                    <Image 
                    src={preview} 
                    alt="Preview" 
                    className="w-20 mt-2 h-20 object-cover rounded-lg mb-3" 
                    width={80}
                    height={80}
                    unoptimized
                    />}
                   </div>
                </div>
                  </div>
                  <DrawerFooter>
                  <Button onClick={handleUpload} disabled={loading} className="mt-3 bg-white w-full ">
                  {loading ? "Uploading..." : "Upload"}
                  </Button>
                    <DrawerClose asChild>
                      <Button className='text-white' variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>

            {/* video upload */}
        <Drawer>
              <DrawerTrigger asChild>
                <Button className="ml-5 mt-2 text-blue-500 w-60 bg-zinc-50 hover:bg-zinc-50 hover:shadow-md border-[1px]" variant="outline">Upload Video</Button>
              </DrawerTrigger>
              <DrawerContent className='bg-zinc-100 text-zinc-950'>
                <div className="mx-auto w-full  max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Create New News</DrawerTitle>
                  </DrawerHeader>
                  <div className="">
                  <div className=" backdrop-blur-sm p-4 max-w-md">
                    <Input
                    placeholder="Headline"
                    className="bg-white mb-2"
                    value={videoHeadline}
                    onChange={(e) => setVideoHeadline(e.target.value)}
                    />
                    <Textarea
                      className="bg-white mb-2"
                      placeholder="content"
                      value={videoContent}
                      onChange={(e) => setVideoContent(e.target.value)}
                    ></Textarea>
                     <Input
                    placeholder="Video Url"
                    className="bg-white mb-2"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <Select onValueChange={(value) => setCategory(value)}>
                      <SelectTrigger className="bg-white mb-2">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className='bg-white text-zinc-950'>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
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
                  </div>
                  <DrawerFooter>
                  <Button onClick={handleUploadVideo} disabled={loading} className="mt-3 bg-white w-full ">
                  {loading ? "Uploading..." : "Upload"}
                  </Button>
                    <DrawerClose asChild>
                      <Button className='text-white' variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
        
        <div className='w-full mt-10 bg-zinc-100'>

        <Tabs defaultValue="account" className="w-full mt-5">
          <TabsList className='w-full gap-5'>
            <TabsTrigger value="account" className='w-40'>All News</TabsTrigger>
            <TabsTrigger value="password" className='w-40'>Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
          {/* news */}


          <div className="w-full mt-10 py-10 bg-zinc-100 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 justify-center  ">
            {
              news.map((rep, index)=>(
                <div key={index} className="mx-auto p-4 w-96">
                  <div className=" bg-white shadow-lg  rounded-md  p-4 ">
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
                      <p className="text-gray-500 text-sm">{rep.date} |  {rep.time}</p>
                      {/* <p className="text-gray-600 mt-1 w-80 bg-orange-600">file link - {rep.fileUrl}</p> */}
                      <p className="text-black text-xl font-semibold mt-1">{rep.headline ? rep.headline : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
                      <p className="text-zinc-900 text-lg mt-1">{rep.content ? rep.content : ( <div className="text-red-500">{notFilledMessage}</div> )}</p>
                      <Button onClick={()=>goToUpatePage(rep)} className="mt-5 w-full text-black">Edit News</Button>
                      <AlertDialog >
                            <AlertDialogTrigger asChild>
                              <Button className="mt-2 w-full bg-red-200 hover:bg-red-300 text-red-800 py-2 rounded-lg transition-all duration-300" variant="outline">Delete News</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this news
                                  from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={()=>handleDeleteNews(rep)} className='bg-red-100 text-red-800'>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                    </div>
                  </div>
                </div>
              ))
            }
            </div>

          </TabsContent>
          <TabsContent value="password">
           {/* videos */}

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
                        <Button variant="outline" className="mt-2 text-zinc-100">read full news</Button>
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

          </TabsContent>
        </Tabs>

       
        </div>
        
    </div>
    
    )}
   <Toaster position="top-center" />
   </>
  )
}

export default Page