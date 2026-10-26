import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;
};

const PostList = () => {
  const [searchParams] = useSearchParams();
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isError,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParamsObj],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isError) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isError, fetchNextPage]);

  if (status === "pending") {
    return <div className="text-center py-8 text-gray-500">Loading posts...</div>;
  }

  if (status === "error") {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error?.message || "Failed to load posts"}
      </div>
    );
  }

  const allPosts = data?.pages?.flatMap((page) => page?.posts || []) || [];

  if (allPosts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No posts available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 mb-8">
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}

      {/* Sentinel element observed by useInView */}
      <div ref={ref} className="py-6 text-center text-sm text-gray-500">
        {isFetchingNextPage ? (
          <p className="font-medium animate-pulse">Loading more posts...</p>
        ) : hasNextPage ? (
          <p className="text-gray-400">Scroll down to load more</p>
        ) : (
          <p className="text-gray-400 font-medium">All posts loaded!</p>
        )}
      </div>
    </div>
  );
};

export default PostList;