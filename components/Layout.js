import Nav from "@/components/Nav";
import { FcGoogle } from 'react-icons/fc'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Layout({children}) {
  const { data: session } = useSession()
  if(!session) {
    return (
    <div className="bg-blue-900 w-screen h-screen flex items-center justify-center">
      <div className="text-center">
        <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg flex items-center justify-center gap-2">
          <FcGoogle className="w-7 h-7" />
          Login with Google
        </button>
      </div>
    </div>
    );
  }
  return (
    <div  className="bg-blue-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow ml-2 md:ml-0 mt-2 mr-2 mb-2 rounded-lg p-4">
        {children}
      </div>
    </div>
    
  )
}
