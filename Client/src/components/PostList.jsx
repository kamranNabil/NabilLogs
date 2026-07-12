import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import InfiniteScroll from "react-infinite-scroll-component";

const fetchPosts = async (pageParam) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 5 },
  });
  // res.data is { posts, hasMore, nextPage }
  return res.data;
};

const PostList = () => {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  console.log("🔍 Query status:", status);
  console.log("📊 Data:", data);
  if (error) console.error("❌ Fetch error:", error.message);

  if (status === "pending") return <div className="text-center py-8">Loading posts...</div>;
  if (status === "error") return <div className="text-center py-8 text-red-600">Error: {error?.message || "Failed to load posts"}</div>;

  const allposts = data?.pages?.flatMap(page => page?.posts || []) || [];

  console.log(data);

  return (
    <InfiniteScroll
      dataLength={allposts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more posts...</h4>}
      endMessage={<p><b>All posts loaded!</b></p>}
    >
      {allposts.length > 0 ? (
        <>
          {allposts.map(post => (
            <PostListItem key={post._id} post={post} />
          ))}
          <div ref={ref} className="py-4 text-center">
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Scroll for more"
              : "No more posts"}
          </div>
        </>
      ) : (
        <div>No posts available</div>
      )}
    </InfiniteScroll>
  );
};

export default PostList;
