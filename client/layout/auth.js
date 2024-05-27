'use client'

import { useStore } from "@/store/zustand";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { TiBusinessCard } from "react-icons/ti";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import useLocalStorage from "@/hooks/useLocalStorage";
import Root from "@/app/root";

export default function AuthLayout({ children, name }) {
    const user = useStore(state => state.user);
    const pathname = usePathname()
    const router = useRouter()

    const setUser = useStore(state => state.setUser);
    const isLoading = useStore(state => state.isLoading);
    const setLoading = useStore(state => state.setLoading);
    const setAdmin = useStore(state => state.setAdmin);
    const [token, setToken] = useLocalStorage("token", '')

    function getUser() {
        const url = `${process.env.NEXT_PUBLIC_SERVER_API}/users`
        const headers = { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET, 'request': 'auth', 'login': JSON.stringify(token) } }
        axios.get(url, headers).then(({ data }) => {
            setUser(data);
            setAdmin(data.role == 'admin')
            router.push('/')
        }).catch(err => {
            wrong(err.response.data.message)
            setLoading(false)
        })
    }

    useEffect(() => {
        if (!token) { setLoading(false); return; }
        if (token.phone && token.password) getUser()
        else setLoading(false)
    }, [])

    if (isLoading) return <Root><main id="loading"><span className="loader"></span></main></Root>
    return (
        <Root>
            <main id="auth">
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
                        <Link href='/signup' className={`signup authorize${pathname == '/signup' ? ' active' : ''}`}>Ro'yxatdan o'tish</Link>
                        <Link href='/login' className={`login authorize${pathname == '/login' ? ' active' : ''}`}>Kirish</Link>
                    </div>
                </header>
                <section id={name}>
                    {children}
                </section>
            </main>
        </Root>
    );
}
