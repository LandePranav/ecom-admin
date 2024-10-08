import Layout from '@/components/Layout'
import {signOut, useSession } from 'next-auth/react'
import { Inter } from 'next/font/google'
import Image from 'next/image';
const inter = Inter({ subsets: ['latin'] })



export default function Home() {
  const {data:session} = useSession() ;
  return (
    <>
      <Layout>
        <div className="flex w-full gap-1 justify-end items-center">
          <div className='flex gap-2 items-center font-mono bg-gray-300 p-1 px-2 rounded-full'>
            <img src={session?.user?.image} className="rounded-full  w-6 h-6" />
            {session?.user?.name}
          </div>
          <button onClick={() => signOut('google')} className="rounded-full text-white font-bold bg-red-500 p-1 px-4">Logout</button>
        </div>
      </Layout>
    </>
  );
}
