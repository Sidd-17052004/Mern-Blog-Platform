import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Box, 
  Button, 
  TextField, 
  Typography,
  Card,
  Container,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  LinearProgress,
  IconButton,
  Divider,
  Avatar,
  Autocomplete,
} from "@mui/material";
import toast from "react-hot-toast";
import { isValidImageUrl } from "../utils/helpers";
import { useTheme } from "../context/ThemeContext";
import PublishIcon from "@mui/icons-material/Publish";
import SaveIcon from "@mui/icons-material/Save";
import ImageIcon from "@mui/icons-material/Image";
import LabelIcon from "@mui/icons-material/Label";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CodeIcon from "@mui/icons-material/Code";
import LinkIcon from "@mui/icons-material/Link";

const POPULAR_TAGS = [
  "JavaScript", "React", "Node.js", "Python", "Web Development",
  "AI/ML", "DevOps", "UI/UX", "Tutorial", "Career",
  "MongoDB", "TypeScript", "CSS", "Docker", "AWS"
];

const CreateBlog = () => {
  const id = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    image: "",
    excerpt: "",
  });
  const [tags, setTags] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from title
  const slug = useMemo(() => {
    return inputs.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, [inputs.title]);

  // Calculate reading time
  const readingTime = useMemo(() => {
    const words = inputs.description.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  }, [inputs.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

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

  // Text formatting helpers
  const insertFormatting = (before, after = "") => {
    const textarea = document.getElementById("description");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputs.description.substring(start, end) || "text";
    const newDescription =
      inputs.description.substring(0, start) +
      before +
      selectedText +
      after +
      inputs.description.substring(end);
    setInputs({ ...inputs, description: newDescription });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!inputs.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!inputs.description.trim()) {
      newErrors.description = "Content is required";
    } else if (inputs.description.length < 50) {
      newErrors.description = "Content must be at least 50 characters";
    }

    if (inputs.excerpt && inputs.excerpt.length > 160) {
      newErrors.excerpt = "Excerpt must be less than 160 characters";
    }

    if (!inputs.image?.trim()) {
      newErrors.image = "Image URL is required";
    } else if (!isValidImageUrl(inputs.image) && !inputs.image.startsWith("data:image/")) {
      newErrors.image = "Please enter a valid image URL or upload an image";
    }

    if (tags.length === 0) {
      newErrors.tags = "Add at least one tag";
    } else if (tags.length > 5) {
      newErrors.tags = "Maximum 5 tags allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publishNow = false) => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/v1/blog/create-blog", {
        title: inputs.title,
        description: inputs.description,
        image: inputs.image,
        user: id,
        tags: tags,
        excerpt: inputs.excerpt || inputs.description.slice(0, 160),
        slug: slug,
        isPublished: publishNow,
      });
      if (data?.success) {
        toast.success(publishNow ? "Blog Published Successfully!" : "Draft Saved Successfully!");
        navigate("/my-blogs");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const descriptionLength = inputs.description.length;
  const excerptLength = inputs.excerpt.length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F7F9FC",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#1F2937",
                mb: 1,
              }}
            >
              Create Your Story
            </Typography>
            <Typography sx={{ color: isDarkMode ? "#cbd5e1" : "#64748b", fontSize: "1.1rem" }}>
              Share your knowledge with the world
            </Typography>
          </Box>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(isPublished); }}>
            {/* Title */}
            <Card
              sx={{
                borderRadius: 3,
                p: 4,
                mb: 3,
                backgroundColor: isDarkMode ? "#111827" : "#fff",
                boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <TextField
                fullWidth
                variant="standard"
                placeholder="Enter the title..."
                name="title"
                value={inputs.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                InputProps={{
                  sx: {
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    fontWeight: 700,
                    "&:before": { display: "none" },
                    "&:after": { display: "none" },
                  },
                }}
              />
            </Card>

            {/* Featured Image */}
            <Card
              sx={{
                borderRadius: 3,
                p: 3,
                mb: 3,
                backgroundColor: isDarkMode ? "#111827" : "#fff",
                boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: "#4F46E5" }}>
                  <ImageIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Featured Image
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="Paste image URL (16:9 ratio recommended)"
                name="image"
                value={inputs.image}
                onChange={handleChange}
                error={!!errors.image}
                helperText={errors.image}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: "#4F46E5",
                    color: "#4F46E5",
                    "&:hover": { backgroundColor: "rgba(79, 70, 229, 0.08)" },
                  }}
                >
                  Upload Image
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageFileChange}
                  />
                </Button>
                <Typography variant="caption" sx={{ color: isDarkMode ? "#cbd5e1" : "#64748b" }}>
                  Or upload from your device
                </Typography>
              </Box>
              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    width: "100%",
                    maxHeight: 400,
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 2,
                  }}
                />
              )}
            </Card>

            {/* Content Editor */}
            <Card
              sx={{
                borderRadius: 3,
                p: 3,
                mb: 3,
                backgroundColor: isDarkMode ? "#111827" : "#fff",
                boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              {/* Heading */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Content / Description
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {/* Toolbar */}
              <Box
                sx={{
                  position: "sticky",
                  top: 80,
                  zIndex: 10,
                  backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: isDarkMode ? "#cbd5e1" : "#64748b", mr: 1 }}>
                  Format:
                </Typography>
                <IconButton size="small" onClick={() => insertFormatting("**", "**")} title="Bold">
                  <FormatBoldIcon />
                </IconButton>
                <IconButton size="small" onClick={() => insertFormatting("*", "*")} title="Italic">
                  <FormatItalicIcon />
                </IconButton>
                <IconButton size="small" onClick={() => insertFormatting("\n- ")} title="Bullet List">
                  <FormatListBulletedIcon />
                </IconButton>
                <IconButton size="small" onClick={() => insertFormatting("\n> ")} title="Quote">
                  <FormatQuoteIcon />
                </IconButton>
                <IconButton size="small" onClick={() => insertFormatting("```\n", "\n```")} title="Code Block">
                  <CodeIcon />
                </IconButton>
                <IconButton size="small" onClick={() => insertFormatting("[", "](url)")} title="Link">
                  <LinkIcon />
                </IconButton>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Typography variant="caption" sx={{ display: "flex", alignItems: "center", color: isDarkMode ? "#cbd5e1" : "#64748b" }}>
                  📖 {readingTime} min read
                </Typography>
              </Box>

              <TextField
                id="description"
                fullWidth
                multiline
                minRows={15}
                placeholder="Write your story... Use Markdown for formatting.

Tips:
- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- > Quotes for important points
- ```code``` for code blocks"
                name="description"
                value={inputs.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description || `${descriptionLength} characters`}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                  },
                }}
              />
            </Card>

            {/* Excerpt */}
            <Card
              sx={{
                borderRadius: 3,
                p: 3,
                mb: 3,
                backgroundColor: isDarkMode ? "#111827" : "#fff",
                boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Short Summary (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="A brief summary for preview cards..."
                name="excerpt"
                value={inputs.excerpt}
                onChange={handleChange}
                error={!!errors.excerpt}
                helperText={errors.excerpt || `${excerptLength}/160 characters`}
              />
            </Card>

            {/* Tags */}
            <Card
              sx={{
                borderRadius: 3,
                p: 3,
                mb: 3,
                backgroundColor: isDarkMode ? "#111827" : "#fff",
                boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: "#4F46E5" }}>
                  <LabelIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Tags (3-5 recommended)
                </Typography>
              </Box>
              <Autocomplete
                multiple
                freeSolo
                options={POPULAR_TAGS}
                value={tags}
                onChange={(event, newValue) => {
                  if (newValue.length <= 5) {
                    setTags(newValue);
                    setErrors((prev) => ({ ...prev, tags: "" }));
                  }
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      sx={{ bgcolor: "#4F46E5", color: "white" }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Add tags..."
                    error={!!errors.tags}
                    helperText={errors.tags}
                  />
                )}
              />
            </Card>

            {/* Publish Actions */}
            <Card
              sx={{
                borderRadius: 3,
                p: 3,
                backgroundColor: isDarkMode ? "#111827" : "#fff",
                boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                    />
                  }
                  label={isPublished ? "Publish Now" : "Save as Draft"}
                />
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    startIcon={<SaveIcon />}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      px: 3,
                    }}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    startIcon={<PublishIcon />}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      px: 3,
                      backgroundColor: "#4F46E5",
                      "&:hover": { backgroundColor: "#4338CA" },
                    }}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Now"}
                  </Button>
                </Stack>
              </Box>
              {isSubmitting && <LinearProgress sx={{ mt: 2 }} />}
            </Card>
          </form>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CreateBlog;

