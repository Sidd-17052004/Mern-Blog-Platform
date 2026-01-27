import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  //state
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  //handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!inputs.name.trim()) {
      newErrors.name = "Name is required";
    } else if (inputs.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!inputs.password) {
      newErrors.password = "Password is required";
    } else if (inputs.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //form handle
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/user/register", {
        username: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      if (data.success) {
        // Store user info in localStorage
        localStorage.setItem("userId", data?.user?._id);
        localStorage.setItem("userName", data?.user?.username);
        localStorage.setItem("userEmail", data?.user?.email);
        // Auto-login user
        dispatch(authActions.login());
        toast.success("Welcome! Your account has been created! 🎉");
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box
          maxWidth={450}
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
          marginTop={{ xs: 3, sm: 5 }}
          marginBottom={3}
          boxShadow="0 8px 16px rgba(0,0,0,0.1)"
          padding={3}
          borderRadius={3}
          sx={{ backgroundColor: isDarkMode ? '#1e1e1e' : 'white', color: isDarkMode ? '#fff' : '#000' }}
        >
          <Typography
            variant="h4"
            sx={{ 
              textTransform: "uppercase",
              fontWeight: 'bold',
              color: '#1976d2'
            }}
            padding={3}
            textAlign="center"
          >
            Register
          </Typography>
          <TextField
            placeholder="Name"
            label="Name"
            value={inputs.name}
            onChange={handleChange}
            name="name"
            margin="normal"
            type={"text"}
            required
            fullWidth
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            placeholder="Email"
            label="Email"
            value={inputs.email}
            name="email"
            margin="normal"
            type={"email"}
            required
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            placeholder="Password"
            label="Password"
            value={inputs.password}
            name="password"
            margin="normal"
            type={"password"}
            required
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            type="submit"
            sx={{ 
              borderRadius: 2, 
              marginTop: 3,
              py: 1.5,
              fontWeight: 'bold'
            }}
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          <Button
            onClick={() => navigate("/login")}
            sx={{ 
              borderRadius: 2, 
              marginTop: 2,
              textTransform: 'none'
            }}
            fullWidth
          >
            Already Registered? Please Login
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Register;
