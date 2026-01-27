import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";

const ShareDialog = ({ open, onClose, blog }) => {
  const blogUrl = `${window.location.origin}/blog-details/${blog?._id}`;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(blogUrl);
    toast.success("Link copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const text = `Check out this blog: ${blog?.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(blogUrl)}`;
    window.open(url, "_blank");
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      blogUrl
    )}`;
    window.open(url, "_blank");
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      blogUrl
    )}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ShareIcon color="primary" />
        Share "{blog?.title}"
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Share this blog with your network
          </Typography>

          {/* Copy Link Section */}
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
              Copy Link
            </Typography>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                size="small"
                value={blogUrl}
                readOnly
                variant="outlined"
              />
              <Button
                variant="contained"
                onClick={handleCopyLink}
                startIcon={<ContentCopyIcon />}
                sx={{ whiteSpace: "nowrap" }}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </Box>
          </Box>

          {/* Social Media Section */}
          <Typography variant="subtitle2" fontWeight="bold" mb={2}>
            Share on Social Media
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<TwitterIcon />}
              onClick={handleTwitterShare}
              sx={{ color: "#1DA1F2", borderColor: "#1DA1F2" }}
            >
              Twitter
            </Button>
            <Button
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={handleFacebookShare}
              sx={{ color: "#1877F2", borderColor: "#1877F2" }}
            >
              Facebook
            </Button>
            <Button
              variant="outlined"
              startIcon={<LinkedInIcon />}
              onClick={handleLinkedInShare}
              sx={{ color: "#0A66C2", borderColor: "#0A66C2" }}
            >
              LinkedIn
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
