'use client'
import { useState } from 'react';
import Dashboard from '../app/dashboard/page'
import TestForm from './test/page';
export default function Home() {

  const [testing,setTesting] = useState(false)
  return (
    <div className="font-sans ">
      {
        testing ?  <TestForm/> : <Dashboard/>
      }
      
    </div>
  );
}
