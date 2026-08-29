# NabilLogs — Full-Stack Blog Publishing Platform

<p align="left">
  <a href="https://nabillogs.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-nabillogs.vercel.app-2563EB?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="Frontend" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Backend-Node.js_+_Express_5-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Backend" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="Database" /></a>
</p>

A full-stack content publishing platform engineered for developers, backend architects, and software engineers to share technical articles, architectural insights, and tutorials. Built with a responsive mobile-first UI, secure authentication, automated webhook sync, rich-text sanitization, and cloud-optimized media delivery.

## ⚡ Key Highlights & Architecture

- **Multi-Tier Identity & Clerk Sync:** User onboarding and access management via `@clerk/express` and `@clerk/clerk-react`, coupled with **Svix-verified Clerk webhooks** for real-time user lifecycle synchronization with MongoDB.

- **Rich-Text Publishing & XSS Protection:** WYSIWYG authoring with `react-quill-new`, parsed and sanitized before persistence and rendering via `dompurify`.

- **Infinite Feed & Query Caching:** Dynamic cursor and page-based post feeds powered by `@tanstack/react-query`, `react-infinite-scroll-component`, and `react-intersection-observer`.

- **Optimized Media CDN Pipeline:** High-efficiency asset transformations, uploads, and delivery via the **ImageKit React SDK** (`imagekitio-react`) and backend upload authentication signatures.

- **Automated URL & View Tracking:** Automatic slug generation with `slugify` and custom visit tracking middleware (`IncreasedVisit.js`) to log post views.

- **SEO & Dynamic Metadata:** Client-side document head management using `react-helmet-async`.

## 🛠️ Tech Stack & Dependencies

### Client (`/Client`)

- **Core:** React 18, Vite 5, React Router DOM v7
- **State & Data Fetching:** TanStack React Query v5, Axios
- **UI & Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Editor & Sanitization:** React-Quill-New, DOMPurify
- **Auth & Media:** `@clerk/clerk-react`, `imagekitio-react`
- **Utilities:** `timeago.js`, `react-toastify`, `react-intersection-observer`

### Server (`/Server`)

- **Runtime & Framework:** Node.js (ES Modules), Express 5
- **Database & ODM:** MongoDB Atlas, Mongoose 8
- **Authentication & Webhooks:** `@clerk/express`, Svix
- **Media & File Processing:** ImageKit SDK, Body-Parser
- **Utilities:** `slugify`, `cors`, `dotenv`

## 📂 Project Structure

```text
FullStackBlog/
├── Client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Comm.jsx               # Comment card display
│   │   │   ├── Comments.jsx           # Comment list & post comment form
│   │   │   ├── FeaturedPosts.jsx      # Hero section featured post carousel/grid
│   │   │   ├── image.jsx              # ImageKit optimized image wrapper
│   │   │   ├── MainCategories.jsx     # Category pill navigation bar
│   │   │   ├── Navbar.jsx             # Responsive navigation with mobile menu drawer
│   │   │   ├── PostList.jsx           # Infinite scrolling post feed
│   │   │   ├── PostListItem.jsx       # Individual post preview card
│   │   │   ├── PostMenuActions.jsx    # Save/Bookmark & Author delete controls
│   │   │   ├── Search.jsx             # Search bar filter
│   │   │   ├── SideMenu.jsx           # Category list & filtering sidebar
│   │   │   └── Uploads.jsx            # ImageKit file upload handler
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx         # App shell & common container
│   │   ├── routes/
│   │   │   ├── Home.jsx               # Landing page view
│   │   │   ├── Login.jsx              # Clerk Sign-In screen
│   │   │   ├── PostList.jsx           # Filtered posts archive page
│   │   │   ├── Register.jsx           # Clerk Sign-Up screen
│   │   │   ├── SinglePost.jsx         # Full article reader view
│   │   │   └── Write.jsx              # Article creation & rich-text editor
│   │   ├── App.jsx
│   │   ├── index.css                  # Tailwind styles & scrollbar overrides
│   │   └── main.jsx                   # QueryClient & Clerk Provider setup
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── Server/
    ├── controllers/
    │   ├── Commentscontrollers.js     # Comments CRUD operations
    │   ├── Postscontrollers.js        # Post filtering, slug lookup, and creation
    │   ├── Usercontrollers.js         # Saved posts and user-specific actions
    │   └── Webhookcontrollers.js      # Svix Clerk user synchronization
    ├── lib/
    │   └── ConnectDB.js               # MongoDB connection handler
    ├── Middleware/
    │   └── IncreasedVisit.js          # View count tracking middleware
    ├── models/
    │   ├── Commentsmodels.js          # Comment Mongoose schema
    │   ├── Postsmodels.js             # Post schema (title, slug, desc, content, img)
    │   ├── Usermodels.js              # User schema & saved post references
    │   └── Webhookmodels.js           # Webhook event payload schema
    ├── routes/
    │   ├── Commentsroutes.js
    │   ├── Postsroutes.js
    │   ├── Userroutes.js
    │   └── Webhookroutes.js
    ├── index.js                       # Express application entry point
    └── package.json
```

---

## ⚙️ Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/kamranNabil/NabilLogs.git
cd NabilLogs
```

### 2. Backend Configuration (`/Server`)
```bash
cd Server
npm install
```

Create a `.env` file in the `/Server` folder:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_svix_webhook_secret
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Configuration (`/Client`)
Open a new terminal tab and navigate to `/Client`:
```bash
cd Client
npm install
```

Create a `.env` file in the `/Client` folder:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
VITE_API_URL=http://localhost:3000
```

Start the Vite development server:
```bash
npm run dev
```

The application will run locally at http://localhost:5173.

| #  | Method | Route / Endpoint                     | Description                                                                    | Auth / Access                      |
|----|--------|--------------------------------------|--------------------------------------------------------------------------------|------------------------------------|
| 1  | GET    | /posts                               | Fetch paginated posts with search query, category, author, and sorting filters | Public                             |
| 2  | GET    | /posts/:slug                         | Retrieve a single post by slug and increment visit count                       | Public                             |
| 3  | POST   | /posts                               | Create and publish a new post                                                  | Authenticated                      |
| 4  | DELETE | /posts/:id                           | Delete a post by ID                                                            | Protected (Author / Admin)         |
| 5  | PATCH  | /posts/feature                       | Toggle featured status of a post                                               | Protected (Admin)                  |
| 6  | GET    | /comments/:postId                    | Fetch all comments associated with a specific post                             | Public                             |
| 7  | POST   | /comments/:postId                    | Create a new comment on a post                                                 | Authenticated                      |
| 8  | DELETE | /comments/:id                        | Delete a comment by ID                                                         | Protected (Comment Author / Admin) |
| 9  | GET    | /users/saved                         | Fetch list of posts bookmarked/saved by the current user                       | Authenticated                      |
| 10 | PATCH  | /users/save                          | Add or remove a post ID from user's saved posts list                           | Authenticated                      |
| 11 | GET    | /posts/upload-auth (or /upload/auth) | Generate ImageKit client-side security authentication signature                | Authenticated                      |
| 12 | POST   | /webhooks                            | Handle Svix-verified Clerk user sync events (user.created, user. deleted, etc.) | Clerk Webhook                      |

## 📄 License
MIT License

Copyright (c) 2026 Md. Nabil Kamran

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
