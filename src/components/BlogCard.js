import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Box, IconButton, Chip, Stack, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../utils/axios";
import ConfirmDialog from "./ConfirmDialog";
import { formatDate, calculateReadingTime, truncateText } from "../utils/helpers";
import { useTheme } from "../context/ThemeContext";

export default function BlogCard({
  title,
  description,
  image,
  username,
  time,
  id,
  isUser,
  blogData,
}) {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [viewCount, setViewCount] = React.useState(0);
  const [commentCount, setCommentCount] = React.useState(0);
  const { isDarkMode } = useTheme();
  const currentUserId = localStorage.getItem("userId");
  const readingTime = calculateReadingTime(description);
  const profileId = blogData?.user?._id || blogData?.user || "";
  const avatarSrc = React.useMemo(() => {
    return blogData?.user?.avatarUrl || "";
  }, [blogData]);

  React.useEffect(() => {
    if (blogData) {
      setLikeCount(blogData.likes?.length || 0);
      setViewCount(blogData.views || 0);
      setCommentCount(blogData.comments?.length || 0);
      
      if (currentUserId && blogData.likes) {
        // Check if current user ID is in the likes array
        // Convert ObjectIds to strings for comparison
        const likesArray = blogData.likes.map((like) => {
          if (typeof like === "object" && like !== null) {
            return like._id?.toString() || like.toString();
          }
          return like;
        });
        setIsLiked(likesArray.includes(currentUserId));
      }
    }
  }, [blogData, currentUserId]);

  const handleEdit = () => {
    navigate(`/blog-details/${id}`);
  };

  const handleViewPost = () => {
    navigate(`/blog/${id}`);
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    if (!profileId) return;
    navigate(`/user-profile/${profileId}`);
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/v1/blog/delete-blog/${id}`);
      if (data?.success) {
        toast.success("Blog deleted successfully!");
        setOpenDialog(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete blog");
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    
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
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to like blog");
    }
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          mt: 0,
          mb: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxShadow: isDarkMode 
            ? "0 4px 12px rgba(0,0,0,0.4)" 
            : "0 4px 12px rgba(102, 126, 234, 0.15)",
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 2.5,
          backgroundColor: isDarkMode ? '#1f2937' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
          border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
          "&:hover": {
            boxShadow: isDarkMode 
              ? "0 12px 24px rgba(102, 126, 234, 0.2)" 
              : "0 12px 24px rgba(102, 126, 234, 0.25)",
            transform: 'translateY(-6px)'
          },
        }}
      >
        {/* Header with Author and Actions */}
        <CardHeader
          avatar={
            <Avatar 
              sx={{ 
                bgcolor: "#4F46E5",
                width: 48,
                height: 48,
                fontSize: "1.2rem",
                fontWeight: 700,
                cursor: "pointer",
              }} 
              src={avatarSrc}
              aria-label="author"
              onClick={handleViewProfile}
            >
              {!avatarSrc && username?.charAt(0).toUpperCase()}
            </Avatar>
          }
          action={
            <Box>
              {isUser && (
                <>
                  <IconButton 
                    onClick={handleEdit}
                    size="small"
                    sx={{ 
                      color: "#667eea",
                      "&:hover": { bgcolor: "rgba(102, 126, 234, 0.1)" }
                    }}
                  >
                    <ModeEditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => setOpenDialog(true)}
                    size="small"
                    sx={{ 
                      color: "#ef4444",
                      "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          }
          title={
            <Typography 
              variant="subtitle1" 
              sx={{
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                "&:hover": { color: "#4F46E5" },
              }}
              onClick={handleViewProfile}
            >
              {username}
            </Typography>
          }
          subheader={
            <Typography variant="caption" sx={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}>
              {formatDate(time)}
            </Typography>
          }
        />

        {/* Featured Image */}
        <CardMedia 
          component="img" 
          height="240" 
          image={image} 
          alt={title}
          onClick={handleViewPost}
          sx={{ 
            cursor: "pointer",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: 'transform 0.3s ease',
            "&:hover": { transform: 'scale(1.02)' }
          }}
        />

        {/* Content */}
        <CardContent sx={{ pb: 1.5, flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800,
              fontSize: "1.15rem",
              mb: 1,
              color: isDarkMode ? "#f1f5f9" : "#111827",
              cursor: "pointer",
              transition: "color 0.2s",
              "&:hover": { color: "#667eea" }
            }}
            onClick={handleViewPost}
          >
            {truncateText(title, 60)}
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              color: isDarkMode ? "#cbd5e1" : "#4b5563",
              mb: 2,
              lineHeight: 1.6,
              cursor: "pointer"
            }}
            onClick={handleViewPost}
          >
            {truncateText(description, 120)}
          </Typography>

          {/* Meta Info Chips */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
          >
            <Chip 
              icon={<AccessTimeIcon />}
              label={`${readingTime} min`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
                color: isDarkMode ? "#cbd5e1" : "#4b5563",
                fontSize: "0.75rem",
              }}
            />
          </Stack>
        </CardContent>

        {/* Divider */}
        <Divider sx={{ my: 0, bgcolor: isDarkMode ? "#374151" : "#e5e7eb" }} />

        {/* Engagement Stats and Actions */}
        <Box 
          sx={{ 
            px: 2, 
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Stats */}
          <Stack direction="row" spacing={2} sx={{ display: "flex", alignItems: "center" }}>
            {/* Views */}
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 0.5,
                color: isDarkMode ? "#cbd5e1" : "#4b5563"
              }}
            >
              <RemoveRedEyeIcon 
                sx={{ 
                  fontSize: "1.1rem",
                  color: "#667eea"
                }} 
              />
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                {viewCount}
              </Typography>
            </Box>

            {/* Likes */}
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 0.5,
                color: isDarkMode ? "#cbd5e1" : "#4b5563"
              }}
            >
              <FavoriteBorderIcon 
                sx={{ 
                  fontSize: "1.1rem",
                  color: isLiked ? "#ef4444" : "#94a3b8"
                }} 
              />
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                {likeCount}
              </Typography>
            </Box>

            {/* Comments */}
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 0.5,
                color: isDarkMode ? "#cbd5e1" : "#4b5563"
              }}
            >
              <ChatOutlinedIcon 
                sx={{ 
                  fontSize: "1.1rem",
                  color: "#667eea"
                }} 
              />
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                {commentCount}
              </Typography>
            </Box>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={0.5}>
            {!isUser && (
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(e);
                }}
                size="small"
                sx={{
                  color: isLiked ? "#ef4444" : isDarkMode ? "#94a3b8" : "#9ca3af",
                  backgroundColor: isLiked 
                    ? "rgba(239, 68, 68, 0.08)" 
                    : "transparent",
                  transition: "all 0.2s",
                  "&:hover": { 
                    backgroundColor: isLiked 
                      ? "rgba(239, 68, 68, 0.12)" 
                      : "rgba(102, 126, 234, 0.08)",
                    color: isLiked ? "#ef4444" : "#667eea"
                  }
                }}
                title="Like this blog"
              >
                {isLiked ? 
                  <FavoriteIcon sx={{ fontSize: "1.3rem" }} /> : 
                  <FavoriteBorderIcon sx={{ fontSize: "1.3rem" }} />
                }
              </IconButton>
            )}

            <IconButton 
              onClick={(e) => {
                e.stopPropagation();
                handleViewPost();
              }}
              size="small"
              sx={{
                color: isDarkMode ? "#cbd5e1" : "#4b5563",
                transition: "all 0.2s",
                "&:hover": { 
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                  color: "#667eea"
                }
              }}
              title="View & Comment"
            >
              <ChatOutlinedIcon sx={{ fontSize: "1.3rem" }} />
            </IconButton>
          </Stack>
        </Box>
      </Card>

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleDelete}
        title="Delete Blog"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
      />

    </>
  );
}


