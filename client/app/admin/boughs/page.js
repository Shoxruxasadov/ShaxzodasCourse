"use client"

import AdminLayout from '@/layout/admin'
import { useStore } from '@/store/zustand';
import { success, wrong } from '@/utility/toastify';
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminBoughs() {
    const [boughs, setBoughs] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => { getBoughs() }, [])

    function getBoughs() {
        const url = `${process.env.NEXT_PUBLIC_SERVER_API}/users`
        const headers = { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET, 'request': 'bought' } }
        axios.get(url, headers).then(({ data }) => setBoughs(data)).catch(err => wrong(err.response.data.message)).finally(() => setLoading(false))
    }

    function paid(id) {
        const url = `${process.env.NEXT_PUBLIC_SERVER_API}/users/${id}`
        const headers = { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET } }
        axios.patch(url, { status: true }, headers).then(({ data }) => success(data)).catch(err => wrong(err.response.data.message)).finally(getBoughs)
    }

    function unpaid(id) {
        const url = `${process.env.NEXT_PUBLIC_SERVER_API}/users/${id}`
        const headers = { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET } }
        axios.patch(url, { status: false }, headers).then(({ data }) => success(data)).catch(err => wrong(err.response.data.message)).finally(getBoughs)
    }

    function search(event) {
        const value = event.target.value
        if(!value) return getBoughs()
        const url = `${process.env.NEXT_PUBLIC_SERVER_API}/users`
        const headers = { headers: { 'secret': process.env.NEXT_PUBLIC_SECRET, 'request': 'search', 'search': String(value) } }
        axios.get(url, headers).then(({ data }) => setBoughs(data)).catch(err => wrong(err.response.data.message))
    }

    return (
        <AdminLayout name='boughs'>
            <div className="title">
                <h1>Boughs</h1>
                <input type="text" placeholder='Search phone...' onChange={search} />
            </div>
            <table className="wrapper">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Family</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? <tr className="loadingTable">
                        <td rowSpan={3} colSpan={7}>
                            <div className="waiting">
                                <span className="loader"></span>
                            </div>
                        </td>
                    </tr> : boughs.map((item, i) => (
                        <tr className="card" key={i}>
                            <td>{i + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.family}</td>
                            <td>{item.phone}</td>
                            <td><span className={`pag ${item.role}`}>{item.role}</span></td>
                            <td>{item.status ?
                                <span onClick={() => unpaid(item._id)} className="pag active">To&#39;langan</span> :
                                <span onClick={() => paid(item._id)} className="pag activation">To&#39;lanmagan</span>
                            }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>
    )
}
