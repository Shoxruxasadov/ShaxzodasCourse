'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import HomeLayout from '@/layout/home'

export default function Order() {
  // const path = useStore(state => state.path);
  // const setPath = useStore(state => state.setPath);
  const [isLoading, setLoading] = useState(true)
  const [order, setOrder] = useState([])

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/course`, { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET, 'type': 'order' } }).then(({ data }) => {
      setOrder(data)
    }).catch(err => {
      console.log(err)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <HomeLayout name='course'>
      <div className="wrapper">
        {isLoading ? <>
          <span className="loader"></span>
          <span className="loader"></span>
        </> : <>
          {order.map((item, i) => (
            <Link href={`/order/${item._id}`} className="card" key={item._id}>
              <div className="image">
                <img
                  src={item.photo}
                  alt={item._id}
                />
              </div>
              <div className="title">
                <h1>{item.title}</h1>
                <p>{item.description}</p>
              </div>
            </Link>
          ))}
        </>}
      </div>
    </HomeLayout>
  )
}