import Comm from "./Comm";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser, SignInButton } from "@clerk/clerk-react";
import { toast } from "react-toastify";


const fetchComments = async (postId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
    return response.data;
};

const Comments = ({ postId }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    const { data, isPending, error } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
    });

    // publicMetadata (which is never actually populated in this app).
    const { data: currentDbUser } = useQuery({
        queryKey: ["currentUser", user?.id],
        queryFn: async () => {
            const token = await getToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });
 
    const isAdmin = currentDbUser?.role === "admin" || false;

    const mutation = useMutation({
        mutationFn: async (newComment) => {
            const token = await getToken();
            return axios.post(`${import.meta.env.VITE_API_URL}/comments/`, newComment, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            toast.success("Comment added!");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Error adding comment");
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newComment = {
            desc: formData.get("desc"),
            post: postId,
        };

        mutation.mutate(newComment);
        e.target.reset();
    };

    if (isPending) {
        return "Loading comments...";
    }

    if (error) {
        return "Error loading comments: " + error.message;
    }

    return (
        <div id="comments" className="flex flex-col gap-8 lg:w-3/5 mb-12">
            <h2 className="text-xl text-gray-500 underline">Comments</h2>

            {user ? (
                <form onSubmit={handleSubmit} className="flex items-center justify-between gap-8 w-full">
                    <label htmlFor="comment-textarea" className="sr-only">
                        Write a comment
                    </label>
                    <textarea
                        id="comment-textarea"
                        name="desc"
                        placeholder="Write a comment...."
                        className="flex-1 p-1 mb-8 border border-gray-300 rounded-xl"
                    />
                    <button
                        type="submit"
                        className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl mb-8"
                    >
                        Post
                    </button>
                </form>
            ) : (
                <div className="flex items-center justify-between gap-4 p-4 mb-8 bg-gray-50 border border-gray-200 rounded-xl">
                    <span className="text-gray-600 text-sm">Log in to leave a comment.</span>
                    <SignInButton mode="modal">
                        <button className="bg-blue-800 px-4 py-2 text-white text-sm font-medium rounded-xl whitespace-nowrap">
                            Log In
                        </button>
                    </SignInButton>
                </div>
            )}

            {mutation.isPending && (
                <Comm
                    comment={{
                        desc: `${mutation.variables?.desc} (sending...)`,
                        createdAt: new Date(),
                        user: {
                            img: user?.imageUrl,
                            username: user?.username,
                        },
                    }}
                    postId={postId}
                    isAdmin={isAdmin}
                />
            )}

            {data && data.map((comment) => (
                <Comm
                    key={comment._id}
                    comment={comment}
                    postId={postId}
                    isAdmin={isAdmin}
                />
            ))}
        </div>
    );
};

export default Comments;