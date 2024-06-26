import React, { useState } from 'react';

import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import { MdPhoto } from "react-icons/md";
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [error, setError] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)

            const storageRef = ref(storage, displayName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                (error) => {
                    setError(true)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(response.user, {
                            displayName,
                            photoURL: downloadURL,
                        })
                        await setDoc(doc(db, "users", response.user.uid), {
                            uid: response.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        })

                        await setDoc(doc(db, "userChats", response.user.uid), {})
                        navigate("/")
                    });
                }
            );


        } catch (error) {
            setError(true)
        }
    }

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <span className="logo">Chat App</span>
                <span className="title">Register</span>

                <form onSubmit={handleSubmit} >
                    <input type="text" placeholder="Name..." />
                    <input type="email" placeholder="Email..." />
                    <input type="password" placeholder="Password..." />
                    <input
                        style={{ display: "none" }}
                        type="file" id="file"
                    />
                    <label htmlFor="file">
                        <MdPhoto color="#a7bcff" size={30} />
                        <h3>Add an avatar</h3>
                    </label>
                    <button>Sign Up</button>
                    {error && <span>Something went wrong</span>}
                </form>
                <p>Already have an account? <Link to="/register">Login</Link></p>
            </div>
        </div>
    );
}
