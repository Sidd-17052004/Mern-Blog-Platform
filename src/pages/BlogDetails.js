import React, { useState, useEffect, useCallback } from "react";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Box, 
  Button, 
  InputLabel, 
  TextField, 
  Typography,
  Card,
  CardMedia,
  CircularProgress
} from "@mui/material";
import { isValidImageUrl } from "../utils/helpers";
import { useTheme } from "../context/ThemeContext";

const BlogDetails = () => {
  // const [blog, setBlog] = useState({});
  const id = useParams().id;
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  // get blog details
  const getBlogDetail = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/blog/get-blog/${id}`);
      if (data?.success) {
        setInputs({
          title: data?.blog.title,
          description: data?.blog.description,
          image: data?.blog.image,
        });
        setImagePreview(data?.blog.image);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load blog details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getBlogDetail();
  }, [getBlogDetail]);

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Preview image
    if (name === "image" && value) {
      if (isValidImageUrl(value) || value.startsWith("data:image/")) {
        setImagePreview(value);
        setErrors((prev) => ({ ...prev, image: "" }));
      } else {
        setImagePreview("");
        if (value.length > 10) {
          setErrors((prev) => ({ ...prev, image: "Please enter a valid image URL" }));
        }
      }
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result?.toString() || "";
      setInputs((prev) => ({ ...prev, image: dataUrl }));
      setImagePreview(dataUrl);
      setErrors((prev) => ({ ...prev, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!inputs.title?.trim()) {
      newErrors.title = "Title is required";
    } else if (inputs.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (inputs.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!inputs.description?.trim()) {
      newErrors.description = "Description is required";
    } else if (inputs.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    } else if (inputs.description.length > 5000) {
      newErrors.description = "Description must be less than 5000 characters";
    }

    if (!inputs.image?.trim()) {
      newErrors.image = "Image URL is required";
    } else if (!isValidImageUrl(inputs.image) && !inputs.image.startsWith("data:image/")) {
      newErrors.image = "Please enter a valid image URL or upload an image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const { data } = await axios.put(`/api/v1/blog/update-blog/${id}`, {
        title: inputs.title,
        description: inputs.description,
        image: inputs.image,
        user: userId,
      });
      if (data?.success) {
        toast.success("Blog Updated Successfully!");
        navigate("/my-blogs");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update blog");
    }
  };

  const descriptionLength = inputs.description?.length || 0;
  const maxDescriptionLength = 5000;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box
          width={{ xs: '95%', sm: '80%', md: '60%', lg: '50%' }}
          borderRadius={3}
          padding={4}
          margin="auto"
          boxShadow="0 8px 16px rgba(0,0,0,0.1)"
          display="flex"
          flexDirection={"column"}
          marginTop="30px"
          marginBottom="30px"
          sx={{ backgroundColor: isDarkMode ? '#1e1e1e' : 'white', color: isDarkMode ? '#fff' : '#000' }}
        >
          <Typography
            variant="h3"
            textAlign={"center"}
            fontWeight="bold"
            padding={3}
            color="primary"
          >
            Update Post
          </Typography>

          <InputLabel
            sx={{ mb: 1, mt: 2, fontSize: "18px", fontWeight: "bold", color: 'text.primary' }}
          >
            Title
          </InputLabel>
          <TextField
            name="title"
            value={inputs.title || ""}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            fullWidth
            placeholder="Enter your blog title"
            error={!!errors.title}
            helperText={errors.title || `${inputs.title?.length || 0}/100 characters`}
          />

          <InputLabel
            sx={{ mb: 1, mt: 2, fontSize: "18px", fontWeight: "bold", color: 'text.primary' }}
          >
            Description
          </InputLabel>
          <TextField
            name="description"
            value={inputs.description || ""}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            fullWidth
            multiline
            rows={6}
            placeholder="Write your blog content here..."
            error={!!errors.description}
            helperText={
              errors.description || 
              `${descriptionLength}/${maxDescriptionLength} characters`
            }
          />

          <InputLabel
            sx={{ mb: 1, mt: 2, fontSize: "18px", fontWeight: "bold", color: 'text.primary' }}
          >
            Image URL
          </InputLabel>
          <TextField
            name="image"
            value={inputs.image || ""}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            fullWidth
            placeholder="https://example.com/image.jpg"
            error={!!errors.image}
            helperText={errors.image || "Enter a valid image URL (jpg, jpeg, png, gif, webp) or upload"}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              component="label"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#667eea",
                color: "#667eea",
                "&:hover": { backgroundColor: "rgba(102, 126, 234, 0.05)" },
              }}
            >
              Upload Image
              <input hidden accept="image/*" type="file" onChange={handleImageFileChange} />
            </Button>
            <Typography variant="caption" color="text.secondary">
              Or upload from your device
            </Typography>
          </Box>

          {/* Image Preview */}
          {imagePreview && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Image Preview:
              </Typography>
              <Card sx={{ maxWidth: 400, margin: 'auto' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview}
                  alt="Preview"
                  sx={{ objectFit: "cover", objectPosition: "center" }}
                  onError={() => {
                    setImagePreview("");
                    setErrors((prev) => ({ ...prev, image: "Failed to load image" }));
                  }}
                />
              </Card>
            </Box>
          )}

          <Button 
            type="submit" 
            color="warning" 
            variant="contained"
            sx={{ 
              mt: 3, 
              py: 1.5, 
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2
            }}
          >
            Update Post
          </Button>
        </Box>
      </form>
    </>
  );
};

export default BlogDetails;


