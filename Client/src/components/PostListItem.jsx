import { Link } from "react-router-dom";
import Image from "./image";
import { format } from "timeago.js";

const getExcerpt = (html, maxLength = 300) => {
  if (!html) return "";

  const plainText = html
    .replace(/<[^>]*>/g, " ")  
    .replace(/\s+/g, " ")       
    .trim();

  if (plainText.length <= maxLength) return plainText;

  const trimmed = plainText.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");
  return trimmed.slice(0, lastSpace > 0 ? lastSpace : maxLength) + "...";
};

const PostListItem = ({ post }) => {
  const placeholderImage = "https://placehold.co/400x300?text=Blog+Post";

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      {/* Image */}
      <div className="md:w-1/3">
        <Image
          src={post.img || placeholderImage}
          alt={`Cover image for ${post.title}`}
          className="rounded-2xl object-cover w-full"
          w="400"
          h="230"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4 md:w-2/3 mb-4 ">
        <Link to={`/singlepost/${post.slug}`} className="text-xl font-semibold">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link className="text-blue-800" to={`/posts?author=${post.user.username}`}>
            {post.user.username}
          </Link>
          <span>on</span>
          <Link className="text-blue-800" to={`/posts?cat=${post.category}`}>
            {post.category}
          </Link>
          <span>{format(post.createdAt)}</span>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {getExcerpt(post.content)}
        </p>
        <Link
          to={`/singlepost/${post.slug}`}
          className="underline text-blue-800 text-sm"
          aria-label={`Read more about ${post.title}`}
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;