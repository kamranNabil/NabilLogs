import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(currentSearch);

  // Synchronize input value with browser URL changes (e.g., Back/Forward or query clear)
  useEffect(() => {
    setQuery(currentSearch);
  }, [currentSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();

    // Preserve existing filters if already on /posts, otherwise start clean
    const isPostsPage = location.pathname ? location.pathname.startsWith("/posts") : false;
    const newParams = isPostsPage
      ? new URLSearchParams(searchParams)
      : new URLSearchParams();

    if (trimmed) {
      newParams.set("search", trimmed);
      newParams.delete("page"); // Reset pagination back to page 1 on new search
    } else {
      newParams.delete("search");
    }

    navigate(`/posts?${newParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 bg-slate-100/80 px-3 py-2 rounded-xl border border-slate-200/70 focus-within:border-[#099DFF] focus-within:bg-white transition-all shadow-inner"
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