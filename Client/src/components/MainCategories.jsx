import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
  const navigate = useNavigate();

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    navigate(value ? `/posts?cat=${value}` : "/posts");
  };

  return (
    <>
      <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-3 shadow-lg items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-between gap-4">
          <Link
            to="/posts"
            className="bg-blue-800 text-white rounded-full px-4 py-2 whitespace-nowrap"
          >
            All Posts
          </Link>
          <Link
            to="/posts?cat=webD"
            className="hover:bg-blue-50 rounded-full px-4 py-2 whitespace-nowrap"
          >
            Web Design
          </Link>
          <Link
            to="/posts?cat=appd"
            className="hover:bg-blue-50 rounded-full px-4 py-2 whitespace-nowrap"
          >
            App Development
          </Link>
          <Link
            to="/posts?cat=db"
            className="hover:bg-blue-50 rounded-full px-4 py-2 whitespace-nowrap"
          >
            Databases
          </Link>
          <Link
            to="/posts?cat=seo"
            className="hover:bg-blue-50 rounded-full px-4 py-2 whitespace-nowrap"
          >
            SEO
          </Link>
          <Link
            to="/posts?cat=marketing"
            className="hover:bg-blue-50 rounded-full px-4 py-2 whitespace-nowrap"
          >
            Marketing
          </Link>
        </div>
        <span className="text-xl font-medium">|</span>
        <Search />
      </div>

      <div className="md:hidden bg-white rounded-3xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <select
            onChange={handleCategoryChange}
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-300 focus:outline-none"
          >
            <option value="">All Posts</option>
            <option value="webD">Web Design</option>
            <option value="appd">App Development</option>
            <option value="db">Databases</option>
            <option value="seo">SEO</option>
            <option value="marketing">Marketing</option>
          </select>
          <div className="flex-1 min-w-0">
            <Search />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainCategories;