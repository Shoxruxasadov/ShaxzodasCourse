'use client'

import { ToastContainer } from "react-toastify";

export default function Root({ children }) {
    return (
        <>
            {children}
            <ToastContainer />
        </>
    );
}
