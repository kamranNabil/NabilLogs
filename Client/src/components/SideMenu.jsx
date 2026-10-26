import Search from "./Search";
import { useSearchParams } from "react-router-dom";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";

  const handleFilterChange = (e) => {
    const selectedSort = e.target.value;

    const handleFilterChange = (e) => {
      const selectedSort = e.target.value;

      const newParams = new URLSearchParams(searchParams);

      if (selectedSort === "newest") {
        newParams.delete("sort");
      } else {
        newParams.set("sort", selectedSort);
      }

      setSearchParams(newParams);
    };

    return (
      <div className="px-4 h-max sticky top-8">
        <h1 className="mb-4 text-sm font-medium">Search</h1>
        <Search />
        <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
        <div className="flex flex-col gap-2 text-sm">
          <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sort"
              onChange={handleFilterChange}
              value="newest"
              className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
            />
            <span>Newest</span>
          </label>
          <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sort"
              onChange={handleFilterChange}
              value="trending"
              className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
            />
            <span>Most Read</span>
          </label>
          <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sort"
              onChange={handleFilterChange}
              value="oldest"
              className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
            />
            <span>Oldest</span>
          </label>
        </div>
        <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
        <div className="flex flex-col gap-2 text-sm">
          <button
            type="button"
            className="underline text-left"
            onClick={() => handleCategoryChange("general")}
          >
            All
          </button>
          <button
            type="button"
            className="underline text-left"
            onClick={() => handleCategoryChange("web-design")}
          >
            Web Design
          </button>
          <button
            type="button"
            className="underline text-left"
            onClick={() => handleCategoryChange("app-development")}
          >
            App Development
          </button>
          <button
            type="button"
            className="underline text-left"
            onClick={() => handleCategoryChange("database")}
          >
            Database
          </button>
          <button
            type="button"
            className="underline text-left"
            onClick={() => handleCategoryChange("seo")}
          >
            SEO
          </button>
          <button
            type="button"
            className="underline text-left"
            onClick={() => handleCategoryChange("marketing")}
          >
            Marketing
          </button>
        </div>
      </div>
    );
  }
};

export default SideMenu;