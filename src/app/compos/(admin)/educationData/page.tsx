'use client'
import {Loader2} from 'lucide-react'
import { useState } from "react"
import toast from "react-hot-toast";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    college: '',
    school: '',
    project: '',
    interships: '',
    degree: ''
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value
    }))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await fetch(`/api/educationData`,
        {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          }
        });
      
      const data = await response.json()
      console.log(data)
      if (data.success) {
        toast.success(data.message)
      }
      else {
        toast.error("Something went wrong !!")
      }
    } catch (error: any) {
      console.error("Error during saving data", error);
      toast.error(error.message)
    }
    finally { setLoading(false) }
  }

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-b from-slate-400 to-slate-700 text-slate-800 p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg h-full p-10 rounded-2xl
      bg-white/20 backdrop-blur-xl
       border border-white/20
       shadow-[0_8px_32px_0_rgba(255,255,255,0.15)]
       hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.25)]
       transition"
      >
        <h2 className="text-3xl font-bold text-center mb-10 tracking-wide">
          Education Details 🎓
        </h2>

        {/* Row 1 (2 inputs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="name" className="text-lg font-semibold">Name</label>
            <input
              type="text"
              name="name"
              onChange={changeHandler}
              value={formData.name}
              placeholder="Enter your name"
              id="name"
              className="px-5 py-3 mt-2 w-full rounded-xl 
                         bg-white/20 border border-white/30 
                         text-black placeholder-black/60 
                         focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div>
            <label htmlFor="college" className="text-lg font-semibold">College</label>
            <input
              type="text"
              name="college"
              onChange={changeHandler}
              value={formData.college}
              placeholder="Enter your college"
              id="college"
              className="px-5 py-3 mt-2 w-full rounded-xl 
                         bg-white/20 border border-white/30 
                         text-black placeholder-black/60 
                         focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Row 2 (3 inputs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div>
            <label htmlFor="school" className="text-lg font-semibold">School</label>
            <input
              type="text"
              name="school"
              onChange={changeHandler}
              value={formData.school}
              placeholder="Enter your school"
              id="school"
              className="px-5 py-3 mt-2 w-full rounded-xl 
                         bg-white/20 border border-white/30 
                         text-black placeholder-black/60 
                         focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div>
            <label htmlFor="degree" className="text-lg font-semibold">Degree</label>
            <input
              type="text"
              name="degree"
              onChange={changeHandler}
              value={formData.degree}
              placeholder="Enter your degree"
              id="degree"
              className="px-5 py-3 mt-2 w-full rounded-xl 
                         bg-white/20 border border-white/30 
                         text-black placeholder-black/60 
                         focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div>
            <label htmlFor="skills" className="text-lg font-semibold">Skills</label>
            <input
              type="text"
              name="skills"
              onChange={changeHandler}
              value={formData.skills}
              placeholder="Enter your skills"
              id="skills"
              className="px-5 py-3 mt-2 w-full rounded-xl 
                         bg-white/20 border border-white/30 
                         text-black placeholder-black/60 
                         focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Textareas */}
        <div className="mb-6">
          <label htmlFor="project" className="text-lg font-semibold">Projects</label>
          <textarea
            name="project"
            onChange={changeHandler}
            value={formData.project}
            placeholder="Describe your projects"
            id="project"
            className="px-5 py-3 mt-2 w-full rounded-xl 
                       bg-white/20 border border-white/30 
                       text-black placeholder-black/60 
                       focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        <div className="mb-8">
          <label htmlFor="interships" className="text-lg font-semibold">Internships</label>
          <textarea
            name="interships"
            onChange={changeHandler}
            value={formData.interships}
            placeholder="Describe your internships"
            id="interships"
            className="px-5 py-3 mt-2 w-full rounded-xl 
                       bg-white/20 border border-white/30 
                       text-black placeholder-black/60 
                       focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mb-3 rounded-xl 
                     bg-gradient-to-tr from-slate-800 to-slate-500 border-white/30 
                     text-white font-semibold tracking-wide 
                     hover:bg-white/30 hover:shadow-lg 
                     transition-all duration-300 flex justify-between items-center gap-5"
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
