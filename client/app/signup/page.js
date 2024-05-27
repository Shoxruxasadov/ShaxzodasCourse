'use client'

import { UseRouter } from "next/navigation";
import { UseForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";

import UseLocalStorage from "@/hooks/useLocalStorage";
import { success, wrong } from "@/utility/toastify";
import AuthLayout from "@/layout/auth";

export default function page() {
    const exceptThisSymbols = ["e", "E", "+", "-", "."];
    const [token, setToken] = UseLocalStorage('token', '')
    const { register, handleSubmit } = UseForm()
    const router = UseRouter()

    const onSubmit = (data) => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_API}/users`
        const user = { ...data, phone: `+998${data.phone}`, role: 'user', status: false }
        const headers = { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET } }
        axios.post(url, user, headers).then(({ data }) => {
            setToken({ phone: data.phone, password: data.password })
            setTimeout(() => router.push('/'), 1000)
            success("Siz ro'yxatdan o'tdingiz");
        }).catch(err => {
            console.log(err);
            wrong(err.response.data.message)
        })
    }

    return (
        <AuthLayout name='signup'>
            <div className="box">
                <div className="header">
                    <h1>Hisob yarating</h1>
                    <p>&#34;Shaxzoda&#39;s Online Course&#34; da o&#39;qishni davom ettirish uchun</p>
                </div>
                <div className="main">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="name">
                            <label htmlFor="name" className="first-name">
                                <p>Ism</p>
                                <div className="wrapper">
                                    <input {...register("name", { required: true })} type="text" id="name" />
                                </div>
                            </label>
                            <label htmlFor="family" className="last-name">
                                <p>Familiya</p>
                                <div className="wrapper">
                                    <input {...register("family", { required: true })} type="text" id="family" />
                                </div>
                            </label>
                        </div>
                        <label htmlFor="phone" className="phone" >
                            <p>Telefon nomer</p>
                            <div className="wrapper">
                                <span>+998</span>
                                <input
                                    {...register("phone", { required: true })} type="number" id="phone"
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                />
                            </div>
                        </label>
                        <label htmlFor="password" className="passwrod">
                            <p>Parol</p>
                            <div className="wrapper">
                                <input {...register("password", { required: true })} type="password" id="password" />
                            </div>
                        </label>
                        <button>davom etish</button>
                    </form>
                </div>
                <div className="footer">
                    <p>
                        <span>Aldan akkauntmiz bormi? </span>
                        <Link href='/login'>Kirish</Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    )
}
