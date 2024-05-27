'use client'

import { usePathname, useRouter } from 'next/navigation';
import { TbArrowBack } from 'react-icons/tb'
import { useStore } from '@/store/zustand';
import HomeLayout from '@/layout/home';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Dashboard() {
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (!user) router.push('/')
    })

    if (!user) return <main id="loading"><span className="loader"></span></main>
    return (
        <HomeLayout name='profile'>
            <Link href='/' className="backPage">
                <TbArrowBack />
            </Link>
            <div className="banner"></div>
            <div className="content">
                <div className="profileHead">
                    <img src='/unknown.png' />
                    <div className="title">
                        <h1>{user.name} {user.family}</h1>
                        <h3>{user.phone} {user.status ? <span className='active'>To&#39;langan</span> : <span className='activation'>To&#39;lanmagan</span>}</h3>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className='right'>
                    <Link href='/' onClick={() => {
                        localStorage.removeItem('token')
                        setUser('')
                    }} className="out">Log Out</Link>
                    {user.role == "admin" && <Link href='/admin' className="admin">Admin</Link>}
                </div>
            </div>
        </HomeLayout>
    )
}
