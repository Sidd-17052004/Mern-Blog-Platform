import React from "react";
import { motion } from "framer-motion";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  Stack,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import Footer from "../components/Footer";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardHover = {
  rest: { y: 0, boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)" },
  hover: { y: -6, boxShadow: "0 18px 30px rgba(15, 23, 42, 0.12)" },
};

const chipHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
        <motion.div variants={itemVariants}>
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#1F2937",
                letterSpacing: "0.02em",
                mb: 1,
              }}
            >
              🌐 About BlogHub
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              ✨ A modern blogging platform to share ideas, stories, and insights.
            </Typography>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover" initial="rest" animate="rest">
          <Card sx={{ p: 4, borderRadius: 3, mb: 3 }} component={motion.div} variants={cardHover}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                  ✨ What is BlogHub?
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  BlogHub is a focused space for writing, reading, and sharing ideas. It helps creators publish
                  quickly, connect with readers, and build a meaningful presence.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                  🎯 Mission & Vision
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  Our mission is to give everyone a voice and make storytelling simple, accessible, and powerful.
                  We aim to build a community where ideas matter more than algorithms.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                  🧠 Why BlogHub?
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  Writing strengthens self‑expression, learning, and identity. BlogHub removes the noise so you can
                  focus on what matters: your story.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  📚 Writing and blogging are proven tools for learning and communication (HBR).
                </Typography>
              </Box>

              <Stack spacing={1}>
                <Typography variant="h6" fontWeight={800}>
                  🚀 What you can do
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  justifyContent="center"
                  alignItems="center"
                >
                  {[
                    "✍️ Create & publish",
                    "📖 Read diverse stories",
                    "🔐 Secure profiles",
                    "📝 Manage your posts",
                    "🌍 Share globally",
                  ].map((label) => (
                    <motion.div key={label} variants={chipHover} initial="rest" whileHover="hover">
                      <Chip label={label} color="primary" />
                    </motion.div>
                  ))}
                </Stack>
              </Stack>

              <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/create-blog")}
                  sx={{
                    backgroundColor: "#4F46E5",
                    textTransform: "none",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": { backgroundColor: "#4338CA" },
                  }}
                >
                  ❤️ Start Writing
                </Button>
              </Box>
            </Stack>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover" initial="rest" animate="rest">
          <Card sx={{ p: 4, borderRadius: 3 }} component={motion.div} variants={cardHover}>
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={800}>
                🤝 Community First
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                BlogHub is built with respect, originality, and diverse opinions in mind—welcoming beginners and
                experienced writers across tech, lifestyle, education, and storytelling.
              </Typography>
              <Divider />
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '2rem',
                    color: "#4F46E5",
                    fontWeight: 700,
                    "@keyframes connectPulse": {
                      "0%, 100%": { transform: "translateY(0)", opacity: 1 },
                      "50%": { transform: "translateY(-2px)", opacity: 0.85 },
                    },
                    animation: "connectPulse 2s ease-in-out infinite",
                  }}
                >
                  ✨ Connect with me:
                </Typography>
                <IconButton
                  component="a"
                  href="https://www.linkedin.com/in/siddhesh-katkade-tech-coder-ai/"
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: "#0a66c2",
                    "@keyframes iconGlow": {
                      "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 rgba(10,102,194,0)" },
                      "50%": { transform: "scale(1.08)", boxShadow: "0 0 12px rgba(10,102,194,0.35)" },
                    },
                    animation: "iconGlow 2.2s ease-in-out infinite",
                  }}
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://github.com/Sidd-17052004"
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: "#111827",
                    "@keyframes iconGlowDark": {
                      "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 rgba(17,24,39,0)" },
                      "50%": { transform: "scale(1.08)", boxShadow: "0 0 12px rgba(17,24,39,0.25)" },
                    },
                    animation: "iconGlowDark 2.2s ease-in-out infinite",
                    animationDelay: "0.2s",
                  }}
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Card>
        </motion.div>
      </motion.div>
      </Container>
      <Footer />
    </>
  );
};

export default About;
