# 📝 BlogHub - A Modern MERN Blogging Platform

<div align="center">

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://mern-blog-platform-beta.vercel.app)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.18+-000000?style=flat-square&logo=express)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

**A full-stack blogging platform built with modern web technologies, featuring real-time interactions, secure authentication, and a responsive UI.**

[Live Demo](https://mern-blog-platform-beta.vercel.app) • [Backend API](https://blog-backend-teal-tau.vercel.app) • [Report Bug](https://github.com/Sidd-17052004/Mern-Blog-Platform/issues) • [Request Feature](https://github.com/Sidd-17052004/Mern-Blog-Platform/discussions)

</div>

---

## ✨ Features

### 🔐 **Authentication & Authorization**

- Secure user registration and login
- JWT-based token authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- Persistent user sessions with localStorage

### 📚 **Blog Management**

- Create, read, update, and delete blog posts
- Rich text content with markdown support
- Image uploads and previews
- Automatic reading time calculation
- Draft saving to localStorage
- Blog categorization and organization

### 💬 **User Interactions**

- Like/Unlike blog posts
- Comments system with nested replies
- Real-time view counter
- User engagement statistics
- Trending blogs based on views and likes

### 👤 **User Profile**

- Customizable user profiles
- User dashboard with statistics
- Author pages to view user's blogs
- Profile editing capabilities
- User bio and avatar support

### 🎨 **User Experience**

- Modern, responsive UI with Material-UI
- Dark/Light theme support
- Smooth animations with Framer Motion
- Toast notifications for user feedback
- Loading skeletons for better UX
- Mobile-first design

### 🔍 **Additional Features**

- Full-text search functionality
- Blog filtering and sorting
- User recommendation system
- Author follow/unfollow (foundation ready)
- Deployment ready with Vercel

---

## 🛠️ Tech Stack

### **Frontend**

| Technology            | Purpose             |
| --------------------- | ------------------- |
| **React 18.2**        | UI library          |
| **Material-UI (MUI)** | Component library   |
| **Redux Toolkit**     | State management    |
| **Axios**             | HTTP client         |
| **Framer Motion**     | Animations          |
| **React Router v6**   | Client-side routing |
| **React Hot Toast**   | Notifications       |
| **GSAP**              | Advanced animations |

### **Backend**

| Technology     | Purpose               |
| -------------- | --------------------- |
| **Node.js**    | JavaScript runtime    |
| **Express.js** | Web framework         |
| **MongoDB**    | NoSQL database        |
| **Mongoose**   | ODM for MongoDB       |
| **JWT**        | Authentication tokens |
| **bcrypt**     | Password hashing      |
| **CORS**       | Cross-origin requests |
| **Morgan**     | HTTP logging          |

### **Deployment**

| Service           | Purpose                    |
| ----------------- | -------------------------- |
| **Vercel**        | Frontend & Backend hosting |
| **MongoDB Atlas** | Cloud database             |

---

## 📸 Project Highlights

### Key Achievements

✅ **Full-Stack Development** - Complete MERN implementation  
✅ **Responsive Design** - Works seamlessly on all devices  
✅ **Production Ready** - Deployed on Vercel with CI/CD  
✅ **Secure Authentication** - JWT + bcrypt password hashing  
✅ **Real-time Features** - View counts, likes, comments  
✅ **State Management** - Redux for complex state  
✅ **Code Quality** - ESLint configured, no build warnings  
✅ **Scalable Architecture** - Modular component structure

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for production)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Sidd-17052004/Mern-Blog-Platform.git
cd mern-stack-blog-app
```

2. **Setup Backend**

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT = 8080
DEV_MODE = development
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_secure_jwt_secret
JWT_EXPIRES_IN = 7d
EOF

# Start backend server
npm run server
# Server runs on http://localhost:8080
```

3. **Setup Frontend**

```bash
cd ../client
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8080" > .env

# Start frontend dev server
npm start
# App runs on http://localhost:3000
```

4. **Run Both Together (from root)**

```bash
npm run dev
```

---

## 📁 Project Structure

```
mern-stack-blog-app/
├── backend/
│   ├── api/
│   │   └── index.js                 # Vercel serverless entry point
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── blogControlller.js       # Blog business logic
│   │   └── userContoller.js         # User/Auth business logic
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT authentication
│   ├── models/
│   │   ├── blogModel.js             # Blog schema
│   │   └── userModel.js             # User schema
│   ├── routes/
│   │   ├── blogRoutes.js            # Blog endpoints
│   │   └── userRoutes.js            # User/Auth endpoints
│   ├── server.js                    # Express app setup
│   ├── package.json
│   ├── vercel.json                  # Vercel config
│   └── .env                         # Environment variables
│
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthComponents.js    # Auth UI components
│   │   │   ├── BlogCard.js          # Blog card component
│   │   │   ├── Header.js            # Navigation header
│   │   │   ├── Footer.js            # Footer component
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── AuthPage.js          # Auth page (login/register)
│   │   │   ├── Blogs.js             # All blogs list
│   │   │   ├── BlogView.js          # Single blog detail
│   │   │   ├── CreateBlog.js        # Create new blog
│   │   │   ├── Dashboard.js         # User dashboard
│   │   │   ├── UserProfile.js       # User profile page
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── ThemeContext.js      # Dark/Light theme
│   │   ├── redux/
│   │   │   └── store.js             # Redux store setup
│   │   ├── utils/
│   │   │   ├── axios.js             # Axios instance with auth
│   │   │   └── helpers.js           # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── vercel.json                  # Vercel config
│   └── .env                         # Environment variables
│
└── README.md
```

