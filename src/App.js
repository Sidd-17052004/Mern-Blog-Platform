import React from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Blogs from "./pages/Blogs";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import UserBlogs from "./pages/UserBlogs";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import BlogView from "./pages/BlogView";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { Box } from "@mui/material";
import { useTheme } from "./context/ThemeContext";
import { useLocation } from "react-router-dom";
import "./styles/auth.css";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

function App() {
  const { isDarkMode } = useTheme();
    const location = useLocation();
    const isAuthPage = ["/login", "/register", "/auth"].includes(location.pathname);
  return (
    <>
      <ScrollToTop />
      {!isAuthPage && <Header />}
      <Toaster 
        position="top-center"
        containerStyle={{ top: 96 }}
        toastOptions={{
          duration: 1500,
          style: {
            background: isDarkMode ? '#2a2a2a' : '#363636',
            color: '#fff',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: isDarkMode ? '#121212' : 'transparent',
        color: isDarkMode ? '#fff' : '#000',
        transition: 'background-color 0.3s ease'
      }}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogView />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-blogs" element={<ProtectedRoute><UserBlogs /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/blog-details/:id" element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} />
          <Route path="/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/my-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
