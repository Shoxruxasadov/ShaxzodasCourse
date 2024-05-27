'use client'

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useStore } from "@/store/zustand";
import { wrong } from "@/utility/toastify";

import { TbSocial, TbBrandShopee, TbBrandInstagram, TbBasket, TbGift } from "react-icons/tb";
import { MdOutlineSecurity, MdPeopleAlt, MdAttachMoney } from "react-icons/md";
import { PiArrowFatLinesUp } from "react-icons/pi";
import { BiLike, BiBox } from "react-icons/bi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Root from "@/app/root";

export default function AdminLayout({ children, name }) {
    const user = useStore(state => state.user);
    const isAdmin = useStore(state => state.isAdmin);
    const pathname = usePathname()
    const router = useRouter()

    const setUser = useStore(state => state.setUser);
    const isLoading = useStore(state => state.isLoading);
    const setLoading = useStore(state => state.setLoading);
    const setAdmin = useStore(state => state.setAdmin);
    const [token, setToken] = useLocalStorage("token", '')

    const users = [
        {
            title: 'Adminlar',
            path: '/admin',
            icon: <MdOutlineSecurity />
        }, {
            title: "To'lanmagan",
            path: '/admin/users',
            icon: <MdPeopleAlt />
        }, {
            title: "To'langan",
            path: '/admin/boughs',
            icon: <MdAttachMoney />
        }
    ]

    const course = [
        {
            title: 'SMM',
            path: '/admin/smm',
            icon: <TbSocial />
        }, {
            title: 'Target',
            path: '/admin/target',
            icon: <PiArrowFatLinesUp />
        }, {
            title: 'Online Shop',
            path: '/admin/shop',
            icon: <TbBrandShopee />
        }, {
            title: 'Instagram Daromad',
            path: '/admin/instagram',
            icon: <TbBrandInstagram />
        }, {
            title: 'Cheteldan buyurtma berish',
            path: '/admin/order',
            icon: <TbBasket />
        }, {
            title: 'Like Podpiskadan pul ishlash',
            path: '/admin/clicking',
            icon: <BiLike />
        }, {
            title: 'Maxsus Bonus',
            path: '/admin/bonus',
            icon: <BiBox />
        }, {
            title: "Sirli Sovg'a",
            path: '/admin/gift',
            icon: <TbGift />
        }
    ]

    function getUser() {
        const url = `${process.env.NEXT_PUBLIC_SERVER_API}/users`
        const headers = { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET, 'request': 'auth', 'login': JSON.stringify(token) } }
        axios.get(url, headers).then(({ data }) => {
            setUser(data);
            if (data.role == 'admin') setAdmin(true)
            else router.push('/')
        }).catch(err => {
            wrong(err.response.data.message)
            router.push('/')
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (!token) { setLoading(false); router.push('/') }
        if (token.phone && token.password) getUser()
        else setLoading(false)
    }, [])

    if (!user || isLoading) return <Root><main id="loading"><span className="loader"></span></main></Root>
    if (isAdmin) return (
        <Root>
            <main id="admin">
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
                        <Link href='/' className="login">Orqaga</Link>
                    </div>
                </header>
                <nav>
                    <div className="lists">
                        <div className="list">
                            <p className="users">Foydalanuvchilar</p>
                            {users.map((link, i) => (
                                <Link key={i} href={link.path} className={pathname == link.path ? "active" : ""}>
                                    <div className="icon">{link.icon}</div>
                                    <span className="title">{link.title}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="list">
                            <p>Sahifalar</p>
                            {course.map((link, i) => (
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
