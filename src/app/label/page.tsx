import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route.ts"
import { redirect } from 'next/navigation'

import LabelPage from "../../components/label.tsx"

export default async function LabelInterface() {
    const session = await getServerSession(authOptions);
    console.log("session", session)
    if (session) {
        return <LabelPage />
    } else {
        redirect("/api/auth/signin")
    }
}
