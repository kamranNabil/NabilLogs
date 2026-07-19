import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            const query = event.target.value;
            if (location.pathname === "/posts") {
                // already on /posts — just update the search param in place
                setSearchParams({ ...Object.fromEntries([...searchParams]), search: query });
            } else {
                // not on /posts yet — navigate there with the search param
                navigate(`/posts?search=${query}`);
            }
        }
    };

    return (
        <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2 min-w-0 w-full md:w-[260px] max-w-full">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                width="20"
                height="20"
                stroke="gray"
            >
                <circle cx="10.5" cy="10.5" r="7.5" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
                type="text"
                placeholder="Search a post..."
                className="bg-transparent outline-none w-full min-w-0 placeholder:text-sm"
                onKeyPress={handleKeyPress}
            />
        </div>
    );
};

export default Search;