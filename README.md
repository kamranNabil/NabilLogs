# NabilLogs — Full-Stack Blog Publishing Platform

<p align="left">
  <a href="https://nabillogs.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-nabillogs.vercel.app-099DFF?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="Frontend" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Backend-Node.js_+_Express_5-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Backend" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="Database" /></a>
</p>

A full-stack content publishing platform engineered for developers, backend architects, and software engineers to share technical articles, architectural insights, and tutorials. Built with a responsive mobile-first UI, custom JWT-based authentication, rich-text sanitization, high-performance infinite scrolling feeds, and cloud-optimized media delivery.

## ⚡ Key Highlights & Architecture

- **Custom JWT Authentication & Role-Based Access:** Lightweight, self-hosted authentication system utilizing JSON Web Tokens (`jsonwebtoken`) and `bcryptjs` with protected and optional auth middleware (`authMiddleware.js`), eliminating external auth provider dependencies.

- **Synchronized Search, Categorization & Multi-Sort:** URL-synced parameter queries (`useSearchParams`) powering real-time category filtering (with legacy slug normalization), text search, and multi-mode sorting (Newest, Most Read / Trending, and Oldest).

- **Optimized Infinite Scroll Feed:** Virtual scroll mechanics leveraging `@tanstack/react-query` and `react-intersection-observer` with error-guarded triggers to prevent excessive background refetches.

- **Rich-Text Publishing & XSS Protection:** WYSIWYG article authoring with `react-quill-new`, parsed and thoroughly sanitized prior to persistence via `dompurify`.

- **Cloud-Optimized Media Pipeline:** High-efficiency client-side file uploads, CDN transforms, and responsive delivery powered by the **ImageKit React SDK** (`imagekitio-react`) backed by server-side HMAC signature generation.

- **Automated Slug Generation & View Tracking:** URL slug resolution using `slugify` and custom visit-tracking middleware (`IncreasedVisit.js`) to log post views without blocking response lifecycles.

## 🛠️ Tech Stack & Dependencies

### Client (`/Client`)

- **Core:** React 18, Vite 5, React Router DOM v7
- **State & Data Fetching:** TanStack React Query v5, Axios
- **UI & Styling:** Tailwind CSS (`#099DFF` brand accent), PostCSS, Autoprefixer
- **Editor & Sanitization:** React-Quill-New, DOMPurify
- **Media & Icons:** `imagekitio-react`, `lucide-react` / `react-icons`
- **Utilities:** `react-intersection-observer`, `timeago.js`, `react-toastify`

### Server (`/Server`)

- **Runtime & Framework:** Node.js (ES Modules), Express 5
- **Database & ODM:** MongoDB Atlas, Mongoose 8
- **Authentication & Security:** `jsonwebtoken` (JWT), `bcryptjs`, `cors`
- **Media & File Processing:** ImageKit Node SDK, Body-Parser
- **Utilities:** `slugify`, `dotenv`

## 📂 Project Structure

