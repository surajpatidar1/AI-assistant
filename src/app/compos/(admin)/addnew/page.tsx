'use client'

import { Loader2 } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";

const Page = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [form,setForm] = useState({
        project:'',
        skills:'',
        internship:''
    });

    const [endPoint, setEndPoint] = useState<string>('project')

    const handleChange = (e:React.ChangeEvent<HTMLTextAreaElement>)=>{
               const {name, value} = e.target;
               setForm((prev)=>({...prev,[name]: value}))
    };

    const handleSubmit = async(e:React.FormEvent) =>{
            e.preventDefault();
  
            let endPoints;
            console.log(endPoints)

            if(endPoint == 'project'){
                endPoints = '/api/project';
            }
            else{
                if(endPoint == 'skill'){
                    endPoints = '/api/skills' ;
                }else{
                    endPoints =  '/api/internship'
                }
            }

            try {
                setLoading(true)

                const response = await fetch(endPoints,{ 
                                                         method:'POST',
                                                         body: JSON.stringify(form),
                                                         headers:{
                                                            "Content-Type": "application/json",
                                                         }
                                                        });
                console.log('response', response)
                const data = await response.json();
                console.log('data', data)

                if(data.success){
                    toast.success(data.message)
                }
                else{
                    toast.error(data.message)
                }
                
            } catch (error:any) {
                console.log(error);
                toast.error(error.message)
            }

            finally{setLoading(false)}
    }
  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-b from-slate-400 to-slate-700 text-slate-800 p-5">
      <form 
        className="w-full max-w-lg h-full  p-10 rounded-2xl
      bg-white/20 backdrop-blur-xl
       border border-white/20
       shadow-[0_8px_32px_0_rgba(255,255,255,0.15)]
       hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.25)]
       transition"
         onSubmit={handleSubmit}>

            <h2 className="text-3xl font-bold text-center mb-10 tracking-wide">
          Update Details 🎓
        </h2>
  

     <div className="flex flex-col sm:flex-row items-center justify-center gap-6">

              <p
                 className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-300 to-red-400 text-white font-semibold shadow-lg
                             hover:scale-105 transition-transform duration-300"
                 onClick={()=>setEndPoint('project')}
              >
                 Projects
               </p>

             <p
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow-lg
                            hover:scale-105 transition-transform duration-300"
                onClick={()=>setEndPoint('internship')}
            >
               Internship
             </p>

              <p 
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-600 text-white font-semibold shadow-lg
                              hover:scale-105 transition-transform duration-300"
                 onClick={()=>setEndPoint('skill')}
             >
               Skills
              </p>
      </div>

     
      {
        endPoint == 'project' ? <>
        
        <div className="mb-6 mt-10">
          <label htmlFor="project" className="text-lg font-semibold">Projects</label>
          <textarea
            name="project"
            onChange={handleChange}
            value={form.project}
            placeholder="Describe your projects"
            id="project"
            className="px-5 py-3 mt-2 w-full rounded-xl 
                       bg-white/20 border border-white/30 
                       text-black placeholder-black/60 
                       focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
        
        </> : <></>
      }
        
       {
        endPoint == 'internship' ? <>
        
        <div className="mb-6 mt-10">
          <label htmlFor="project" className="text-lg font-semibold">Interships</label>
          <textarea
            name="internship"
            onChange={handleChange}
            value={form.internship}
            placeholder="Describe your internship"
            id="project"
            className="px-5 py-3 mt-2 w-full rounded-xl 
                       bg-white/20 border border-white/30 
                       text-black placeholder-black/60 
                       focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
        
        </> : <></>
       }
        
       {
        endPoint == 'skill' ? <>
         <div className="mb-6 mt-10">
          <label htmlFor="project" className="text-lg font-semibold">Skills</label>
          <textarea
            name="skills"
            onChange={handleChange}
            value={form.skills}
            placeholder="Describe your skills"
            id="project"
            className="px-5 py-3 mt-2 w-full rounded-xl 
                       bg-white/20 border border-white/30 
                       text-black placeholder-black/60 
                       focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
        
        
        </> : <></>
       }
       

   <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mb-3 rounded-xl 
                     bg-gradient-to-tr from-slate-800 to-slate-500 border-white/30 
                     text-white font-semibold tracking-wide 
                     hover:bg-white/30 hover:shadow-lg 
                     transition-all duration-300 flex justify-center items-center gap-2"
        >
          {loading ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
      Saving...
    </>
  ) : (
    "Save Details"
  )}
        </button>
      </form>
    </div>
  )
}

export default Page
