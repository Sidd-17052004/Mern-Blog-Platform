import React, { useEffect, useMemo, useState } from "react";
import axios from "../utils/axios";
import { useTheme } from "../context/ThemeContext";
import {
  Container,
  Box,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  CircularProgress,
  Grid,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import BlogIcon from "@mui/icons-material/Article";
import { useNavigate, useParams } from "react-router-dom";

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const { userId: routeUserId } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const profileId = useMemo(
    () => userId || routeUserId || currentUserId,
    [userId, routeUserId, currentUserId]
  );
  const isOwner = currentUserId && profileId === currentUserId;

  const totalViews = useMemo(
    () => blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
    [blogs]
  );
  const totalLikes = useMemo(
    () => blogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0),
    [blogs]
  );
  const totalComments = useMemo(
    () => blogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0),
    [blogs]
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (!profileId) return;
        const { data } = await axios.get(`/api/v1/blog/user-blog/${profileId}`);
        if (data?.success) {
          setUser(data?.userBlog || null);
          setBlogs(data?.userBlog?.blogs || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [profileId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="text.secondary" textAlign="center">
          User not found
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#F7F9FC", py: 4 }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            mb: 4,
            bgcolor: isDarkMode ? "#1e1e1e" : "#fff",
            color: isDarkMode ? "#fff" : "#111827",
            borderRadius: 3,
            boxShadow: isDarkMode
              ? "0 10px 24px rgba(0,0,0,0.25)"
              : "0 10px 24px rgba(15, 23, 42, 0.08)",
            overflow: "hidden",
          }}
        >
          <CardHeader
            sx={{
              backgroundColor: isDarkMode ? "#111827" : "#EEF2FF",
              borderBottom: isDarkMode ? "1px solid #0f172a" : "1px solid #E2E8F0",
              alignItems: "center",
              "& .MuiCardHeader-action": {
                alignSelf: { xs: "flex-start", md: "center" },
              },
            }}
            avatar={
              <Avatar
                sx={{
                  width: { xs: 90, sm: 110, md: 120 },
                  height: { xs: 90, sm: 110, md: 120 },
                  bgcolor: "#4F46E5",
                  fontSize: { xs: "2.2rem", sm: "2.6rem", md: "3rem" },
                  fontWeight: "bold",
                  border: isDarkMode ? "3px solid #1f2937" : "3px solid #E2E8F0",
                }}
                src={user?.avatarUrl || ""}
              >
                {!user?.avatarUrl && (user?.fullName || user?.username || "U").charAt(0).toUpperCase()}
              </Avatar>
            }
            title={
              <Stack spacing={0.8}>
                <Typography variant="h4" fontWeight="bold">
                  {user?.fullName || user?.username}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {user?.username && <Chip label={`@${user.username}`} size="small" color="primary" />}
                  {user?.occupation && <Chip label={user.occupation} size="small" variant="outlined" />}
                </Stack>
              </Stack>
            }
            subheader={
              <Typography variant="body2" sx={{ color: isDarkMode ? "#cbd5e1" : "#64748B" }}>
                {user?.email}
              </Typography>
            }
            action={
              isOwner ? (
                <Button
                  variant="outlined"
                  onClick={() => navigate("/edit-profile")}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    borderColor: "#C7D2FE",
                    color: "#4F46E5",
                    "&:hover": { backgroundColor: "rgba(79, 70, 229, 0.08)" },
                  }}
                >
                  Edit Profile
                </Button>
              ) : null
            }
          />
          <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {[
                { label: "Blogs", value: blogs.length },
                { label: "Views", value: totalViews },
                { label: "Likes", value: totalLikes },
                { label: "Comments", value: totalComments },
              ].map((stat) => (
                <Grid item xs={6} sm={3} key={stat.label}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "#111827" : "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 6px 14px rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    <Typography variant="h6" fontWeight={800} color="#4F46E5">
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 2.5, borderRadius: 2, backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                    About
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                    {user?.bio || "This user hasn’t added a bio yet."}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2.5, borderRadius: 2, backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                    Details
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Gender: <strong>{user?.gender || "—"}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: <strong>{user?.location || "—"}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Website: <strong>{user?.website || "—"}</strong>
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Typography variant="h5" fontWeight="bold" mb={3}>
          Recent Blogs
        </Typography>
        {blogs.length > 0 ? (
          blogs.slice(0, 5).map((blog) => (
            <Card
              key={blog._id}
              sx={{
                mb: 2,
                p: 2,
                bgcolor: isDarkMode ? "#1e1e1e" : "#fff",
                color: isDarkMode ? "#fff" : "#000",
                transition: "all 0.3s ease",
                borderRadius: 2,
                border: "1px solid #E2E8F0",
                ":hover": {
                  boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                },
              }}
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {blog.description.substring(0, 100)}...
                  </Typography>
                </Box>
                <BlogIcon color="primary" />
              </Box>
            </Card>
          ))
        ) : (
          <Typography color="text.secondary" textAlign="center">
            No blogs yet
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default UserProfile;


