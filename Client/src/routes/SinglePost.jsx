import Image from "../components/image";
import { Link, useParams } from "react-router-dom";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search.jsx";
import Comments from "../components/Comments.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "timeago.js";

const fetchPost = async (slug) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return response.data;
};

const SinglePost = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending) return <div className="py-12 text-center text-lg">Loading post...</div>;
  if (error) return <div className="py-12 text-center text-red-500">Error loading post: {error.message}</div>;
  if (!data) return <div className="py-12 text-center text-lg">Post not found!</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Post Header / Meta */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>written by</span>
            <Link className="text-blue-800 font-medium">{data.user?.username || "Admin"}</Link>
            <span>on</span>
            <Link className="text-blue-800 font-medium">{data.category}</Link>
            <span>{format(data.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">
            {data.desc}
          </p>
        </div>
        {data.img && (
          <div className="hidden lg:block w-2/5">
            <Image
              src={data.img}
              w="600"
              h="300"
              className="rounded-2xl object-cover w-full h-64"
            />
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Renders HTML content stored in data.content */}
        <div 
          className="lg:w-3/4 lg:text-lg flex flex-col gap-6 text-justify prose max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />

        {/* Sidebar Menu */}
        <div className="px-4 h-max sticky top-8 lg:w-1/4">
          <h1 className="mt-2 mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {data.user?.img && (
                <Image
                  src={data.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />
              )}
              <Link className="text-blue-800 font-semibold">
                {data.user?.username || "Admin"}
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              {data.user?.bio || "Software engineer sharing backend architecture and tech insights."}
            </p>
            <div className="flex gap-2">
              <Link to="/">
                <Image src="https://ik.imagekit.io/xljac05tb/public/facebook.svg?updatedAt=1762241100863" w={20} h={20} />
              </Link>
              <Link to="/">
                <Image src="https://ik.imagekit.io/xljac05tb/public/instagram.svg?updatedAt=1762241100976" w={20} h={20} />
              </Link>
            </div>
          </div>

          <PostMenuActions post={data}/>

          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline" to="/posts">All</Link>
            <Link className="underline" to="/posts?cat=webD">Web Design</Link>
            <Link className="underline" to="/posts?cat=appd">App Development</Link>
            <Link className="underline" to="/posts?cat=db">Databases</Link>
            <Link className="underline" to="/posts?cat=seo">SEO</Link>
            <Link className="underline" to="/posts?cat=marketing">Marketing</Link>
          </div>

          <h1 className="mt-5 mb-2 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>

      {/* Comments Section */}
      <Comments postId={data._id}/>
    </div>
  );
};

export default SinglePost;