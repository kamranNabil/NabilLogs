import { useAuth, useUser, SignInButton } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import Uploads from "../components/Uploads.jsx";

const Write = () => {
    const { isLoaded, isSignedIn } = useUser();
    const [value, setValue] = useState("");
    const [cover, setCover] = useState(null);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        image && setValue((prev) => prev + `<p><image src="${image.url}"/></p>`)
    }, [image]);

    useEffect(() => {
        video && setValue((prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`)
    }, [video]);

    const navigate = useNavigate();

    const { getToken } = useAuth();

    const mutation = useMutation({
        mutationFn: async (newPost) => {
            const token = await getToken();
            return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: (res) => {
            toast.success("Post created successfully");
            navigate(`/singlepost/${res.data.post.slug}`);
        },
    });

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (isLoaded && !isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <h1 className="text-2xl font-semibold text-gray-700">Log in to write a post</h1>
                <p className="text-gray-500 max-w-md">
                    You want yourself to be heard— Create an account to get started.
                </p>
                <SignInButton mode="modal">
                    <button className="bg-blue-800 px-6 py-3 text-white font-medium rounded-xl">
                        Log In
                    </button>
                </SignInButton>
            </div>
        );
    }

    const handlesubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            title: formData.get("title"),
            desc: formData.get("desc"),
            category: formData.get("category"),
            content: value,
            img: cover?.url,
        };
        console.log("Submitting data:", data);
        mutation.mutate(data);
    };

    return (
        <div className="md:h-[calc(100vh-80px)] h-[calc(100vh-80px)] flex flex-col gap-6">
            <h1 className="text-cl font-light">Create a post</h1>
            <form onSubmit={handlesubmit} className="flex flex-col gap-6 flex-1 mb-6">
                <Uploads type="image" setProgress={setProgress} setData={setCover}>
                    <button
                        type="button"
                        className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white"
                    >
                        Add a cover photo
                    </button>
                </Uploads>
                <input
                    className="text-4xl font-semibold bg-transparent outline-none"
                    type="text"
                    placeholder="My Story"
                    name="title"
                />
                <div className="flex items-center gap-4">
                    <label htmlFor="" className="text-lg">
                        Choose a category
                    </label>
                    <select
                        name="category"
                        id=""
                        className="p-2 rounded-xl bg-white shadow-md"
                    >
                        <option value="general">General</option>
                        <option value="webD">Web Design</option>
                        <option value="appd">App Development</option>
                        <option value="db">Databases</option>
                        <option value="seo">SEO</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>
                <textarea
                    className="p-4 rounded-xl bg-white shadow-md"
                    name="desc"
                    placeholder="A short desc"
                />
                <div className="flex flex-1">
                    <div className="flex flex-col mr-4 gap-2">
                        <Uploads type="image" setProgress={setProgress} setData={setImage}>
                            ;)
                        </Uploads>
                        <Uploads type="video" setProgress={setProgress} setData={setVideo}>
                            ):
                        </Uploads>
                    </div>
                    <ReactQuill
                        theme="snow"
                        className="flex-1 rounded-xl bg-white shadow-md"
                        value={value}
                        onChange={setValue}
                        readOnly={0 < progress && progress < 100}
                    />
                </div >
                <button
                    disabled={mutation.isPending || (0 < progress && progress < 100)}
                    type="submit"
                    className="bg-blue-800 text-white font-medium rounded-xl p-2 mt-4 w-40 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? "Loading..." : "Send"}
                </button>
                <div>Progress: {progress}%</div>
                {mutation.isError && <span>{mutation.error.message}</span>}
            </form >
        </div >
    );
};

export default Write;