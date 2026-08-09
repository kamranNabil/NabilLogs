import { Link } from "react-router-dom";
import Image from "./image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

const fetchPost = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`);
  return response.data;
};

const FeaturedPosts = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: fetchPost,
  });

  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col gap-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="rounded-3xl bg-gray-200 w-full h-80"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row lg:h-1/3 justify-between gap-4">
                <div className="w-full sm:w-1/3 aspect-video bg-gray-200 rounded-3xl"></div>
                <div className="w-2/3 flex flex-col gap-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 py-4">An error has occurred: {error.message}</div>;

  const posts = data?.posts;
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800">Featured Posts</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Featured Post */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {posts[0].img && (
            <Image
              src={posts[0].img}
              alt={`Cover image for ${posts[0].title}`}
              className="rounded-3xl object-cover w-full h-80"
              w="895"
              h="320"
              loading="eager"
              fetchpriority="high"
            />
          )}
          <div className="flex items-center gap-4">
            <span className="font-semibold lg:text-lg">01.</span>
            <Link to={`/posts?cat=${posts[0].category}`} className="text-blue-800 lg:text-lg">
              {posts[0].category}
            </Link>
            <span className="text-gray-600">{format(posts[0].createdAt)}</span>
          </div>

          <Link
            to={`/singlepost/${posts[0].slug}`}
            className="text-xl lg:text-3xl font-semibold lg:font-bold hover:text-blue-800 transition-colors"
            aria-label={`Read featured article: ${posts[0].title}`}
          >
            {posts[0].title}
          </Link>
        </div>

        {/* Secondary Featured Posts List */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {posts.slice(1, 4).map((post, index) => (
            <div key={post._id || index} className="flex flex-col sm:flex-row lg:h-1/3 justify-between gap-4">
              {post.img && (
                <div className="w-full sm:w-1/3 aspect-video">
                  <Image
                    src={post.img}
                    alt={`Cover image for ${post.title}`}
                    className="rounded-3xl object-cover w-full h-full"
                    w="320"
                    h="240"
                  />
                </div>
              )}
              <div className="w-2/3">
                <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                  <span className="font-semibold">0{index + 2}.</span>
                  <Link to={`/posts?cat=${post.category}`} className="text-blue-800">
                    {post.category}
                  </Link>
                  <span className="text-gray-600 text-sm">{format(post.createdAt)}</span>
                </div>
                <Link
                  to={`/singlepost/${post.slug}`}
                  className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium hover:text-blue-800 transition-colors"
                  aria-label={`Read article: ${post.title}`}
                >
                  {post.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPosts;