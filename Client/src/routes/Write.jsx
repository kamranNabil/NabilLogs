import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Write = () => {
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [guestAuthor, setGuestAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  // Inside handleSubmit in Write.jsx:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const activeToken = token || localStorage.getItem("token");

      const payload = {
        title,
        category,
        desc,
        content,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/posts`,
        payload,
        {
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        }
      );

      navigate(`/singlepost/${res.data.post.slug}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-light">Create a post</h1>

      {!currentUser && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mt-8 flex items-center justify-between">
          <p className="text-xs text-blue-700">
            Wanna publish as guest. Enter your name or post anonymously.
          </p>
          <input
            type="text"
            placeholder="Author name (Optional)"
            value={guestAuthor}
            onChange={(e) => setGuestAuthor(e.target.value)}
            className="p-1.5 text-xs bg-white border rounded-lg outline-none"
          />
        </div>
      )}

      <input
        type="text"
        placeholder="My Story"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-4xl mt-4 font-semibold outline-none bg-transparent"
        required
      />

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Choose a category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-xl outline-none"
        >
          <option value="general">General</option>
          <option value="web-design">Web Design</option>
          <option value="app-development">App Development</option>
          <option value="database">Database</option>
          <option value="seo">SEO</option>
          <option value="marketing">SEO</option>
        </select>
      </div>

      <textarea
        placeholder="A short desc"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="p-4 rounded-xl bg-white shadow-sm border outline-none"
        rows={3}
        required
      />

      <textarea
        placeholder="Write your story..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="p-4 rounded-xl bg-white shadow-sm border outline-none min-h-[300px]"
        required
      />

      <button
        disabled={loading}
        className="w-36 py-3 bg-blue-800 text-white rounded-xl font-medium hover:bg-blue-900 transition disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Send"}
      </button>
    </form>
  );
};

export default Write;