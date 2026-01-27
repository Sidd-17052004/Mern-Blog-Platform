import React from "react";
import { Box, Container, Divider, Stack, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box sx={{ mt: 6, pt: 4, pb: 4, backgroundColor: "#FFFFFF" }}>
      <Divider sx={{ mb: 3 }} />
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontWeight: 800, color: "#111827" }}>BlogHub</Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
              A modern platform for writers, readers, and creators.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", sm: "flex-start" }}
            flexWrap="wrap"
          >
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <MuiLink component={Link} to="/blogs" underline="none" sx={{ color: "#475569", fontWeight: 600 }}>
                Blogs
              </MuiLink>
              <MuiLink component={Link} to="/create-blog" underline="none" sx={{ color: "#475569", fontWeight: 600 }}>
                Write
              </MuiLink>
              <MuiLink
                href="mailto:srkatkade@gmail.com"
                underline="none"
                sx={{
                  color: "#4F46E5",
                  fontWeight: 700,
                  position: "relative",
                  "@keyframes contactPulse": {
                    "0%, 100%": { transform: "translateY(0)", opacity: 1 },
                    "50%": { transform: "translateY(-2px)", opacity: 0.85 },
                  },
                  animation: "contactPulse 2s ease-in-out infinite",
                }}
              >
                Contact:
              </MuiLink>
            </Stack>

            <Stack spacing={0.5}>
              <MuiLink href="mailto:srkatkade@gmail.com" underline="none" sx={{ color: "#475569", fontWeight: 600 }}>
                srkatkade@gmail.com
              </MuiLink>
              <MuiLink href="tel:+917972679029" underline="none" sx={{ color: "#475569", fontWeight: 600 }}>
                +91 79726 79029
              </MuiLink>
            </Stack>
          </Stack>
        </Stack>

        <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mt: 3 }}>
          © {new Date().getFullYear()} BlogHub. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
