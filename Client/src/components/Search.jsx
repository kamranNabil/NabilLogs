import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(currentSearch);

  useEffect(() => {
    setQuery(currentSearch);
  }, [currentSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = (query || "").trim();

    const isPostsPage = location.pathname
      ? location.pathname.startsWith("/posts")
      : false;

    const newParams = isPostsPage
      ? new URLSearchParams(searchParams)
      : new URLSearchParams();

    if (trimmed) {
      newParams.set("search", trimmed);
      newParams.delete("page");
    } else {
      newParams.delete("search");
    }

    navigate(`/posts?${newParams.toString()}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 bg-slate-100/80 px-3 py-2 rounded-full"
    >
      <svg
        className="w-4 h-4 text-slate-400 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search posts..."
        className="bg-transparent text-sm text-slate-800 placeholder-slate-400 w-full outline-none"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("search");
            navigate(`/posts?${newParams.toString()}`);
          }}
          className="text-slate-400 hover:text-slate-600 text-xs px-1"
        >
          ✕
        </button>
      )}
    </form>
  );
};

export default Search;