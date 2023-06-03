import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route.ts"
import { redirect } from 'next/navigation'

import Dashboard from "../components/dashboard"

export default async function Home() {
    const session = await getServerSession(authOptions);
    console.log("session", session)
    if (session) {
        return <Dashboard />
    } else {
        redirect("/api/auth/signin")
    }

}
