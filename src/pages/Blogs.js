import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import BlogCard from "../components/BlogCard";
import { 
  Container, 
  Typography, 
  Box, 
  TextField,
  InputAdornment,
  Skeleton,
  Card,
  Pagination,
  Grid
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "../context/ThemeContext";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);
  const { isDarkMode } = useTheme();
  
  //get blogs
  const getAllBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/blog/all-blog");
      if (data?.success) {
        setBlogs(data?.blogs);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getAllBlogs();
  }, []);

  // Sort by views (descending) then filter by search query
  const filteredBlogs = [...blogs]
    .sort((a, b) => (b?.views || 0) - (a?.views || 0))
    .filter((blog) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      blog?.title?.toLowerCase().includes(searchLower) ||
      blog?.description?.toLowerCase().includes(searchLower) ||
      blog?.user?.username?.toLowerCase().includes(searchLower)
    );
  });


  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const gridJustify = currentBlogs.length <= 2 ? "center" : "flex-start";
  
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
          Explore Blogs
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary", maxWidth: 640, mx: "auto" }}>
          Discover stories, ideas, and insights from creators around the world.
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box display="flex" justifyContent="center" mb={4}>
        <TextField
          placeholder="Search blogs by title, content, or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            width: { xs: '95%', sm: '80%', md: '60%', lg: '40%' },
            backgroundColor: isDarkMode ? '#2a2a2a' : 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? '#fff' : '#000',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box>
          {[1, 2, 3].map((item) => (
            <Card
              key={item}
              sx={{
                width: { xs: '95%', sm: '80%', md: '60%', lg: '40%' },
                margin: "auto",
                mt: 2,
                mb: 2,
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
          ))}
        </Box>
      ) : filteredBlogs && filteredBlogs.length > 0 ? (
        <>
          {searchQuery && (
            <Typography 
              variant="body1" 
              textAlign="center" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Found {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''}
            </Typography>
          )}
          <Grid container spacing={3} justifyContent={gridJustify}>
            {currentBlogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog?._id}>
                <BlogCard
                  id={blog?._id}
                  isUser={localStorage.getItem("userId") === blog?.user?._id}
                  title={blog?.title}
                  description={blog?.description}
                  image={blog?.image}
                  username={blog?.user?.username || "Anonymous"}
                  time={blog.createdAt}
                  blogData={blog}
                />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4} mb={4}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={(e, page) => {
                  setCurrentPage(page);
                  window.scrollTo(0, 0);
                }}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography variant="h5" color="text.secondary">
            {searchQuery ? `No blogs found matching "${searchQuery}"` : "No blogs available yet"}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Blogs;


