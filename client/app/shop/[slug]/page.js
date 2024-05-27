'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
import ReactPlayer from "react-player";
import Link from 'next/link';
import axios from 'axios'
import LessonLayout from '@/layout/lesson';

export default function ShopSlug({ params }) {
    const [isLoading, setLoading] = useState(true)
    const [player, setPlayer] = useState({})
    const [links, setLinks] = useState([])
    const pathname = usePathname()

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/course/${params.slug}`, { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET } }).then(({ data }) => {
            setPlayer(data.lesson)
            setLinks(data.branch)
        }).catch(err => {
            console.log(err)
        }).finally(() => setLoading(false))
    }, [])

    if (isLoading) return <LessonLayout><main id="loading"><span className="loader"></span></main></LessonLayout>

    return (
        <LessonLayout>
            <nav>
                <div className="lists">
                    <div className="list">
                        {links.map((link, i) => (
                            <Link key={i} href={`/shop/${link._id}`} className={pathname == `/shop/${link._id}` ? "active" : ""}>
                                <div className="icon">{i + 1}.</div>
                                <span className="title">{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
            <section id='lessons'>
                <div className="player">
                    <div className="video">
                        <ReactPlayer
                            url={player.video}
                            controls={true}
                            light={false}
                            pip={true}
                        />
                    </div>
                    <div className="title">
                        <p>{player.description}</p>
                    </div>
                </div>
            </section>
        </LessonLayout>
    )
}