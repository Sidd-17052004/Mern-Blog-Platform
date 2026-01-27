import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBlog } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  let isLogin = useSelector((state) => state.isLogin);
  isLogin = isLogin || localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [value, setValue] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [profileData, setProfileData] = useState({});
  const userId = localStorage.getItem("userId");
  const userName = profileData?.fullName || profileData?.username || "User";
  const userEmail = profileData?.email || "";
  const avatarUrl = profileData?.avatarUrl || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) return;
        const { data } = await axios.get(`/api/v1/user/profile/${userId}`);
        if (data?.success) {
          setProfileData(data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();

    const handleProfileUpdated = () => fetchProfile();
    window.addEventListener("profileUpdated", handleProfileUpdated);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdated);
  }, [userId]);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/blogs") || path.startsWith("/blog/")) {
      setValue(0);
    } else if (path.startsWith("/create-blog")) {
      setValue(1);
    } else if (path.startsWith("/my-blogs")) {
      setValue(2);
    } else if (path.startsWith("/dashboard")) {
      setValue(3);
    } else if (path.startsWith("/about")) {
      setValue(4);
    } else {
      setValue(false);
    }
  }, [location.pathname]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    try {
      dispatch(authActions.logout());
      toast.success("Logout Successfully");
      navigate("/login");
      localStorage.clear();
      delete axios.defaults.headers.common.Authorization;
      handleMenuClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <Toolbar sx={{ py: 1.5, display: "flex" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 140 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                color: "#4F46E5",
                backgroundColor: "#EEF2FF",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
              }}
            >
              <FontAwesomeIcon icon={faBlog} style={{ fontSize: 16 }} />
            </Box>
            <Typography
              variant="h4"
              onClick={() => navigate(isLogin ? "/blogs" : "/")}
              sx={{
                fontWeight: 900,
                color: "#1F2937",
                cursor: "pointer",
                display: { xs: "none", sm: "block" },
                fontSize: { xs: "1.5rem", md: "1.75rem" },
              }}
            >
              BlogHub
            </Typography>
            <Typography
              variant="h5"
              onClick={() => navigate(isLogin ? "/blogs" : "/")}
              sx={{
                fontWeight: 900,
                color: "#1F2937",
                cursor: "pointer",
                display: { xs: "block", sm: "none" },
              }}
            >
              Blog
            </Typography>
          </Box>

          {isLogin && (
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Tabs
                textColor="inherit"
                value={value}
                onChange={(e, val) => setValue(val)}
                sx={{
                  "& .MuiTab-root": {
                    color: "#475569",
                    fontWeight: 500,
                    minWidth: { xs: 70, sm: 110 },
                    fontSize: { xs: "0.7rem", sm: "0.85rem" },
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#1F2937",
                    },
                  },
                  "& .Mui-selected": {
                    color: "#1F2937 !important",
                    fontWeight: 700,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#4F46E5",
                    height: 3,
                    borderRadius: "4px 4px 0 0",
                  },
                }}
              >
                <Tab label="Blogs" LinkComponent={Link} to="/blogs" />
                <Tab label="Create Blog" LinkComponent={Link} to="/create-blog" />
                <Tab label="My Blogs" LinkComponent={Link} to="/my-blogs" />
                <Tab label="Dashboard" LinkComponent={Link} to="/dashboard" />
                <Tab label="About" LinkComponent={Link} to="/about" />
              </Tabs>
            </Box>
          )}

          <Box display={"flex"} marginLeft="auto" gap={1} alignItems="center">
            {!isLogin ? (
              <>
                <Button
                  sx={{
                    color: "#1F2937",
                    textTransform: "none",
                    fontSize: { xs: "0.8rem", sm: "0.95rem" },
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(79, 70, 229, 0.08)",
                    },
                  }}
                  LinkComponent={Link}
                  to="/auth"
                >
                  Sign In
                </Button>
                <Button
                  sx={{
                    color: "#4F46E5",
                    border: "1px solid #C7D2FE",
                    textTransform: "none",
                    fontSize: { xs: "0.8rem", sm: "0.95rem" },
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(79, 70, 229, 0.08)",
                      borderColor: "#A5B4FC",
                    },
                  }}
                  LinkComponent={Link}
                  to="/auth"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    p: 0,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  title="Profile Menu"
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#4F46E5",
                      fontSize: "1rem",
                      fontWeight: 700,
                      border: "2px solid #E2E8F0",
                      cursor: "pointer",
                    }}
                    src={avatarUrl}
                  >
                    {!avatarUrl && userName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: isDarkMode ? "#1f2937" : "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                      backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                      color: isDarkMode ? "#e2e8f0" : "#1e293b",
                    },
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: "#4F46E5",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                      }}
                      src={avatarUrl}
                    >
                      {!avatarUrl && userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {userName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isDarkMode ? "#94a3b8" : "#64748b",
                        }}
                      >
                        {userEmail}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider
                    sx={{
                      my: 1,
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  />

                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      handleMenuClose();
                    }}
                    sx={{
                      py: 1.2,
                      px: 2,
                      color: isDarkMode ? "#e2e8f0" : "#1e293b",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? "rgba(102, 126, 234, 0.1)"
                          : "rgba(102, 126, 234, 0.05)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#667eea" }}>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      navigate("/my-blogs");
                      handleMenuClose();
                    }}
                    sx={{
                      py: 1.2,
                      px: 2,
                      color: isDarkMode ? "#e2e8f0" : "#1e293b",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? "rgba(102, 126, 234, 0.1)"
                          : "rgba(102, 126, 234, 0.05)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#667eea" }}>
                      <ArticleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>My Blogs</ListItemText>
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      navigate("/my-profile");
                      handleMenuClose();
                    }}
                    sx={{
                      py: 1.2,
                      px: 2,
                      color: isDarkMode ? "#e2e8f0" : "#1e293b",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? "rgba(102, 126, 234, 0.1)"
                          : "rgba(102, 126, 234, 0.05)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#4F46E5" }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Profile</ListItemText>
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      navigate("/edit-profile");
                      handleMenuClose();
                    }}
                    sx={{
                      py: 1.2,
                      px: 2,
                      color: isDarkMode ? "#e2e8f0" : "#1e293b",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? "rgba(102, 126, 234, 0.1)"
                          : "rgba(102, 126, 234, 0.05)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#667eea" }}>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit Profile</ListItemText>
                  </MenuItem>

                  <Divider
                    sx={{
                      my: 1,
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  />

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.2,
                      px: 2,
                      color: "#ef4444",
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#ef4444" }}>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
