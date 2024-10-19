import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/Nav';
import Link from "next/link";
import { useState } from "react";

export default function Layout({children}) {
  const {data: session} = useSession();
  const [navVisible, setNavVisible] = useState(false);
  if(!session){
    return(
      <div className="w-screen h-dvh bg-gray-300 flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="rounded-lg bg-white p-2 px-4 border border-black hover:shadow-slate-950 hover:drop-shadow-2xl">Login With Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 min-w-screen h-dvh">
      <div className="flex items-center px-4 pt-2 md:hidden">
        <button type="button" onClick={()=> setNavVisible(true)} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <Link href={"/"} onClick={()=> window.location.pathname ==="/" && setNavVisible(false)} className="flex gap-2 p-2 pl-4 flex-grow justify-center pr-8 uppercase">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
              <span>Ecom-Admin</span>
        </Link>
      </div>
      <div className="flex">
        <Nav visible={navVisible} />
        <div className="bg-white flex-grow my-2 mx-2 p-4 px-8 rounded-lg w-full h-[90vh] md:h-[97vh] transition-all">
          {children}
        </div>
      </div>
    </div>
    
  )
}
