"use client"

import { signOut } from "next-auth/react";

type ProfileProp = {
    username : string
}

export const Profile = ({username} : ProfileProp) =>{

    return <div>

        <div className="w-full h-17 bg-[var(--color-back)] border-t-1 border-r-1 border-[var(--color-scroll)] flex">
            <div className="w-11 h-11 rounded-full mt-2 ml-5 bg-gray-500 text-white font-medium items-center flex justify-center text-xl">
                {username[0]}
            </div>

            <div className="flex items-center text-white justify-center mb-3 ml-2 text-xl">
                {username}
            </div>
            
            <div className="flex mb-6 ml-42 text-white items-end cursor-pointer hover:text-blue-500" onClick={()=>{
                signOut({callbackUrl :"/api/auth/signin"})
            }}>
                <svg xmlns="http//www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hovertext-blue-500 lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
            </div>
        </div>

    </div>

}