import Layout from '@/components/Layout'
import {signOut, useSession } from 'next-auth/react'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const {data:session} = useSession() ;
  const userImg = session?.user?.image;
  const [currWidth, setCurrWidth]  = useState();

  useEffect(()=> {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setCurrWidth(window.innerWidth); // 768px corresponds to 'md' breakpoint in Tailwind
      }
    };

    // Initial check
    handleResize();

    // Add event listener for resizing
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },[]);

  return (
    <>
      <Layout>
        <div className="flex gap-1 justify-end items-center">
          <div className='flex gap-2 items-center font-mono bg-gray-300 p-1 px-2 rounded-full text-nowrap overflow-hidden' >
            <Image src={userImg} height={30} width={30} alt='userImg' quality={100} className='rounded-full object-cover'/>
            {currWidth <= 425 ? session?.user?.name.split(' ')[0] : session?.user?.name}
          </div>
          <button onClick={() => signOut()} className="rounded-full text-white font-bold bg-red-500 p-1 px-4">Logout</button>
        </div>
      </Layout>
    </>
  );
}
