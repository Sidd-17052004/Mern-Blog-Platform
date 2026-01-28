                                                           ## 📝 BlogHub - A Modern MERN Blogging Platform

<div align="center">

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://mern-blog-platform-beta.vercel.app)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

**A full-stack blogging platform built with modern web technologies, featuring real-time interactions, secure authentication, and a responsive UI.**

[🚀 Live Demo](https://mern-blog-platform-beta.vercel.app) • [📚 API](https://blog-backend-teal-tau.vercel.app) • [🐛 Report Bug](https://github.com/Sidd-17052004/Mern-Blog-Platform/issues)

</div>

---

## ✨ Key Features

🔐 **Authentication** - Secure JWT-based login/registration with bcrypt password hashing  
📚 **Blog Management** - Create, edit, delete blogs with image uploads  
💬 **Interactions** - Like, comment on blogs with real-time view counters  
👤 **User Profiles** - Customizable profiles with dashboard and statistics  
🎨 **Modern UI** - Material-UI with dark/light theme, smooth animations  
📱 **Responsive** - Works perfectly on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

**Frontend:** React 18.2 • Material-UI • Redux Toolkit • Framer Motion • Axios  
**Backend:** Node.js • Express.js • MongoDB • Mongoose • JWT • bcrypt  
**Deployment:** Vercel • MongoDB Atlas

---

## 🚀 Quick Start

### Prerequisites

- Node.js v14+ and npm
- MongoDB Atlas account

### Installation

```bash
# Clone repository
git clone https://github.com/Sidd-17052004/Mern-Blog-Platform.git
cd mern-stack-blog-app

# Setup Backend
cd backend
npm install
cat > .env << EOF
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
EOF
npm run server  # Runs on http://localhost:8080

# Setup Frontend (in new terminal)
cd ../client
npm install
echo "REACT_APP_API_URL=http://localhost:8080" > .env
npm start  # Runs on http://localhost:3000

# Or run both together from root
npm run dev
```

---

## 📁 Project Structure

```
mern-stack-blog-app/
├── backend/
│   ├── api/index.js              # Vercel serverless entry
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Business logic
│   ├── middleware/               # JWT authentication
│   ├── models/                   # Blog & User schemas
│   ├── routes/                   # API endpoints
│   └── server.js                 # Express app
│
├── client/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components
│   │   ├── context/              # Theme context
│   │   ├── redux/                # State management
│   │   └── utils/                # Axios & helpers
│   └── package.json
│
└── README.md
```

---

## 📚 API Endpoints

**Base URL:** `https://blog-backend-teal-tau.vercel.app/api/v1`

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/user/register`        | Create new user             |
| POST   | `/user/login`           | User login                  |
| GET    | `/blog/all-blog`        | Get all blogs               |
| POST   | `/blog/create-blog`     | Create blog (auth required) |
| PUT    | `/blog/update-blog/:id` | Update blog (auth required) |
| DELETE | `/blog/delete-blog/:id` | Delete blog (auth required) |
| POST   | `/blog/like-blog`       | Like blog (auth required)   |
| POST   | `/blog/add-comment`     | Add comment (auth required) |

---

## 🌐 Deployment

**Live URLs:**

- Frontend: https://mern-blog-platform-beta.vercel.app
- Backend: https://blog-backend-teal-tau.vercel.app

### Deploy Your Own

1. Fork the repository
2. Connect to Vercel (https://vercel.com)
3. Deploy frontend and backend separately
4. Add environment variables in Vercel Dashboard:
   - **Backend:** `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`
   - **Frontend:** `REACT_APP_API_URL`
5. Redeploy to apply changes


---

## 🔐 Security Features

✅ Password hashing with bcrypt (10 salt rounds)  
✅ JWT authentication (7-day expiration)  
✅ CORS protection with allowed origins  
✅ Server-side input validation  
✅ Protected routes requiring authentication  
✅ Environment variables for sensitive data

---

## 🎯 Future Enhancements

- [ ] Social authentication (Google, GitHub)
- [ ] Advanced search with filters
- [ ] User follow system
- [ ] Rich text editor integration
- [ ] Email notifications
- [ ] PWA support

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📝 License

ISC License - See [LICENSE](LICENSE) file

---

## 👨‍💻 Author

**Siddhesh Katkade**

🔗 [GitHub](https://github.com/Sidd-17052004) • [LinkedIn](https://www.linkedin.com/in/siddhesh-katkade-tech-coder-ai/)

---

<div align="center">

**Made with ❤️ by Siddhesh Katkade**

⭐ If you find this helpful, please star the repository!

</div>
