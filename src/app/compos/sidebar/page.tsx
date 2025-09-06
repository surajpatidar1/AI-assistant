'use client'


import {  BookOpen, Crown, Github, Link2Icon, Linkedin } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Sidebar = () => {


      const [isOpen, setIsOpen] = useState<boolean>(true);
      const [isAdmin,setIsAdmin] = useState<boolean>(false);
      const [password,setPassword] = useState<string>('');
      const [showInput, setShowInput] = useState<boolean>(false);

      const route = useRouter();
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setPassword(e.target.value);
};
 
      const handlePassword = (e:FormEvent)=>{
             e.preventDefault();
        if(process.env.NEXT_PUBLIC_ADMIN_PASSWORD == password){
            toast.success("Admin page was unlocked");
            setIsAdmin(true)
            setShowInput(false)
        }
        else{
            toast.error("Access deny !, jaldi waha se hto");
        }
      }

       useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);
  return (
<section
        className={`bg-white/5 backdrop-blur-[50px] border border-white/10 rounded-r-lg shadow-xl text-white transition-all duration-300 h-screen 
        ${isOpen ? "w-56 p-4" : "w-20 p-2"} `}
      >

                
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 mb-4 flex justify-center items-center bg-white/5 hover:bg-white/10 rounded-lg w-full"
        >
          {isOpen ? 'Collapse' : <BookOpen /> }
        </button>

        <div className="flex justify-center">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={isOpen ? 100 : 50}
            height={isOpen ? 100 : 50}
            className={`rounded-full mb-5 transition-all duration-300 ${
              isOpen ? "p-3" : "p-1"
            }`}
          />
        </div>

        {isOpen && (
          <h1 className="text-white text-lg font-semibold mb-3 text-center">
            Suraj's Assistant
          </h1>
        )}
        <hr className="text-white/10 mb-8" />

        <nav className="flex flex-col gap-3">
          <a 
            href="https://www.linkedin.com/in/suraj-patidar-777940279/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-lg py-3 px-3 font-bold text-lg items-center justify-center hover:bg-white/10 transition-all cursor-pointer"
          >
            <Linkedin />
            {isOpen && <span>LinkedIn</span>}
          </a>
          <a 
            href="https://github.com/surajpatidar1" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-lg py-3 px-3 font-bold text-lg items-center justify-center hover:bg-white/10 transition-all cursor-pointer"
          >
            <Github />
            {isOpen && <span>GitHub</span>}
          </a>
          <a 
            href="https://surajpatidar-uh74.onrender.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-lg py-3 px-3 font-bold text-lg items-center justify-center hover:bg-white/10 transition-all cursor-pointer"
          >
            <Link2Icon />
            {isOpen && <span>Portfolio</span>}
          </a>
        </nav>

<hr className="text-white/10 mt-12" />
            <div className='rounded-md p-3 flex flex-col justify-center items-center mt-18'>
             <p 
                 onClick={()=>{setShowInput(!showInput)}}
                 className="p-2 mb-4 text-2xl font-bold flex justify-center items-center gap-3 bg-white/5 hover:bg-white/10 rounded-lg w-full"
             >
                 <Crown/>
                {isOpen && <span>Admin</span>}
             </p>

             {
                showInput && 
                 <form className='flex gap-2 my-5' onSubmit={handlePassword}>
                 <input type="text" placeholder='password'  onChange={handleChange} className='w-full max-w-sm border border-white/5 p=5'/>
                 <button className='bg-white/10 p-2 rounded-2xl hover:bg-white/5 ' type='submit'>Done</button>
                </form>
             }
             
              
{isAdmin && (
  <div className=" top-20 left-0 bg-white/8 p-3 rounded-md my-2 font-semibold">
    <p 
      className='hover:underline'
      onClick={()=>{route.push('/compos/educationData')}}
    >
        Add Education
    </p>
    <p 
     onClick={()=>{route.push('/compos/personalData')}}
      className='hover:underline'
    > 
      Add Personal
    </p>
    <p 
     className='hover:underline'
     onClick={()=>{route.push('/compos/addnew')}}>Add Others</p>
  </div>
)}

 </div>
        
      </section>
  )
}

export default Sidebar
