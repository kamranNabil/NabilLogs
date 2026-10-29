import { Link } from "react-router-dom";
import Image from "./image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  return (
    <article className="flex flex-col xl:flex-row gap-6 mb-10 pb-8 border-b border-slate-200/60 last:border-none">
      {/* 1. Thumbnail: fixed 16:9 aspect ratio prevents squashing */}
      {post.img ? (
        <div className="w-full xl:w-2/5 aspect-[16/9] rounded-2xl overflow-hidden shadow-sm bg-slate-100 shrink-0">
          <Image
            src={post.img}
            alt={post.title}
            className="w-full h-full object-cover"
            w="735"
            h="414"
          />
        </div>
      ) : (
        <div className="w-full xl:w-2/5 aspect-[16/9] rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-bold text-lg shadow-sm shrink-0">
          NabilLogs
        </div>
      )}

      {/* 2. Post Content */}
      <div className="flex flex-col gap-3 w-full xl:w-3/5 justify-center">
        <Link to={`/posts/${post.slug}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight hover:text-[#099DFF] transition-colors leading-snug">
            {post.title}
          </h2>
        </Link>

        {/* Clean wrapped metadata row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-500 font-medium">
          <span>Written by</span>
          <Link
            to={`/posts?author=${post.user?.username || "Admin"}`}
            className="text-blue-500 hover:underline font-semibold"
          >
            {post.user?.username || "Admin"}
          </Link>
          <span>on</span>
          <Link
            to={`/posts?cat=${post.category}`}
            className="text-blue-500 hover:underline capitalize font-semibold"
          >
            {post.category}
          </Link>
          <span>•</span>
          <span>{format(post.createdAt)}</span>
        </div>

        {/* Snippet / Description */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
          {post.desc}
        </p>

        <Link
          to={`/posts/${post.slug}`}
          className="text-xs sm:text-sm font-semibold text-blue-500 hover:underline mt-1 inline-flex items-center gap-1"
        >
          Read article &rarr;
        </Link>
      </div>
    </article>
  );
};

export default PostListItem;