import Image from "../components/image";
import { Link, useParams } from "react-router-dom";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search.jsx";
import Comments from "../components/Comments.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DOMPurify from "dompurify";
import { format } from "timeago.js";
import { Helmet } from "react-helmet-async";

const fetchPost = async (slug) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return response.data;
};

const getReadTime = (content) => {
  if (!content) return "1 min read";
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

const SinglePost = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-8 animate-pulse py-4">
        <div className="h-12 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
      </div>
    );
  }

  if (error) return <div className="py-12 text-center text-red-500">Error loading post: {error.message}</div>;
  if (!data) return <div className="py-12 text-center text-lg">Post not found!</div>;

  return (
    <div className="flex flex-col mt-14">
      <Helmet>
        <title>{`${data.title} | NabilLogs`}</title>
        <meta name="description" content={data.desc || "Read this article on NabilLogs."} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.desc} />
      </Helmet>
      {data.img && <meta property="og:image" content={data.img} />}

      {/* Post Header / Meta */}
      <div className="flex gap-8 mt-10">
        <div className="lg:w-3/5 flex flex-col gap-3">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold py-2">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>written by</span>
            {/* Header Byline */}
            <Link to={`/posts?author=${data.user?.username}`} className="text-blue-800 font-medium">
              {data.user?.username || "Guest Writer"}
            </Link>
            <span>on</span>
            <Link to={`/posts?cat=${data.category}`} className="text-blue-800 font-medium">{data.category}</Link>
            <span>{format(data.createdAt)}</span>
            <span>•</span>
            <span>{getReadTime(data.content)}</span>
          </div>
          <p className="text-gray-500 font-medium">
            {data.desc}
          </p>
        </div>
        {data.img && (
          <div className="hidden lg:block w-2/5 px-6 mb-4">
            <Image
              src={data.img}
              alt={`Cover image for ${data.title}`}
              w="600"
              h="300"
              className="rounded-2xl object-cover w-80 h-64"
            />
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div className="flex flex-col md:flex-row gap-12">
        <div
          className="lg:w-3/4 lg:text-lg flex flex-col text-justify prose max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }}
        />

        {/* Sidebar Menu */}
        <div className="px-4 h-max sticky top-4 lg:w-1/4">
          <h2 className="mb-1 text-sm font-medium">Author</h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {data.user?.img && (
                <Image
                  src={data.user.img}
                  alt={`${data.user.username || "Author"}'s avatar`}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />
              )}
              {/* Sidebar Author Box */}
              <Link to={`/posts?author=${data.user?.username}`} className="text-blue-800 font-semibold">
                {data.user?.username || "Guest Writer"}
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              {data.user?.bio || "Software engineer sharing backend architecture and tech insights."}
            </p>
            <div className="flex gap-2">
              <Link to="/" aria-label="Facebook (link not yet configured)">
                <Image src="https://ik.imagekit.io/xljac05tb/public/facebook.svg?updatedAt=1762241100863" alt="Facebook" w={20} h={20} />
              </Link>
              <Link to="/" aria-label="Instagram (link not yet configured)">
                <Image src="https://ik.imagekit.io/xljac05tb/public/instagram.svg?updatedAt=1762241100976" alt="Instagram" w={20} h={20} />
              </Link>
            </div>
          </div>

          <PostMenuActions post={data} />

          <h2 className="mt-2 mb-1 text-sm font-medium">Categories</h2>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline" to="/posts">All</Link>
            <Link className="underline" to="/posts?cat=web-design">Web Design</Link>
            <Link className="underline" to="/posts?cat=app-development">App Development</Link>
            <Link className="underline" to="/posts?cat=database">Database</Link>
            <Link className="underline" to="/posts?cat=seo">SEO</Link>
            <Link className="underline" to="/posts?cat=marketing">Marketing</Link>
          </div>

          <h2 className="mt-5 mb-2 text-sm font-medium">Search</h2>
          <Search />
        </div>
      </div>

      {/* Comments Section */}
      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePost;