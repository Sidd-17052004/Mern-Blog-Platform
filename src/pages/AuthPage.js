import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  InputAdornment,
  Divider,
  CircularProgress,
  Tab,
  Tabs,
  MenuItem,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "../utils/axios";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import TypingText from "../components/TypingText";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const slideInVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const features = [
  {
    icon: "✍️",
    title: "Rich Text Editor",
    description: "Write beautiful stories with our powerful and intuitive editor",
  },
  {
    icon: "🚀",
    title: "Instant Publishing",
    description: "Publish your thoughts instantly and share with the world",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description: "Your content is protected with enterprise-grade security",
  },
];

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    gender: "",
    occupation: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Sync tab state with route: /login -> login tab, /register -> signup tab
  React.useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("register")) {
      setIsLogin(false);
    } else if (path.includes("login")) {
      setIsLogin(true);
    }
  }, [location.pathname]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginForm.email) newErrors.email = "Email is required";
    if (!loginForm.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/user/login", {
        email: loginForm.email,
        password: loginForm.password,
      });

      if (data.success) {
        localStorage.setItem("userId", data?.user._id);
        localStorage.setItem("userName", data?.user.fullName || data?.user.username);
        localStorage.setItem("userEmail", data?.user.email);
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }
        dispatch(authActions.login());
        toast.success("Welcome back! 🎉");
        navigate("/blogs");
      } else {
        const message = data?.message || "User not found";
        if (message.toLowerCase().includes("not register")) {
          toast.error("Account not found. Please create an account.");
          setIsLogin(false);
          navigate("/register");
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!signupForm.name) newErrors.name = "Name is required";
    if (!signupForm.email) newErrors.email = "Email is required";
    if (!signupForm.password) newErrors.password = "Password must be at least 6 characters";
    if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/user/register", {
        username: signupForm.name,
        email: signupForm.email,
        gender: signupForm.gender,
        occupation: signupForm.occupation,
        password: signupForm.password,
      });

      if (data.success) {
        // Store user info for immediate use
        if (data?.user) {
          localStorage.setItem("userId", data.user._id);
          localStorage.setItem("userName", data.user.fullName || data.user.username);
          localStorage.setItem("userEmail", data.user.email);
        }
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }
        dispatch(authActions.login());
        toast.success("Welcome 🎉");
        setSignupForm({ name: "", email: "", gender: "", occupation: "", password: "", confirmPassword: "" });
        setErrors({});
        navigate("/blogs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F7F9FC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, md: 4 },
            alignItems: "center",
          }}
        >
          {/* Left Side - Hero & Features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Box sx={{ color: "#0F172A" }}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: "0.06em",
                    mb: 1.5,
                    fontSize: { xs: "3rem", sm: "3.5rem", md: "4rem" },
                    lineHeight: 1.05,
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 0.6,
                      borderRadius: 3,
                      backgroundColor: "#EEF2FF",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <TypingText
                      as="span"
                      text="BlogHub"
                      typingSpeed={95}
                      deletingSpeed={55}
                      pauseDuration={1800}
                      loop={true}
                      showCursor={true}
                      cursorClassName=""
                      textColors={["#1F2937", "#4F46E5", "#64748B"]}
                      className=""
                    />
                  </Box>
                </Typography>
              </motion.div>
              {/* Main Headline */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    lineHeight: 1.2,
                    mb: 2,
                  }}
                >
                  Write.{" "}
                  <Box
                    component="span"
                    sx={{
                      color: "#4F46E5",
                      fontWeight: 800,
                    }}
                  >
                    Share.
                  </Box>{" "}
                  Inspire.
                </Typography>
              </motion.div>

              {/* Subheadline */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#475569",
                    mb: 4,
                    fontWeight: 300,
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                  }}
                >
                  Join thousands of writers sharing their stories on our platform. 
                  Express yourself, connect with readers, and build your audience.
                </Typography>
              </motion.div>

              {/* Features */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Typography sx={{ fontSize: "2rem", mt: 0.5 }}>
                        {feature.icon}
                      </Typography>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            mb: 0.5,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography sx={{ color: "#64748B", fontSize: "0.95rem" }}>
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              
            </Box>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
          >
            <Card
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
              }}
            >
              {/* Tabs */}
              <Tabs
                value={isLogin ? 0 : 1}
                onChange={(e, val) => {
                  setIsLogin(val === 0);
                  setErrors({});
                }}
                sx={{
                  mb: 3,
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#4F46E5",
                  },
                }}
              >
                <Tab
                  label="Login"
                  sx={{
                    flex: 1,
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    color: isLogin ? "#4F46E5" : "#94A3B8",
                  }}
                />
                <Tab
                  label="Sign Up"
                  sx={{
                    flex: 1,
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    color: !isLogin ? "#4F46E5" : "#94A3B8",
                  }}
                />
              </Tabs>

              <Divider sx={{ mb: 3 }} />

              {/* Login Form */}
              {isLogin ? (
                <motion.form
                  onSubmit={handleLogin}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <TextField
                        fullWidth
                        placeholder="Email Address"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, email: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: "#667eea" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#F8FAFC",
                            transition: "all 0.3s",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "#fff",
                              boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.15)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <TextField
                        fullWidth
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, password: e.target.value })
                        }
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: "#4F46E5" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                onClick={() => setShowPassword(!showPassword)}
                                sx={{ minWidth: 0, p: 0.5 }}
                              >
                                {showPassword ? (
                                  <VisibilityOffIcon sx={{ color: "#999", fontSize: "1.2rem" }} />
                                ) : (
                                  <VisibilityIcon sx={{ color: "#999", fontSize: "1.2rem" }} />
                                )}
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#F8FAFC",
                            transition: "all 0.3s",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "#fff",
                              boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.15)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        fullWidth
                        type="submit"
                        disabled={loading}
                        sx={{
                          backgroundColor: "#4F46E5",
                          color: "white",
                          py: 1.5,
                          fontSize: "1rem",
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: "none",
                          boxShadow: "0 6px 16px rgba(79, 70, 229, 0.25)",
                          transition: "all 0.3s",
                          "&:hover": {
                            backgroundColor: "#4338CA",
                            boxShadow: "0 8px 18px rgba(79, 70, 229, 0.35)",
                          },
                          "&:disabled": {
                            opacity: 0.7,
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </motion.div>
                  </Box>
                </motion.form>
              ) : (
                /* Signup Form */
                <motion.form
                  onSubmit={handleSignup}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <TextField
                        fullWidth
                        placeholder="Full Name"
                        type="text"
                        value={signupForm.name}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, name: e.target.value })
                        }
                        error={!!errors.name}
                        helperText={errors.name}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: "#667eea" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#F8FAFC",
                            transition: "all 0.3s",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "#fff",
                              boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.15)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <TextField
                        fullWidth
                        placeholder="Email Address"
                        type="email"
                        value={signupForm.email}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, email: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: "#667eea" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#F8FAFC",
                            transition: "all 0.3s",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "#fff",
                              boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.15)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <TextField
                        fullWidth
                        label="Gender"
                        select
                        value={signupForm.gender}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, gender: e.target.value })
                        }
                        SelectProps={{ displayEmpty: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: "#667eea" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#F8FAFC",
                            transition: "all 0.3s",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "#fff",
                              boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.15)",
                            },
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select Gender
                        </MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </TextField>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <TextField
                        fullWidth
                        placeholder="Occupation"
                        type="text"
                        value={signupForm.occupation}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, occupation: e.target.value })
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: "#667eea" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#F8FAFC",
                            transition: "all 0.3s",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "#fff",
                              boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.15)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <TextField
                        fullWidth
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={signupForm.password}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, password: e.target.value })
                        }
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: "#4F46E5" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                onClick={() => setShowPassword(!showPassword)}
                                sx={{ minWidth: 0, p: 0.5 }}
                              >
                                {showPassword ? (
                                  <VisibilityOffIcon sx={{ color: "#999", fontSize: "1.2rem" }} />
                                ) : (
                                  <VisibilityIcon sx={{ color: "#999", fontSize: "1.2rem" }} />
                                )}
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#F8FAFC",
                            transition: "all 0.3s",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "#fff",
                              boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.15)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <TextField
                        fullWidth
                        placeholder="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        value={signupForm.confirmPassword}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, confirmPassword: e.target.value })
                        }
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: "#4F46E5" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                onClick={() => setShowPassword(!showPassword)}
                                sx={{ minWidth: 0, p: 0.5 }}
                              >
                                {showPassword ? (
                                  <VisibilityOffIcon sx={{ color: "#999", fontSize: "1.2rem" }} />
                                ) : (
                                  <VisibilityIcon sx={{ color: "#999", fontSize: "1.2rem" }} />
                                )}
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#F8FAFC",
                            transition: "all 0.3s",
                            "&:hover": {
                              backgroundColor: "#F1F5F9",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "#fff",
                              boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.15)",
                            },
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        fullWidth
                        type="submit"
                        disabled={loading}
                        sx={{
                          backgroundColor: "#4F46E5",
                          color: "white",
                          py: 1.5,
                          fontSize: "1rem",
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: "none",
                          boxShadow: "0 6px 16px rgba(79, 70, 229, 0.25)",
                          transition: "all 0.3s",
                          "&:hover": {
                            backgroundColor: "#4338CA",
                            boxShadow: "0 8px 18px rgba(79, 70, 229, 0.35)",
                          },
                          "&:disabled": {
                            opacity: 0.7,
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </motion.div>
                  </Box>
                </motion.form>
              )}

              {/* Footer Text */}
              <motion.div variants={itemVariants}>
                <Typography
                  sx={{
                    textAlign: "center",
                    mt: 3,
                    fontSize: "0.9rem",
                    color: "#64748B",
                  }}
                >
                  {isLogin ? (
                    <>
                      Don't have an account?{" "}
                      <Button
                        onClick={() => setIsLogin(false)}
                        sx={{
                          color: "#4F46E5",
                          textTransform: "none",
                          p: 0,
                          fontWeight: 600,
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Sign up here
                      </Button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Button
                        onClick={() => setIsLogin(true)}
                        sx={{
                          color: "#4F46E5",
                          textTransform: "none",
                          p: 0,
                          fontWeight: 600,
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Sign in here
                      </Button>
                    </>
                  )}
                </Typography>
              </motion.div>
            </Card>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;


