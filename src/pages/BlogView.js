import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Box, 
  Button, 
  Typography,
  Container,
  Avatar,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  IconButton,
  Card,
  TextField,
} from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { formatDate, calculateReadingTime } from "../utils/helpers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ConfirmDialog from "../components/ConfirmDialog";

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const currentUserId = localStorage.getItem("userId");
  const currentUserName = localStorage.getItem("userName");

  const getBlogDetail = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/blog/get-blog/${id}`);
      if (data?.success) {
        setBlog(data?.blog);
        setLikeCount(data?.blog.likes?.length || 0);
        setViewCount(data?.blog.views || 0);
        setComments(data?.blog.comments || []);
        
        // Check if current user has liked this blog
        // Convert ObjectIds to strings for comparison
        if (currentUserId && data?.blog.likes) {
          const likesArray = data?.blog.likes.map(like => 
            typeof like === 'object' ? like.toString() : like
          );
          setIsLiked(likesArray.includes(currentUserId));
        }

        // Increment view count (debounced to avoid double count on initial render)
        if (currentUserId) {
          try {
            const key = `viewed_blog_${id}`;
            const lastViewed = Number(sessionStorage.getItem(key) || 0);
            if (Date.now() - lastViewed > 2000) {
              sessionStorage.setItem(key, Date.now().toString());
              await axios.post("/api/v1/blog/increment-views", { blogId: id });
            }
          } catch (viewError) {
            console.log("View tracking error:", viewError);
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load blog");
      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  }, [id, navigate, currentUserId]);

  useEffect(() => {
    getBlogDetail();
  }, [getBlogDetail]);

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/v1/blog/delete-blog/${id}`);
      if (data?.success) {
        toast.success("Blog deleted successfully!");
        navigate("/my-blogs");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete blog");
    }
  };

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("Please log in to like blogs");
      return;
    }

    try {
      const { data } = await axios.post("/api/v1/blog/like-blog", {
        blogId: id,
        userId: currentUserId,
      });

      if (data?.success) {
        setIsLiked(!isLiked);
        setLikeCount(!isLiked ? likeCount + 1 : likeCount - 1);
        toast.success(isLiked ? "Removed like" : "Blog liked!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to like blog");
    }
  };

  const handleViewProfile = () => {
    const profileId = blog?.user?._id || blog?.user;
    if (!profileId) return;
    navigate(`/user-profile/${profileId}`);
  };

  const handleAddComment = async () => {
    if (!currentUserId) {
      toast.error("Please log in to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setCommentLoading(true);
      const { data } = await axios.post("/api/v1/blog/add-comment", {
        blogId: id,
        userId: currentUserId,
        text: commentText,
      });

      if (data?.success) {
        setComments(data.blog.comments || []);
        setCommentText("");
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!blog) {
    return null;
  }

  const isOwner = blog.user?._id === currentUserId;
  const readingTime = calculateReadingTime(blog.description);

  // Format description with markdown-like rendering
  const renderContent = (text) => {
    return text.split('\n').map((paragraph, idx) => {
      // Handle headings
      if (paragraph.startsWith('# ')) {
        return (
          <Typography key={idx} variant="h4" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
            {paragraph.substring(2)}
          </Typography>
        );
      }
      if (paragraph.startsWith('## ')) {
        return (
          <Typography key={idx} variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
            {paragraph.substring(3)}
          </Typography>
        );
      }
      // Handle code blocks
      if (paragraph.startsWith('```')) {
        return (
          <Box
            key={idx}
            component="pre"
            sx={{
              backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
              p: 2,
              borderRadius: 2,
              overflow: "auto",
              my: 2,
              fontFamily: "monospace",
              fontSize: "0.9rem",
            }}
          >
            {paragraph.replace(/```/g, '')}
          </Box>
        );
      }
      // Handle quotes
      if (paragraph.startsWith('> ')) {
        return (
          <Box
            key={idx}
            sx={{
              borderLeft: "4px solid #667eea",
              pl: 2,
              py: 1,
              my: 2,
              fontStyle: "italic",
              color: isDarkMode ? "#cbd5e1" : "#64748b",
            }}
          >
            {paragraph.substring(2)}
          </Box>
        );
      }
      // Handle bullet points
      if (paragraph.startsWith('- ')) {
        return (
          <Box key={idx} component="li" sx={{ ml: 3, my: 0.5 }}>
            {paragraph.substring(2)}
          </Box>
        );
      }
      // Regular paragraphs
      if (paragraph.trim()) {
        // Handle inline formatting
        let content = paragraph;
        // Bold: **text**
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic: *text*
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Inline code: `code`
        content = content.replace(/`(.*?)`/g, '<code style="background-color: ' + (isDarkMode ? '#1e293b' : '#f1f5f9') + '; padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>');
        
        return (
          <Typography
            key={idx}
            variant="body1"
            sx={{
              lineHeight: 1.8,
              fontSize: "1.1rem",
              my: 2,
              color: isDarkMode ? "#e2e8f0" : "#1e293b",
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }
      return null;
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F7F9FC",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              textTransform: "none",
              color: isDarkMode ? "#cbd5e1" : "#64748b",
            }}
          >
            Back
          </Button>

          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: isDarkMode ? "#111827" : "#fff",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            {/* Featured Image */}
            <Box
              component="img"
              src={blog.image}
              alt={blog.title}
              sx={{
                width: "100%",
                maxHeight: 500,
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            <Box sx={{ p: { xs: 3, md: 5 } }}>
              {/* Title */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  mb: 3,
                  lineHeight: 1.2,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  color: isDarkMode ? "#f1f5f9" : "#0f172a",
                }}
              >
                {blog.title}
              </Typography>

              {/* Meta Info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
                  onClick={handleViewProfile}
                >
                  <Avatar sx={{ bgcolor: "#4F46E5" }}>
                    {blog.user?.username?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: isDarkMode ? "#f1f5f9" : "#0f172a",
                        "&:hover": { color: "#4F46E5" },
                      }}
                    >
                      {blog.user?.username || "Anonymous"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}>
                      {formatDate(blog.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${calculateReadingTime(blog.description)} min read`}
                  size="small"
                  sx={{ bgcolor: isDarkMode ? "#1f2937" : "#f1f5f9" }}
                />
                <Chip
                  icon={<RemoveRedEyeIcon />}
                  label={`${viewCount} views`}
                  size="small"
                  sx={{ bgcolor: isDarkMode ? "#1f2937" : "#f1f5f9" }}
                />
                <Chip
                  icon={<FavoriteBorderIcon />}
                  label={`${likeCount} likes`}
                  size="small"
                  sx={{ bgcolor: isDarkMode ? "#1f2937" : "#f1f5f9" }}
                />
              </Box>

              {/* Actions */}
              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <IconButton
                  onClick={handleLike}
                  sx={{
                    color: isLiked ? "#ef4444" : isDarkMode ? "#cbd5e1" : "#64748b",
                    backgroundColor: isLiked ? "rgba(239, 68, 68, 0.1)" : "transparent",
                  }}
                  title="Like this blog"
                >
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                {isOwner && (
                  <>
                    <IconButton
                      onClick={() => navigate(`/blog-details/${id}`)}
                      sx={{ color: "#667eea" }}
                      title="Edit blog"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setOpenDeleteDialog(true)}
                      sx={{ color: "#ef4444" }}
                      title="Delete blog"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Stack>

              <Divider sx={{ mb: 4 }} />

              {/* Content */}
              <Box sx={{ mb: 4 }}>
                {renderContent(blog.description)}
              </Box>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <Box sx={{ mt: 4, mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {blog.tags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        sx={{
                          bgcolor: "#667eea",
                          color: "white",
                          mb: 1,
                          "&:hover": { bgcolor: "#5568d3" },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </Card>

          {/* Comments Section */}
          <Card
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              backgroundColor: isDarkMode ? "#111827" : "#fff",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <ChatBubbleOutlineIcon sx={{ color: "#667eea", fontSize: "1.8rem" }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Comments ({comments.length})
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Add Comment Form */}
            {currentUserId ? (
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Share your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={commentLoading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: isDarkMode ? "#e2e8f0" : "#1e293b",
                        borderRadius: 2,
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleAddComment}
                    disabled={commentLoading || !commentText.trim()}
                    sx={{
                      color: "white",
                      backgroundColor: "#667eea",
                      alignSelf: "flex-end",
                      mb: 0.5,
                      "&:hover": { backgroundColor: "#5568d3" },
                      "&:disabled": { backgroundColor: "#ccc" },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ p: 2, mb: 3, bgcolor: isDarkMode ? "#1f2937" : "#f3f4f6", borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <Button 
                    onClick={() => navigate("/auth")}
                    sx={{ textTransform: "none", p: 0 }}
                  >
                    Sign in
                  </Button>
                  {" "}to comment on this blog
                </Typography>
              </Box>
            )}

            {/* Comments List */}
            {comments.length > 0 ? (
              <Stack spacing={2}>
                {comments.map((comment, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                      borderLeft: "4px solid #667eea",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Avatar sx={{ bgcolor: "#667eea", width: 32, height: 32, fontSize: "0.8rem" }}>
                        {comment.user?.username?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {comment.user?.username || "Anonymous"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}>
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: isDarkMode ? "#cbd5e1" : "#4b5563" }}>
                      {comment.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <ChatBubbleOutlineIcon sx={{ fontSize: "3rem", color: isDarkMode ? "#374151" : "#d1d5db", mb: 1 }} />
                <Typography variant="body2" sx={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}>
                  No comments yet. Be the first to comment!
                </Typography>
              </Box>
            )}
          </Card>
        </motion.div>
      </Container>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Blog"
        message={`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`}
      />

    </Box>
  );
};

export default BlogView;
