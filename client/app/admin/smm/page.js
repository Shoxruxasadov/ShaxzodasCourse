'use client'

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Rodal from "rodal";
import axios from "axios";
import Link from "next/link";

import { AiOutlineVideoCameraAdd, AiFillDelete } from "react-icons/ai";
import { success, wrong } from "@/utility/toastify";
import { storage } from "@/lib/firebase/firebase";
import AdminLayout from "@/layout/admin";

export default function AdminSMM() {
    const { register, handleSubmit, reset } = useForm();
    const [isLoading, setLoading] = useState(true)
    const [disable, setDisable] = useState(false)
    const [rodal, setRodal] = useState(false)
    const [smm, setSmm] = useState([])
    
    const [photo, setPhoto] = useState('');
    const [video, setVideo] = useState('');
    const photoRef = useRef(null);
    const videoRef = useRef(null);

    function getCourse() {
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/course`, { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET, 'type': 'smm' } }).then(({ data }) => {
            setSmm(data)
        }).catch(err => {
            console.log(err)
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        getCourse()
    }, [])

    const onSubmit = (data) => {
        if (!video) {
            wrong('video yoq')
        } else if (!photo) {
            wrong('rasm yoq')
        } else if (!data.title) {
            wrong('title yoq')
        } else if (!data.description) {
            wrong('description yoq')
        } else {
            setDisable(true);
            const date = new Date().getTime()
            const videoName = `${date}.${video.name}`
            const storageVideoRef = ref(storage, `lesson/${videoName}`);
            const uploadVideoTask = uploadBytesResumable(storageVideoRef, video);

            uploadVideoTask.on("state_changed",
                (snapshot) => console.log(snapshot),
                (error) => {
                    wrong("Xatolik: video yuklanmadi");
                    console.log(error);
                }, () => getDownloadURL(uploadVideoTask.snapshot.ref).then(
                    async (downloadVideoURL) => {
                        const photoName = `${date}.${photo.name}`
                        const storagePhotoRef = ref(storage, `preview/${photoName}`);
                        const uploadPhotoTask = uploadBytesResumable(storagePhotoRef, photo);

                        uploadPhotoTask.on("state_changed",
                            (snapshot) => console.log(snapshot),
                            (error) => {
                                wrong("Xatolik: rasm yuklanmadi");
                                console.log(error);
                            }, () => getDownloadURL(uploadPhotoTask.snapshot.ref).then(
                                async (downloadPhotoURL) => axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/course`, {
                                    type: 'smm',
                                    photo: downloadPhotoURL,
                                    photoName: photoName,
                                    video: downloadVideoURL,
                                    videoName: videoName,
                                    title: data.title,
                                    description: data.description,
                                }, { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET } }).then(({ data }) => {
                                    success("Video yuklandi");
                                    rodalClose()
                                }).catch((err) => {
                                    err.response.data.message[0] ? wrong(err.response.data.message[0]) : wrong("error")
                                    console.log(err.response.data);
                                }).finally(() => {
                                    setDisable(false)
                                    getCourse()
                                })
                            )
                        );
                    }
                )
            );
        }
    }

    const deleteLesson = (id, videoName, photoName) => {
        const desertVideoRef = ref(storage, `lesson/${videoName}`);
        const desertPhotoRef = ref(storage, `preview/${photoName}`);

        axios.delete(`${process.env.NEXT_PUBLIC_SERVER_API}/course/${id}`, { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET } }).then(({ data }) => {
            success("Video yuklandi");
            getCourse()

            deleteObject(desertVideoRef).then(() => {
                console.log("video o'chirildi");
            }).catch((error) => {
                console.log("video: ", error);
            });

            deleteObject(desertPhotoRef).then(() => {
                console.log("photo o'chirildi");
            }).catch((error) => {
                console.log("photo: ", error);
            });
        }).catch((error) => console.log('Delete lesson: ', error))
    }

    function rodalClose() {
        setPhoto('')
        setVideo('')
        setRodal(false)
        reset({ title: '', description: '' })
    }

    return (
        <>
            {disable && <div id="admin-loading"><span className="loader"></span></div>}
            <AdminLayout name='course'>
                <div className="wrapper">
                    {isLoading ? <>
                        <span className="loader"></span>
                        <span className="loader"></span>
                        <span className="loader"></span>
                    </> : <>
                        {smm.map((item, i) => (
                            <div className="card" key={item._id}>
                                <Link href={`/smm/${item._id}`} >
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
                                <button className="delete" onClick={() => deleteLesson(item._id, item.videoName, item.photoName)}>
                                    <AiFillDelete />
                                </button>
                            </div>
                        ))}
                        <div className="card add" onClick={() => setRodal(true)}>
                            <div className="image">
                                <div className="icon">
                                    <AiOutlineVideoCameraAdd />
                                </div>
                            </div>
                            <div className="title">
                                <h1>Darslik qo&#39;shish</h1>
                            </div>
                        </div>
                    </>}
                </div>
                <Rodal visible={rodal} onClose={rodalClose}>
                    <h3>SMM bo&#39;limiga darslik qo&#39;shish</h3>
                    <form className="rodal-wrapper" onSubmit={handleSubmit(onSubmit)}>
                        <label className="lesson" htmlFor="fileVideo">
                            <p>1. Bu yerdan Videoni yuklang</p>
                            <div className="video" onClick={() => videoRef.current.click()}>
                                <div
                                    className="dribble"
                                    onDragOver={event => event.preventDefault()}
                                    onDrop={event => {
                                        event.preventDefault();
                                        const { files } = event.dataTransfer;
                                        files.length > 0 && setVideo(files[0]);
                                    }}
                                >
                                    <input
                                        id="fileVideo"
                                        type="file"
                                        ref={videoRef}
                                        onChange={({ target }) => setVideo(target.files[0])}
                                    />
                                    <button type="button">Yuklash</button>
                                    <p>{video && video.name}</p>
                                </div>
                            </div>
                        </label>
                        <label className="preview" htmlFor="filePhoto">
                            <p>2. Bu yerdan Abloshkani yuklang</p>
                            <div className="image" >
                                <div
                                    className="dribble"
                                    onDragOver={event => event.preventDefault()}
                                    onDrop={event => {
                                        event.preventDefault();
                                        const { files } = event.dataTransfer;
                                        files.length > 0 && setPhoto(files[0]);
                                    }}
                                >
                                    {photo ? <img
                                        src={URL.createObjectURL(photo)}
                                        alt="Photo"
                                    /> : <button type="button" onClick={() => photoRef.current.click()}>Yuklash</button>}
                                    <input
                                        id="filePhoto"
                                        type="file"
                                        ref={photoRef}
                                        onChange={({ target }) => setPhoto(target.files[0])}
                                    />
                                </div>
                            </div>
                        </label>
                        <label className="title" htmlFor="title">
                            <p>3. Bu yerga zagalovka yozing</p>
                            <input type="text" id="title" {...register("title")} />
                        </label>
                        <label className="description" htmlFor="description">
                            <p>4. Bu yerga opisaniya yuklang</p>
                            <textarea id="description" {...register("description")}></textarea>
                        </label>
                        <button type='submit' disabled={disable}>Yuklash</button>
                    </form>
                </Rodal>
            </AdminLayout>
        </>
    )
}