---

## 📚 API Documentation

### Base URL

```
https://blog-backend-teal-tau.vercel.app/api/v1
```

### Authentication Endpoints

#### Register User

```http
POST /user/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "gender": "Male",
  "occupation": "Developer"
}

Response: {
  "success": true,
  "message": "User registered successfully",
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### Login User

```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: {
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "jwt_token_here"
}
```

### Blog Endpoints

#### Get All Blogs

```http
GET /blog/all-blog

Response: {
  "success": true,
  "blogs": [ ... ]
}
```

#### Get Single Blog

```http
GET /blog/get-blog/:id

Response: {
  "success": true,
  "blog": { ... }
}
```

#### Create Blog

```http
POST /blog/create-blog
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My First Blog",
  "description": "Blog content here",
  "image": "image_url"
}

Response: {
  "success": true,
  "message": "Blog created successfully",
  "blog": { ... }
}
```

#### Update Blog

```http
PUT /blog/update-blog/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated content"
}
```

#### Delete Blog

```http
DELETE /blog/delete-blog/:id
Authorization: Bearer {token}

Response: {
  "success": true,
  "message": "Blog deleted successfully"
}
```

#### Like Blog

```http
POST /blog/like-blog
Authorization: Bearer {token}
Content-Type: application/json

{
  "blogId": "blog_id_here"
}
```

#### Add Comment

```http
POST /blog/add-comment
Authorization: Bearer {token}
Content-Type: application/json

{
  "blogId": "blog_id_here",
  "comment": "Great blog post!"
}
```

#### Get User Blogs

```http
GET /blog/user-blog/:userId

Response: {
  "success": true,
  "userBlog": {
    "blogs": [ ... ]
  }
}
```

For complete API documentation, check the route files in `backend/routes/`

---

## 🔐 Security Features

- **Password Security**: bcrypt with 10 salt rounds
- **Token Authentication**: JWT with 7-day expiration
- **CORS Protection**: Restricted to allowed origins
- **Input Validation**: Server-side validation on all endpoints
- **Environment Variables**: Sensitive data in .env files
- **Protected Routes**: Private routes require authentication

---

## 🌐 Deployment

### Deployed On Vercel

**Frontend**: https://mern-blog-platform-beta.vercel.app  
**Backend**: https://blog-backend-teal-tau.vercel.app

### Environment Variables Required

**Backend (Vercel Settings)**

```
MONGO_URI = your_mongodb_atlas_uri
JWT_SECRET = your_secure_secret_key
JWT_EXPIRES_IN = 7d
DEV_MODE = production
FRONTEND_URL = https://mern-blog-platform-beta.vercel.app
```

**Frontend (Vercel Settings)**

```
REACT_APP_API_URL = https://blog-backend-teal-tau.vercel.app
```

### Deploy Your Own

1. **Fork this repository**
2. **Connect to Vercel** (https://vercel.com)
3. **Deploy frontend and backend**
4. **Set environment variables in Vercel Dashboard**
5. **Redeploy** to apply environment variables

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🧪 Testing

### Test Features Locally

```bash
# Register a new user
# Create a blog post
# Like and comment on blogs
# Update your profile
# Switch between light/dark themes
# Test responsive design (mobile, tablet, desktop)
```

### Test Backend API

```bash
# Get all blogs
curl https://blog-backend-teal-tau.vercel.app/api/v1/blog/all-blog

# Login and get token
curl -X POST https://blog-backend-teal-tau.vercel.app/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📊 Performance Metrics

- **Frontend Bundle Size**: ~200KB (gzipped)
- **First Contentful Paint**: < 2s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 85+
- **API Response Time**: < 500ms (average)

---

## 🎯 Future Enhancements

- [ ] Social authentication (Google, GitHub)
- [ ] Blog recommendations based on reading history
- [ ] User follow system with notifications
- [ ] Advanced search with filters
- [ ] Blog series and collections
- [ ] Rich text editor (Quill/TipTap)
- [ ] Analytics dashboard for authors
- [ ] Email notifications
- [ ] PWA support
- [ ] API rate limiting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Siddhesh Katkade**

- GitHub: [@Sidd-17052004](https://github.com/Sidd-17052004)
- LinkedIn: [Siddhesh Katkade](https://www.linkedin.com/in/siddhesh-katkade-tech-coder-ai/)
- Email: [Contact](mailto:siddhesh.katkade@example.com)

---

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) - For beautiful UI components
- [MongoDB](https://www.mongodb.com/) - For the database
- [Vercel](https://vercel.com/) - For seamless deployment
- [React](https://reactjs.org/) - For the amazing framework
- All contributors and users who provided feedback

---

## 📞 Support

If you have any questions or need help, please:

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment help
2. Open an issue on GitHub
3. Check existing issues for solutions
4. Reach out on LinkedIn

---

<div align="center">

**Made with ❤️ by Siddhesh Katkade**

⭐ If you like this project, please give it a star!

</div>
