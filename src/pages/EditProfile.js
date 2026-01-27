import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Avatar,
  Box,
  Typography,
  Card,
  Stack,
  IconButton,
  CircularProgress,
  Grid,
  InputAdornment,
} from "@mui/material";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";

const EditProfile = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    gender: "",
    occupation: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) return;
        const { data } = await axios.get(`/api/v1/user/profile/${userId}`);
        if (data?.success) {
          setProfileData({
            fullName: data.user.fullName || data.user.username || "",
            username: data.user.username || "",
            email: data.user.email || "",
            bio: data.user.bio || "",
            location: data.user.location || "",
            website: data.user.website || "",
            gender: data.user.gender || "",
            occupation: data.user.occupation || "",
            avatarUrl: data.user.avatarUrl || "",
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        avatarUrl: reader.result?.toString() || "",
      }));
      toast.success("Avatar updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      if (!profileData.fullName.trim()) {
        toast.error("Full name is required");
        return;
      }

      if (!userId) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const { data } = await axios.put(`/api/v1/user/profile/${userId}`, {
        fullName: profileData.fullName,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        gender: profileData.gender,
        occupation: profileData.occupation,
        avatarUrl: profileData.avatarUrl,
      });

      if (data?.success) {
        localStorage.setItem("userName", data.user.fullName || data.user.username || "");
        localStorage.setItem("userEmail", data.user.email || "");
        window.dispatchEvent(new Event("profileUpdated"));
        toast.success("Profile updated successfully!");
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitial = () => {
    return profileData.fullName?.charAt(0).toUpperCase() || "U";
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/dashboard")}
        sx={{
          mb: 3,
          color: "#4F46E5",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        Back to Dashboard
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              backgroundColor: isDarkMode ? "#1f2937" : "#fff",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box position="relative">
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  backgroundColor: "#4F46E5",
                  fontSize: "3rem",
                  fontWeight: 700,
                  border: "4px solid #4F46E5",
                }}
                src={profileData.avatarUrl}
              >
                {!profileData.avatarUrl && getInitial()}
              </Avatar>
              <input
                hidden
                accept="image/*"
                type="file"
                id="avatar-input"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-input">
                <IconButton
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#4F46E5",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#4338CA",
                    },
                    width: 40,
                    height: 40,
                  }}
                >
                  <CameraAltIcon />
                </IconButton>
              </label>
            </Box>

            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                color: isDarkMode ? "#e2e8f0" : "#1e293b",
              }}
            >
              {profileData.fullName || "User"}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                textAlign: "center",
                color: isDarkMode ? "#94a3b8" : "#64748b",
              }}
            >
              {profileData.email}
            </Typography>

            <Box
              sx={{
                width: "100%",
                p: 2,
                backgroundColor: isDarkMode ? "#111827" : "#f3f4f6",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: isDarkMode ? "#94a3b8" : "#64748b" }}>
                Profile Status
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#10b981", mt: 0.5 }}
              >
                ✓ Active
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 3,
              backgroundColor: isDarkMode ? "#1f2937" : "#fff",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: isDarkMode ? "#e2e8f0" : "#1e293b",
              }}
            >
              Edit Your Profile
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                fullWidth
                placeholder="Enter your full name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: isDarkMode ? "#e2e8f0" : "#1e293b",
                    "& fieldset": {
                      borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4F46E5",
                    },
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    opacity: 0.6,
                  },
                }}
              />

              <TextField
                label="Username"
                value={profileData.username}
                disabled
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: isDarkMode ? "#94a3b8" : "#64748b",
                  },
                }}
              />

              <TextField
                label="Email"
                value={profileData.email}
                disabled
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: isDarkMode ? "#94a3b8" : "#64748b",
                  },
                }}
              />

              <TextField
                label="Bio"
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Tell us about yourself..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                      <InfoIcon sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: isDarkMode ? "#e2e8f0" : "#1e293b",
                    "& fieldset": {
                      borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4F46E5",
                    },
                  },
                }}
              />

              <TextField
                label="Gender"
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                fullWidth
                placeholder="e.g., Male, Female, Other"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: isDarkMode ? "#e2e8f0" : "#1e293b",
                    "& fieldset": {
                      borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4F46E5",
                    },
                  },
                }}
              />

              <TextField
                label="Occupation"
                name="occupation"
                value={profileData.occupation}
                onChange={handleInputChange}
                fullWidth
                placeholder="e.g., Software Engineer"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: isDarkMode ? "#e2e8f0" : "#1e293b",
                    "& fieldset": {
                      borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4F46E5",
                    },
                  },
                }}
              />

              <TextField
                label="Location"
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                fullWidth
                placeholder="Your city or country"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: isDarkMode ? "#e2e8f0" : "#1e293b",
                    "& fieldset": {
                      borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4F46E5",
                    },
                  },
                }}
              />

              <TextField
                label="Website"
                name="website"
                value={profileData.website}
                onChange={handleInputChange}
                fullWidth
                placeholder="https://yourwebsite.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: isDarkMode ? "#e2e8f0" : "#1e293b",
                    "& fieldset": {
                      borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4F46E5",
                    },
                  },
                }}
              />

              <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#4F46E5",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    py: 1.2,
                    flex: 1,
                    "&:hover": { backgroundColor: "#4338CA" },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    py: 1.2,
                    borderColor: "#4F46E5",
                    color: "#4F46E5",
                    "&:hover": {
                      backgroundColor: "rgba(79, 70, 229, 0.08)",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditProfile;
