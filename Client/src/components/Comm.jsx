import { format } from "timeago.js";
import Image from "./image";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const Comm = ({ comment, postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const role = user?.publicMetadata?.role;
  const queryClient = useQueryClient();
  
  const isCommentAuthor = comment?.user?.username === user?.username;
  const isAdmin = role === "admin";

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/comments/${comment._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
        {/* {user && (comment?.user?.username === user?.username || role === "admin") && ( */}
        {user && (isCommentAuthor || isAdmin) && (
          <button
            type="button"
            className="text-sm text-red-300 hover:text-red-500 cursor-pointer bg-transparent border-none p-0"
            onClick={handleDelete}
            aria-label={`Delete comment by ${comment?.user?.username || "Unknown"}`}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
      <div className="mt-4">
        <p>{comment?.desc}</p>
      </div>
    </div>
  );
};

export default Comm;