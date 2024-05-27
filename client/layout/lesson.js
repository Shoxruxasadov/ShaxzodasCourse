'use client'

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useStore } from "@/store/zustand";
import { warning, wrong } from "@/utility/toastify";

import { TbSmartHome, TbSocial, TbBrandShopee, TbBrandInstagram, TbBasket, TbGift } from "react-icons/tb";
import { PiArrowFatLinesUp } from "react-icons/pi";
import { TiBusinessCard } from "react-icons/ti";
import { BiLike, BiBox } from "react-icons/bi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Root from "@/app/root";

export default function LessonLayout({ children }) {
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const isLoading = useStore(state => state.isLoading);
    const setLoading = useStore(state => state.setLoading);
    const setAdmin = useStore(state => state.setAdmin);
    // const path = useStore(state => state.path);
    // const setPath = useStore(state => state.setPath);
    const [token, setToken] = useLocalStorage("token", '')
    const router = useRouter()

    function getUser() {
        const url = `${process.env.NEXT_PUBLIC_SERVER_API}/users`
        const headers = { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET, 'request': 'auth', 'login': JSON.stringify(token) } }
        axios.get(url, headers).then(({ data }) => {
            setUser(data);
            setAdmin(data.role == 'admin')
        }).catch(err => wrong(err.response.data.message))
    }

    useEffect(() => {
        if (!token) { return }
        if (token.phone && token.password) getUser()
    }, [])

    useEffect(() => {
        if (!user) router.push('/')
        if (user && !user.status) router.push('/')
        else setLoading(false)
    })

    if (isLoading) return <Root><main id="loading"><span className="loader"></span></main></Root>
    return (
        <Root>
            <main id="home">
                <header>
                    <Link href='/' className="logo">
                        <Image
                            src="/favicon.ico"
                            alt="logo"
                            width={40}
                            height={40}
                        />
                        <p>Course</p>
                    </Link>
                    <div className="auth">
                        <Link href="https://t.me/shahzodas_administrator" target="_blank" className="price"><TiBusinessCard /></Link>
                        {user ? <Link className="user" href='/dashboard'>
                            <div className="title">
                                <h3>{user.name} {user.family}</h3>
                                <h4>{user.phone}</h4>
                            </div>
                            <div className="image">
                                <img src="/unknown.png" alt="unknown" />
                            </div>
                        </Link> : <Link href='/login' className="login">Kirish</Link>}
                    </div>
                </header>
                {children}
            </main>
        </Root>
    );
}
