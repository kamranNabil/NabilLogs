import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#E6E6FF] flex flex-col justify-between">
            <Navbar />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;