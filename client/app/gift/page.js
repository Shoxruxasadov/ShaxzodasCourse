'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import HomeLayout from '@/layout/home'

export default function Gift() {
  // const path = useStore(state => state.path);
  // const setPath = useStore(state => state.setPath);
  const [isLoading, setLoading] = useState(true)
  const [gift, setGift] = useState([])

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/course`, { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET, 'type': 'gift' } }).then(({ data }) => {
      setGift(data)
    }).catch(err => {
      console.log(err)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <HomeLayout name='gift'>
      <div className="wrapper">
        <h3>Bizndes kurator Shaxzoda Turdimurodova shaxsan oʻzlari bilan zoom platformasida online uchrashov🤩</h3>
        <p>Yani bu uchrashuvda sizni qiziqtirgan savollariz, muammolariz, dars davomida instruktor tomonida qoniqtirmagan javoblarizga ham yechim topasiz✅</p>
      </div>
    </HomeLayout>
  )
}