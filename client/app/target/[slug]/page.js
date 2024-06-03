'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
import ReactPlayer from "react-player";
import Link from 'next/link';
import axios from 'axios'
import Plyr from 'plyr';
import LessonLayout from '@/layout/lesson';

export default function TargetSlug({ params }) {
    const [isLoading, setLoading] = useState(true)
    const [player, setPlayer] = useState({})
    const [links, setLinks] = useState([])
    const pathname = usePathname()
    const plyr = new Plyr('#plyr');

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
                            <Link key={i} href={`/target/${link._id}`} className={pathname == `/target/${link._id}` ? "active" : ""}>
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
                        <video id="plyr" playsinline controls data-poster={player.photo}>
                            <source src={player.video} type="video/mp4" />
                            {/* <track kind="captions" label="English captions" src="/path/to/captions.vtt" srclang="en" default /> */}
                        </video>
                    </div>
                    <div className="title">
                        <p>{player.description}</p>
                    </div>
                </div>
            </section>
        </LessonLayout>
    )
}