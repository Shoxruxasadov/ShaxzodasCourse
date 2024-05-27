'use client'

import Image from "next/image";
import Link from "next/link";
import AuthLayout from "@/layout/auth";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useLocalStorage from "@/hooks/useLocalStorage";
import axios from "axios";
import { success, wrong } from "@/utility/toastify";

export default function page() {
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  const [token, setToken] = useLocalStorage('token', '')
  const { register, handleSubmit } = useForm()
  const router = useRouter()

  const onSubmit = (data) => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_API}/users`
    const headers = {
      headers: {
        'secret': process.env.NEXT_PUBLIC_SECRET,
        'request': 'auth',
        'login': JSON.stringify({ ...data, phone: `+998${data.phone}` })
      }
    }
    axios.get(url, headers).then(({ data }) => {
      setToken({ phone: data.phone, password: data.password })
      setTimeout(() => router.push('/'), 1000)
      success("Siz tizimga kirdingiz");
    }).catch(err => wrong(err.response.data.message))
  }

  return (
    <AuthLayout name='login'>
      <div className="box">
        <div className="header">
          <h1>Kirish</h1>
          <p>&#34;Shaxzoda&#39;s Online Course&#34; da o&#39;qishni davom ettirish uchun</p>
        </div>
        <div className="main">
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <span>Akkount yo&#39;qmi? </span>
            <Link href='/signup'>Ro&#39;yxatdan o&#39;tish</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
