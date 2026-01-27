import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "../utils/axios";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  //state
  const [inputs, setInputs] = useState({
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

  //form handle
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!inputs.email) {
      newErrors.email = "Email is required";
    }
    if (!inputs.password) {
      newErrors.password = "Password is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/user/login", {
        email: inputs.email,
        password: inputs.password,
      });
      if (data.success) {
        localStorage.setItem("userId", data?.user._id);
        localStorage.setItem("userName", data?.user.username);
        localStorage.setItem("userEmail", data?.user.email);
        dispatch(authActions.login());
        toast.success("Login Successful!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
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
            Login
          </Typography>

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
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            onClick={() => navigate("/register")}
            sx={{ 
              borderRadius: 2, 
              marginTop: 2,
              textTransform: 'none'
            }}
            fullWidth
          >
            Not a user? Please Register
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Login;


