import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route.ts"
import { redirect } from 'next/navigation'

import LabelPage from "../../components/label.tsx"

export default async function LabelInterface() {
    const session = await getServerSession(authOptions);
    console.log("session", session)

    if (session) {
        var imageId = 1; // hardcoded for test
        return <LabelPage imageId={imageId} userId={session.user.id}/>
    } else {
        redirect("/api/auth/signin")
    }
}
