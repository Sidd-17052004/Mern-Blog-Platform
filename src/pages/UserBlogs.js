import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import { Container, Typography, Box, Button, Skeleton, Card, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useTheme } from "../context/ThemeContext";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  //get user blogs
  const getUserBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = localStorage.getItem("userId");
      
      if (!id) {
        toast.error("Please log in to view your blogs");
        navigate("/auth");
        return;
      }

      const { data } = await axios.get(`/api/v1/blog/user-blog/${id}`);
      if (data?.success) {
        setBlogs(data?.userBlog?.blogs || []);
      } else {
        setError("Failed to load blogs");
      }
    } catch (error) {
      console.log("Error fetching user blogs:", error);
      setError(error.response?.data?.message || "Failed to load your blogs");
      toast.error("Failed to load your blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserBlogs();
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: "#1F2937",
            letterSpacing: "0.02em",
            mb: 1,
          }}
        >
          My Blogs
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary", maxWidth: 640, mx: "auto" }}>
          Manage your posts and keep your latest work organized.
        </Typography>
      </Box>
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card
                sx={{
                  padding: 2,
                  backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box ml={2} flex={1}>
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="20%" />
                  </Box>
                </Box>
                <Skeleton variant="rectangular" height={194} sx={{ borderRadius: 1 }} />
                <Box mt={2}>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : blogs && blogs.length > 0 ? (
        <Grid container spacing={3} justifyContent={blogs.length <= 2 ? "center" : "flex-start"}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <BlogCard
                id={blog._id}
                isUser={true}
                title={blog.title}
                description={blog.description}
                image={blog.image}
                username={blog.user?.username || "Anonymous"}
                time={blog.createdAt}
                blogData={blog}
              />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="50vh"
          gap={2}
        >
          <Typography variant="h5" color="error" textAlign="center">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={getUserBlogs}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="50vh"
          gap={3}
        >
          <Typography variant="h4" color="text.secondary" textAlign="center">
            You Haven't Created a Blog Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Start sharing your thoughts with the world!
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate('/create-blog')}
            sx={{ mt: 2, borderRadius: 2, py: 1.5, px: 4 }}
          >
            Create Your First Blog
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default UserBlogs;
