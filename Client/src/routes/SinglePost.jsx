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
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-6 animate-pulse py-10 max-w-7xl mx-auto px-4">
        <div className="h-10 bg-slate-200 rounded-xl w-3/4"></div>
        <div className="h-5 bg-slate-200 rounded-lg w-1/2"></div>
        <div className="h-64 sm:h-96 bg-slate-200 rounded-3xl w-full mt-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-600 font-medium">
        Error loading post: {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center text-slate-500 font-medium">
        Post not found!
      </div>
    );
  }

  return (
    <article className="flex flex-col max-w-7xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-16">
      <Helmet>
        <title>{`${data.title} | NabilLogs`}</title>
        <meta name="description" content={data.desc || "Read this article on NabilLogs."} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.desc} />
        {data.img && <meta property="og:image" content={data.img} />}
      </Helmet>

      {/* Post Header / Meta */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start justify-between">
        <div className="w-full lg:w-3/5 flex flex-col gap-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight text-slate-900 leading-snug">
            {data.title}
          </h1>

          {/* Clean, wrapped metadata row */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-500 font-medium pt-1">
            <span>Written by</span>
            <Link
              to={`/posts?author=${data.user?.username}`}
              className="text-blue-500 hover:underline font-semibold"
            >
              {data.user?.username || "Guest Writer"}
            </Link>
            <span>on</span>
            <Link
              to={`/posts?cat=${data.category}`}
              className="text-blue-500 hover:underline capitalize font-semibold"
            >
              {data.category}
            </Link>
            <span>•</span>
            <span>{format(data.createdAt)}</span>
            <span>•</span>
            <span className="text-slate-400">{getReadTime(data.content)}</span>
          </div>

          {data.desc && (
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed mt-1">
              {data.desc}
            </p>
          )}
        </div>

        {/* Hero image — shown on all viewports */}
        {data.img && (
          <div className="w-full lg:w-2/5 shrink-0">
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-slate-100">
              <Image
                src={data.img}
                alt={`Cover image for ${data.title}`}
                w="700"
                h="450"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Body & Sidebar */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 mt-10">
        {/* Article text: removed text-justify to fix awkward word gaps */}
        <div
          className="
            w-full lg:w-3/4
            text-slate-700 text-base sm:text-lg leading-relaxed
            space-y-4 break-words text-left
            prose prose-slate max-w-none
            [&_p]:mb-4 [&_p]:leading-relaxed
            [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-3
            [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-2
            [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto
            [&_code]:text-sm [&_code]:font-mono
            [&_a]:text-[#099DFF] [&_a]:underline
            [&_img]:rounded-2xl [&_img]:shadow-sm
          "
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }}
        />

        {/* Sidebar Menu */}
        <aside className="w-full lg:w-1/4 flex flex-col gap-6 sticky top-24 self-start">
          <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/60 shadow-sm backdrop-blur-md">
            <h2 className="mb-3 text-xs uppercase tracking-wider text-slate-400 font-bold">
              Author
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {data.user?.img ? (
                  <Image
                    src={data.user.img}
                    alt={`${data.user.username || "Author"}'s avatar`}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                    w="40"
                    h="40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#099DFF] text-white flex items-center justify-center text-sm font-bold uppercase shadow-sm">
                    {data.user?.username?.[0] || "A"}
                  </div>
                )}
                <div>
                  <Link
                    to={`/posts?author=${data.user?.username}`}
                    className="text-slate-900 hover:text-[#099DFF] font-semibold text-sm transition"
                  >
                    {data.user?.username || "Guest Writer"}
                  </Link>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {data.user?.bio || "Software engineer sharing backend architecture and tech insights."}
              </p>
              <div className="flex gap-2.5 pt-1">
                <Link to="/" aria-label="Facebook">
                  <Image
                    src="https://ik.imagekit.io/xljac05tb/public/facebook.svg?updatedAt=1762241100863"
                    alt="Facebook"
                    w={18}
                    h={18}
                  />
                </Link>
                <Link to="/" aria-label="Instagram">
                  <Image
                    src="https://ik.imagekit.io/xljac05tb/public/instagram.svg?updatedAt=1762241100976"
                    alt="Instagram"
                    w={18}
                    h={18}
                  />
                </Link>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <PostMenuActions post={data} />
            </div>
          </div>

          {/* Categories card */}
          <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/60 shadow-sm backdrop-blur-md">
            <h2 className="mb-3 text-xs uppercase tracking-wider text-slate-400 font-bold">
              Categories
            </h2>
            <div className="flex flex-wrap lg:flex-col gap-2 text-xs font-medium">
              <Link className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#099DFF] hover:text-white transition" to="/posts">
                All
              </Link>
              <Link className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#099DFF] hover:text-white transition" to="/posts?cat=web-design">
                Web Design
              </Link>
              <Link className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#099DFF] hover:text-white transition" to="/posts?cat=app-development">
                App Development
              </Link>
              <Link className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#099DFF] hover:text-white transition" to="/posts?cat=databases">
                Databases
              </Link>
              <Link className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#099DFF] hover:text-white transition" to="/posts?cat=seo">
                SEO
              </Link>
              <Link className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#099DFF] hover:text-white transition" to="/posts?cat=marketing">
                Marketing
              </Link>
            </div>
          </div>

          {/* Search Card */}
          <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/60 shadow-sm backdrop-blur-md">
            <h2 className="mb-3 text-xs uppercase tracking-wider text-slate-400 font-bold">
              Search
            </h2>
            <Search />
          </div>
        </aside>
      </div>

      {/* Comments Section */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <Comments postId={data._id} />
      </div>
    </article>
  );
};

export default SinglePost;