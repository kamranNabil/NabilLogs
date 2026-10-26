import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#eef2ff] flex flex-col relative w-full overflow-x-hidden">
      <Navbar />
      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-8 pt-24 md:pt-28 pb-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;