import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  Skeleton,
  Avatar,
  TextField,
  Chip,
  Stack,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import DraftsIcon from "@mui/icons-material/Drafts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SaveIcon from "@mui/icons-material/Save";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import UpdateIcon from "@mui/icons-material/Update";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDesc, setDraftDesc] = useState("");
  const [userName, setUserName] = useState("Creator");
  const [userEmail, setUserEmail] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [stats, setStats] = useState({ totalViews: 0, totalLikes: 0, totalComments: 0 });

  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const userId = useMemo(() => localStorage.getItem("userId") || "guest", []);
  const DRAFTS_KEY = useMemo(() => `dashboard:drafts:${userId}`, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const id = localStorage.getItem("userId");
        const storedUserName = localStorage.getItem("userName") || "";
        const storedUserEmail = localStorage.getItem("userEmail") || "";
        setUserName(storedUserName || "Creator");
        setUserEmail(storedUserEmail || "");
        
        const { data } = await axios.get(`/api/v1/blog/user-blog/${id}`);
        if (data?.success) {
          setBlogs(data?.userBlog.blogs || []);
        }

        // Fetch engagement stats
        try {
          const statsResponse = await axios.get(`/api/v1/blog/stats/${id}`);
          if (statsResponse.data?.success) {
            setStats(statsResponse.data.stats);
          }
        } catch (statsError) {
          console.log("Stats fetch error:", statsError);
          // Fallback: calculate from blogs if API fails
          const totalViews = (data?.userBlog.blogs || []).reduce((sum, blog) => sum + (blog.views || 0), 0);
          const totalLikes = (data?.userBlog.blogs || []).reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
          const totalComments = (data?.userBlog.blogs || []).reduce((sum, blog) => sum + (blog.comments?.length || 0), 0);
          setStats({ totalViews, totalLikes, totalComments });
        }

        // Load drafts
        const rawDrafts = localStorage.getItem(DRAFTS_KEY);
        setDrafts(rawDrafts ? JSON.parse(rawDrafts) : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveDraft = () => {
    if (!draftTitle.trim() || !draftDesc.trim()) return;
    const newDraft = {
      id: `${Date.now()}`,
      title: draftTitle.trim(),
      description: draftDesc.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
    setDraftTitle("");
    setDraftDesc("");
  };

  const deleteDraft = (id) => {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
  };

  const resumeDraft = (draft) => {
    setDraftTitle(draft.title);
    setDraftDesc(draft.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // Calculate stats
  const totalPosts = blogs.length;
  const lastUpdated = blogs.length > 0 && blogs[0]?.createdAt 
    ? new Date(blogs[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : "Never";
  const recentBlogs = blogs.slice(0, 5);

  // Profile completion
  const profileCompletion = 65;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F7F9FC",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Welcome Banner */}
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                mb: 4,
                backgroundColor: isDarkMode ? "#1f2937" : "#EEF2FF",
                color: isDarkMode ? "#e2e8f0" : "#1f2937",
                boxShadow: isDarkMode
                  ? "0 12px 28px rgba(0,0,0,0.35)"
                  : "0 12px 28px rgba(15, 23, 42, 0.08)",
                border: isDarkMode
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid #E2E8F0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                    Welcome back, {userName}! 👋
                  </Typography>
                  <Typography sx={{ opacity: 0.95, fontSize: "1.1rem" }}>
                    Your creative hub awaits. Write, publish, and inspire today.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </motion.div>

          {/* Overview Cards */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {[
              { icon: <ArticleIcon />, label: "Total Posts", value: totalPosts, color: "#667eea" },
              { icon: <DraftsIcon />, label: "Drafts", value: drafts.length, color: "#764ba2" },
              {
                icon: <UpdateIcon />,
                label: "Last Updated",
                value: lastUpdated,
                color: "#4facfe",
              },
            ].map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                      boxShadow: isDarkMode
                        ? "0 4px 20px rgba(0,0,0,0.3)"
                        : "0 4px 20px rgba(102,126,234,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: isDarkMode
                          ? "0 8px 30px rgba(102,126,234,0.2)"
                          : "0 8px 30px rgba(102,126,234,0.25)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: stat.color, width: 50, height: 50 }}>{stat.icon}</Avatar>
                        <Box>
                          <Typography sx={{ color: isDarkMode ? "#cbd5e1" : "#64748b", fontSize: "0.875rem", fontWeight: 500 }}>
                            {stat.label}
                          </Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: isDarkMode ? "#f1f5f9" : "#1e293b" }}>
                            {stat.value}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Main Content: Quick Draft */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Quick Draft */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, backgroundColor: isDarkMode ? "#111827" : "#fff", boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Avatar sx={{ bgcolor: "#667eea", width: 45, height: 45 }}>
                        <SaveIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
                        Quick Draft
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Draft Title"
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          placeholder="What's on your mind?"
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          minRows={4}
                          label="Your Ideas"
                          value={draftDesc}
                          onChange={(e) => setDraftDesc(e.target.value)}
                          placeholder="Jot down your thoughts, outline, or key points..."
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                          <Button
                            onClick={saveDraft}
                            variant="contained"
                            startIcon={<SaveIcon />}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              py: 1.2,
                              backgroundColor: "#4F46E5",
                              fontSize: "1rem",
                              fontWeight: 600,
                              "&:hover": { backgroundColor: "#4338CA" },
                            }}
                          >
                            Save Draft
                          </Button>
                          <Button
                            onClick={() => {
                              setDraftTitle("");
                              setDraftDesc("");
                            }}
                            variant="outlined"
                            sx={{ textTransform: "none", borderRadius: 2, py: 1.2 }}
                          >
                            Clear
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Drafts Saved */}
          <motion.div variants={itemVariants}>
            <Card sx={{ borderRadius: 3, backgroundColor: isDarkMode ? "#111827" : "#fff", boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)", mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Saved Drafts
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {drafts.length ? (
                  <Stack spacing={2}>
                    {drafts.map((d) => (
                      <Box key={d.id} sx={{ display: "flex", gap: 2, p: 2, borderRadius: 2, backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb" }}>
                        <Avatar sx={{ bgcolor: "#667eea" }}>{d.title?.[0]?.toUpperCase() || "D"}</Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600 }}>{d.title}</Typography>
                          <Typography sx={{ color: isDarkMode ? "#94a3b8" : "#64748b", fontSize: "0.875rem" }}>
                            {d.description?.slice(0, 120) || "No description"}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <IconButton onClick={() => resumeDraft(d)} size="small" title="Resume">
                            <PlayArrowIcon />
                          </IconButton>
                          <IconButton onClick={() => deleteDraft(d.id)} size="small" title="Delete">
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ color: isDarkMode ? "#94a3b8" : "#64748b", textAlign: "center", py: 3 }}>
                    No drafts yet. Use Quick Draft above to save your ideas!
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Engagement Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { icon: <VisibilityIcon />, label: "Views", value: stats.totalViews, color: "#4facfe" },
              { icon: <ThumbUpIcon />, label: "Likes", value: stats.totalLikes, color: "#fa5252" },
              { icon: <ChatBubbleIcon />, label: "Comments", value: stats.totalComments, color: "#ffd43b" },
            ].map((metric, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                      boxShadow: isDarkMode
                        ? "0 4px 20px rgba(0,0,0,0.3)"
                        : "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box>
                          <Typography sx={{ color: isDarkMode ? "#cbd5e1" : "#64748b", mb: 1 }}>
                            {metric.label}
                          </Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: "1.75rem", color: metric.color }}>
                            {metric.value}
                          </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: metric.color, width: 50, height: 50 }}>
                          {metric.icon}
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>


          {/* Recent Posts */}
          <motion.div variants={itemVariants}>
            <Card sx={{ borderRadius: 3, backgroundColor: isDarkMode ? "#111827" : "#fff", boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Recent Posts
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {loading ? (
                  <Stack spacing={2}>
                    {[1, 2, 3].map((i) => (
                      <Box key={i} sx={{ display: "flex", gap: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="40%" />
                          <Skeleton variant="text" width="60%" />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : recentBlogs.length ? (
                  <Stack spacing={2}>
                    {recentBlogs.map((b) => (
                      <Box key={b._id} sx={{ display: "flex", gap: 2, p: 2, borderRadius: 2, backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb" }}>
                        <Avatar sx={{ bgcolor: "#667eea" }}>{b.title?.[0]?.toUpperCase() || "B"}</Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600 }}>{b.title}</Typography>
                          <Typography sx={{ color: isDarkMode ? "#94a3b8" : "#64748b", fontSize: "0.875rem" }}>
                            {b.description?.slice(0, 100) || "No description"}
                          </Typography>
                        </Box>
                        <Button onClick={() => navigate(`/blog-details/${b._id}`)} sx={{ textTransform: "none" }}>
                          Edit
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ color: isDarkMode ? "#94a3b8" : "#64748b", textAlign: "center", py: 3 }}>
                    No posts yet. Create your first masterpiece!
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                borderRadius: 3,
                p: 4,
                mt: 4,
                backgroundColor: "#111827",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Ready to share your next story?
              </Typography>
              <Button
                onClick={() => navigate("/create-blog")}
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#4F46E5",
                  color: "white",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.15)",
                  "&:hover": { backgroundColor: "#4338CA" },
                }}
                startIcon={<AddIcon />}
              >
                Create New Post
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
      <Footer />
    </Box>
  );
};

export default Dashboard;

