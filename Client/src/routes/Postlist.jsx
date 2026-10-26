import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
import { useState } from "react";

const Postlist = () => {

  const [open, setOpen] = useState(false)

  return (
    <div className="">
      <h1 className="mb-8 mt-24 font-semibold text-2xl">Development Blogs</h1>
      <button onClick={() => setOpen((prev) => !prev)} className="bg-blue-800 text-sm text-white px-4 py-2 md:hidden rounded-2xl mb-4">{open ? "close" : "Filter or Search"}</button>
      <div className="flex flex-col-reverse md:flex-row gap-8">
        <div className="">
          <PostList />
        </div>
        <div className={`${open ? "block" : "hidden"} md:block`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default Postlist;
