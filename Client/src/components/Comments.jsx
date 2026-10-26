import Comm from "./Comm";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const fetchComments = async (postId) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
  return response.data;
};

const Comments = ({ postId }) => {
  const { currentUser: user, token } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const isAdmin = user?.role === "admin" || false;

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const activeToken = token || localStorage.getItem("token");
      return axios.post(`${import.meta.env.VITE_API_URL}/comments/`, newComment, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
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
    const desc = formData.get("desc")?.trim();

    if (!desc) {
      toast.warn("Comment cannot be empty");
      return;
    }

    const newComment = {
      desc,
      post: postId,
    };

    mutation.mutate(newComment);
    e.target.reset();
  };

  if (isPending) {
    return <div className="text-gray-500 py-4">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">Error loading comments: {error.message}</div>;
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
            className="flex-1 p-2 mb-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-800 hover:bg-blue-900 transition-colors px-4 py-3 text-white font-medium rounded-xl mb-8 disabled:opacity-50"
          >
            Post
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between gap-4 p-4 mb-8 bg-gray-50 border border-gray-200 rounded-xl">
          <span className="text-gray-600 text-sm">Log in to leave a comment.</span>
          <Link
            to="/login"
            className="bg-blue-800 hover:bg-blue-900 transition-colors px-4 py-2 text-white text-sm font-medium rounded-xl whitespace-nowrap"
          >
            Log In
          </Link>
        </div>
      )}

      {mutation.isPending && (
        <Comm
          comment={{
            desc: `${mutation.variables?.desc} (sending...)`,
            createdAt: new Date(),
            user: {
              img: user?.img,
              username: user?.username,
            },
          }}
          postId={postId}
          isAdmin={isAdmin}
        />
      )}

      {data &&
        data.map((comment) => (
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