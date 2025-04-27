import db from "@/lib/db";
import getSession from "@/lib/session"
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id
            },
        })
        if(user){
            return user;
        }
    }
    
    notFound();
}

export default async function Profile() {
    const user = await getUser();
    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy;
        redirect("/");
    }
    return (

        <div className="flex flex-col items-center justify-between min-h-screen p-6 max-w-[600px] mx-auto py-10">
            <div className="w-full flex flex-col items-start gap-10 *:font-medium">
                <h2 className="w-full text-center text-2xl">{user?.username}님 어서오세요</h2>
                <ul className="text-left">
                    <li>
                        <span>내 프로필</span>
                    </li>
                    <li>
                        <span>Name : {user.username}</span>
                    </li>
                    <li>
                        <span>Email : {user.email}</span>
                    </li>
                </ul>
            </div>
            <div className="flex flex-col items-center gap-3 w-full">
                <form action={logOut} className="w-full">
                    <button
                        className="w-full bg-orange-500 text-white text-lg font-medium py-2.5 rounded-md text-center hover:bg-orange-400 transition-colors"
                    >
                        로그아웃
                    </button>
                </form>
            </div>
        </div>
    )
}