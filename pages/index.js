import Layout from "@/components/Layout";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const {data: session} = useSession()
  const adminEmails = ["alwinsanil@gmail.com"];
  if (session && !adminEmails.includes(session?.user?.email)) {
    signOut();
  } else {
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        {/* <Image src={session.user.image} alt='' width={500} height={500}/> */}
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt='' className="w-8 h-8" />
          <span className="py-1 px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </Layout>
  )
}
}
