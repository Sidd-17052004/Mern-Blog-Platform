import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  InputAdornment,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * PasswordStrengthIndicator Component
 * Displays visual feedback on password strength
 * Strength levels: Weak, Fair, Good, Strong
 */
export const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 20;
    if (pass.length >= 12) strength += 20;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 20;
    if (/[0-9]/.test(pass)) strength += 20;
    if (/[!@#$%^&*]/.test(pass)) strength += 20;
    return strength;
  };

  const strength = calculateStrength(password);
  const getLabel = () => {
    if (strength <= 20) return "Weak";
    if (strength <= 40) return "Fair";
    if (strength <= 60) return "Good";
    if (strength <= 80) return "Strong";
    return "Very Strong";
  };

  const getColor = () => {
    if (strength <= 20) return "#f44336";
    if (strength <= 40) return "#ff9800";
    if (strength <= 60) return "#ffc107";
    if (strength <= 80) return "#8bc34a";
    return "#4caf50";
  };

  return password ? (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
          Password Strength
        </Typography>
        <Typography sx={{ fontSize: "0.8rem", color: getColor(), fontWeight: 600 }}>
          {getLabel()}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={strength}
        sx={{
          height: 4,
          borderRadius: 2,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: getColor(),
          },
        }}
      />
    </Box>
  ) : null;
};

/**
 * SocialAuthButton Component
 * Reusable button for OAuth integrations
 */
export const SocialAuthButton = ({ icon, label, onClick }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Button
      fullWidth
      onClick={onClick}
      sx={{
        py: 1.2,
        border: "1.5px solid #e0e0e0",
        color: "#333",
        fontWeight: 500,
        textTransform: "none",
        borderRadius: 2,
        backgroundColor: "#fff",
        transition: "all 0.3s",
        "&:hover": {
          backgroundColor: "#f8f9fa",
          borderColor: "#667eea",
          color: "#667eea",
        },
      }}
    >
      <Box sx={{ mr: 1, fontSize: "1.2rem" }}>{icon}</Box>
      {label}
    </Button>
  </motion.div>
);

/**
 * TermsCheckbox Component
 * Checkbox with formatted terms text
 */
export const TermsCheckbox = ({ checked, onChange }) => (
  <FormControlLabel
    control={<Checkbox checked={checked} onChange={onChange} />}
    label={
      <Typography sx={{ fontSize: "0.85rem" }}>
        I agree to the{" "}
        <MuiLink
          href="/terms"
          sx={{
            color: "#667eea",
            textDecoration: "none",
            fontWeight: 600,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Terms of Service
        </MuiLink>{" "}
        and{" "}
        <MuiLink
          href="/privacy"
          sx={{
            color: "#667eea",
            textDecoration: "none",
            fontWeight: 600,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Privacy Policy
        </MuiLink>
      </Typography>
    }
  />
);

/**
 * ForgotPasswordForm Component
 * Simple email-based password recovery
 */
export const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call here
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onBack();
    }, 3000);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <Typography sx={{ mb: 3, fontWeight: 600, fontSize: "1.1rem" }}>
        Reset Your Password
      </Typography>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CheckCircleIcon
              sx={{ fontSize: 60, color: "#4caf50", mb: 2 }}
            />
            <Typography sx={{ color: "#4caf50", fontWeight: 600 }}>
              Check your email for recovery link
            </Typography>
          </Box>
        </motion.div>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <TextField
              fullWidth
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                  backgroundColor: "#f8f9fa",
                  "&.Mui-focused": {
                    backgroundColor: "#fff",
                    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                  },
                },
              }}
            />
          </motion.div>

          <Box sx={{ display: "flex", gap: 2 }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
              <Button
                fullWidth
                type="submit"
                sx={{
                  backgroundColor: "#4F46E5",
                  color: "white",
                  py: 1.2,
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#4338CA" },
                }}
              >
                Send Reset Link
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
              <Button
                fullWidth
                onClick={onBack}
                sx={{
                  border: "1.5px solid #e0e0e0",
                  color: "#666",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                Back
              </Button>
            </motion.div>
          </Box>
        </Box>
      )}
    </motion.form>
  );
};

export default {
  PasswordStrengthIndicator,
  SocialAuthButton,
  TermsCheckbox,
  ForgotPasswordForm,
};