```text
NabilLogs/
├── Client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Comm.jsx               # Comment card display
│   │   │   ├── Comments.jsx           # Comment thread & reply form
│   │   │   ├── FeaturedPosts.jsx      # Hero section featured post layout
│   │   │   ├── image.jsx              # ImageKit transformation wrapper
│   │   │   ├── MainCategories.jsx     # Category pill navigation bar
│   │   │   ├── Navbar.jsx             # Top nav with responsive drawer & auth actions
│   │   │   ├── PostList.jsx           # Infinite-scrolling post feed (Intersection Observer)
│   │   │   ├── PostListItem.jsx       # Individual post preview card
│   │   │   ├── PostMenuActions.jsx    # Save/Bookmark & Author delete controls
│   │   │   ├── Search.jsx             # Query string search input
│   │   │   ├── SideMenu.jsx           # Dynamic filter (Newest/Trending/Oldest) & categories
│   │   │   └── Uploads.jsx            # ImageKit file upload component
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # JWT state provider & persistence
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx         # App shell & persistent layout container
│   │   ├── routes/
│   │   │   ├── Home.jsx               # Landing page view
│   │   │   ├── Login.jsx              # Custom JWT sign-in page
│   │   │   ├── Postlist.jsx           # Filtered posts archive page
│   │   │   ├── Register.jsx           # Custom account registration page
│   │   │   ├── SinglePost.jsx         # Full article reader view
│   │   │   └── Write.jsx              # Rich-text editor & post publication
│   │   ├── App.jsx
│   │   ├── index.css                  # Tailwind directives & brand colors
│   │   └── main.jsx                   # React root & QueryClient provider
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── Server/
    ├── controllers/
    │   ├── AuthControllers.js         # Register, login, and token verification
    │   ├── Commentscontrollers.js     # Comments CRUD operations
    │   ├── Postscontrollers.js        # Post CRUD, slug lookup, and aliased filters
    │   └── Usercontrollers.js         # Saved posts and user profile actions
    ├── lib/
    │   └── ConnectDB.js               # MongoDB connection handler
    ├── middleware/
    │   ├── authMiddleware.js          # verifyAuth and optionalAuth JWT validators
    │   └── IncreasedVisit.js          # Asynchronous post view counter
    ├── models/
    │   ├── Commentsmodels.js          # Comment Mongoose schema
    │   ├── Postsmodels.js             # Post schema (title, slug, desc, content, img)
    │   └── Usermodels.js              # User schema with hashed passwords & saved posts
    ├── routes/
    │   ├── Authroutes.js              # /auth authentication endpoints
    │   ├── Commentsroutes.js          # /comments route handlers
    │   ├── Postsroutes.js             # /posts route handlers
    │   └── Userroutes.js              # /users route handlers
    ├── index.js                       # Express app entry point (bound to 0.0.0.0)
    └── package.json
```


```
⚙️ Local Development Setup
1. Clone the Repository
Bash
git clone [https://github.com/kamranNabil/NabilLogs.git](https://github.com/kamranNabil/NabilLogs.git)
cd NabilLogs


2. Backend Configuration (/Server)
Bash
cd Server
npm install
Create a .env file in the /Server folder:


Code snippet
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_URL_ENDPOINT=[https://ik.imagekit.io/your_endpoint](https://ik.imagekit.io/your_endpoint)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
CLIENT_URL=http://localhost:5173


Start the backend server:
Bash
npm run dev


3. Frontend Configuration (/Client)
Open a new terminal tab and navigate to /Client:

Bash
cd Client
npm install


Create a .env file in the /Client folder:


Code snippet
VITE_API_URL=http://localhost:3000
VITE_IMAGEKIT_URL_ENDPOINT=[https://ik.imagekit.io/your_endpoint](https://ik.imagekit.io/your_endpoint)
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
Start the Vite development server:


Bash
npm run dev
The application will run locally at http://localhost:5173.

📡 API Endpoints
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
|  # | Method |  Route / Endpoint  |                                  Description                                  |            Auth / Access           |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 1  | POST   | /auth/register     | Register a new user account with hashed password                              | Public                             |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 2  | POST   | /auth/login        | Authenticate credentials and return signed JWT                                | Public                             |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 3  | GET    | /posts             | Fetch paginated posts with search query, category, and sorting filters (sort) | Public                             |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 4  | GET    | /posts/:slug       | Retrieve a single post by slug and increment view count                       | Public / Optional Auth             |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 5  | POST   | /posts             | Create and publish a new post                                                 | Authenticated (verifyAuth)         |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 6  | DELETE | /posts/:id         | Delete a post by ID                                                           | Protected (Author / Admin)         |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 7  | PATCH  | /posts/feature     | Toggle featured status of a post                                              | Protected (Admin)                  |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 8  | GET    | /comments/:postId  | Fetch all comments associated with a specific post                            | Public                             |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 9  | POST   | /comments/:postId  | Add a comment to an article                                                   | Authenticated (verifyAuth)         |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 10 | DELETE | /comments/:id      | Delete a comment by ID                                                        | Protected (Comment Author / Admin) |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 11 | GET    | /users/saved       | Fetch list of posts bookmarked/saved by the current user                      | Authenticated (verifyAuth)         |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 12 | PATCH  | /users/save        | Toggle post bookmark/save state for the authenticated user                    | Authenticated (verifyAuth)         |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
| 13 | GET    | /posts/upload-auth | Generate ImageKit client-side upload security signature                       | Authenticated (verifyAuth)         |
+----+--------+--------------------+-------------------------------------------------------------------------------+------------------------------------+
📄 License
This project is open-source and available under the MIT License.

Copyright (c) 2026 Md. Nabil Kamran
