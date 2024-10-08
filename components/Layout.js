import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/Nav';

export default function Layout({children}) {
  const {data: session} = useSession();
  if(!session){
    return(
      <div className="w-screen h-screen bg-blue-900 flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="rounded-lg bg-white p-2 px-4">Login With Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-blue-900 w-screen h-screen">
      <Nav />
      <div className="bg-white flex-grow my-2 mr-2 p-4 rounded-lg">
        {children}
      </div>
    </div>
  )
}
