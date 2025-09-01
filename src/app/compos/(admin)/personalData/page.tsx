"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
  })

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value, 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`/api/personalData`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error("Something went wrong !!")
      }
    } catch (error: any) {
      console.error("Error during saving data", error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
   <div className="flex justify-center items-center h-screen w-full bg-gradient-to-b from-slate-400 to-slate-700 text-slate-800">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-10 rounded-2xl
      bg-white/20 backdrop-blur-xl
       border border-white/20
       shadow-[0_8px_32px_0_rgba(255,255,255,0.15)]
       hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.25)]
       transition"
      >
        <h2 className="text-3xl font-bold text-center mb-10 tracking-wide">
          Personal Details ✨
        </h2>

        {/* Row 1 (2 inputs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="full_name" className="text-lg font-semibold">
              Name
            </label>
            <input
              type="text"
              name="fullname"
              onChange={changeHandler}
              value={formData.fullname}
              placeholder="Enter your name"
              id="full_name"
              className="px-5 py-3 mt-2 w-full rounded-xl 
                         bg-white/20 border border-white/30 
                         text-black placeholder-black/60 
                         focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-lg font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={changeHandler}
              value={formData.email}
              placeholder="Enter your email"
              id="email"
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
            <label htmlFor="phone" className="text-lg font-semibold">
              Phone
            </label>
            <input
              type="number"
              name="phone"
              onChange={changeHandler}
              value={formData.phone}
              placeholder="Enter your phone"
              id="phone"
              className="px-5 py-3 mt-2 w-full rounded-xl 
                         bg-white/20 border border-white/30 
                         text-black placeholder-black/60 
                         focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div>
            <label htmlFor="date_of_birth" className="text-lg font-semibold">
              Date of Birth
            </label>
            <input
              type="text"
              name="date_of_birth"
              onChange={changeHandler}
              value={formData.date_of_birth}
              placeholder="YYYY/MM/DD"
              id="date_of_birth"
              className="px-5 py-3 mt-2 w-full rounded-xl 
                         bg-white/20 border border-white/30 
                         text-black placeholder-black/60 
                         focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div>
            <label htmlFor="gender" className="text-lg font-semibold">
              Gender
            </label>
            <input
              type="text"
              name="gender"
              onChange={changeHandler}
              value={formData.gender}
              placeholder="Enter your gender"
              id="gender"
              className="px-5 py-3 mt-2 w-full rounded-xl 
                         bg-white/20 border border-white/30 
                         text-black placeholder-black/60 
                         focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl 
                     bg-gradient-to-tr from-slate-800 to-slate-500 border-white/30 
                     text-white font-semibold tracking-wide 
                     hover:bg-white/30 hover:shadow-lg 
                     transition-all duration-300 flex justify-center items-center gap-5"
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
