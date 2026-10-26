import { format } from "timeago.js";
import Image from "./image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Comm = ({ comment, postId }) => {
  const { currentUser: user, token } = useAuth();
  const queryClient = useQueryClient();

  const isCommentAuthor =
    user && (comment?.user?._id === user?._id || comment?.user?.username === user?.username);
  const isAdmin = user?.role === "admin";

  const mutation = useMutation({
    mutationFn: async () => {
      const activeToken = token || localStorage.getItem("token");
      return axios.delete(`${import.meta.env.VITE_API_URL}/comments/${comment._id}`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error deleting comment");
    },
  });

  const handleDelete = () => {
    if (confirm("Delete this comment?")) {
      mutation.mutate();
    }
  };

  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-8">
      <div className="flex items-center gap-4">
        {comment?.user?.img && (
          <Image
            src={comment.user.img}
            alt={`${comment.user.username || "User"}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
            w="40"
            h="40"
          />
        )}
        <span className="font-medium">{comment?.user?.username || "Unknown"}</span>
        <span className="text-sm text-gray-500">{format(comment?.createdAt)}</span>

        {user && (isCommentAuthor || isAdmin) && (
          <button
            type="button"
            className="text-sm text-red-500 hover:text-red-700 cursor-pointer bg-transparent border-none p-0 ml-auto transition"
            onClick={handleDelete}
            aria-label={`Delete comment by ${comment?.user?.username || "Unknown"}`}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
      <div className="mt-4">
        <p className="text-slate-700 leading-relaxed">{comment?.desc}</p>
      </div>
    </div>
  );
};

export default Comm;