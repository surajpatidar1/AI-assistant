"use client";
import { useState } from "react";

export default function TestForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("❌ Error saving name");
    }
  };

  return (
    <div className="p-6  border border-white/10 rounded-lg w-80 text-white bg-black">
      <h2 className="text-lg font-bold mb-4">Save Name</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="px-3 py-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
        />
        <button
          type="submit"
          className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded"
        >
          Save
        </button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}
