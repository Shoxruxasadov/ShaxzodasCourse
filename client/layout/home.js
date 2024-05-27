'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useStore } from "@/store/zustand";
import { wrong } from "@/utility/toastify";
import Root from "@/app/root";

import { TbSmartHome, TbSocial, TbBrandShopee, TbBrandInstagram, TbBasket, TbGift } from "react-icons/tb";
import { PiArrowFatLinesUp } from "react-icons/pi";
import { TiBusinessCard } from "react-icons/ti";
import { BiLike, BiBox } from "react-icons/bi";

export default function HomeLayout({ children, name }) {
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const isLoading = useStore(state => state.isLoading);
    const setLoading = useStore(state => state.setLoading);
    const setAdmin = useStore(state => state.setAdmin);
    const [token, setToken] = useLocalStorage("token", '')
    const pathname = usePathname()

    const links = [
        {
            title: 'Asosiy',
            path: '/',
            icon: <TbSmartHome />
        }, {
            title: 'SMM',
            path: '/smm',
            icon: <TbSocial />
        }, {
            title: 'Target',
            path: '/target',
            icon: <PiArrowFatLinesUp />
        }, {
            title: 'Online Shop',
            path: '/shop',
            icon: <TbBrandShopee />
        }, {
            title: 'Instagram Daromad',
            path: '/instagram',
            icon: <TbBrandInstagram />
        }, {
            title: 'Cheteldan buyurtma berish',
            path: '/order',
            icon: <TbBasket />
        }, {
            title: 'Like Podpiskadan pul ishlash',
            path: '/clicking',
            icon: <BiLike />
        }, {
            title: 'Maxsus Bonus',
            path: '/bonus',
            icon: <BiBox />
        }, {
            title: "Sirli Sovg'a",
            path: '/gift',
            icon: <TbGift />
        }
    ]

    function getUser() {
        const url = `${process.env.NEXT_PUBLIC_SERVER_API}/users`
        const headers = { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET, 'request': 'auth', 'login': JSON.stringify(token) } }
        axios.get(url, headers).then(({ data }) => {
            setUser(data);
            setAdmin(data.role == 'admin')
        }).catch(err => wrong(err.response.data.message)).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (!token) { setLoading(false); return; }
        if (token.phone && token.password) getUser()
        else setLoading(false)
    }, [])

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
                <nav>
                    <div className="lists">
                        <div className="list">
                            {links.map((link, i) => (
                                <Link key={i} href={link.path} className={pathname == link.path ? "active" : ""}>
                                    <div className="icon">{link.icon}</div>
                                    <span className="title">{link.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* <div className="powered">
                    <Link href='https://shoxrux.site' target='_blank'>Powered By</Link>
                </div> */}
                </nav>
                <section id={name}>
                    {children}
                </section>
            </main>
        </Root>
    );
}
