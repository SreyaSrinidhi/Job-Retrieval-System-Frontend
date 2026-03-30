import {
  Typography,
  Box,
} from "@mui/material";

function Header() {
  return (
    <Box
        sx={{
            px: { xs: 3, sm: 4 },
            py: { xs: 3, sm: 3.5 },
            background:
            "linear-gradient(135deg, rgba(25,118,210,0.12), rgba(156,39,176,0.10))",
            borderBottom: "1px solid",
            borderColor: "divider",
        }}
        >
        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -0.6 }}>
            Resume Job Matcher
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
            Upload a PDF, DOC, or DOCX resume, optionally describe the kind of role you want, and
            get extracted skills plus matching jobs.
        </Typography>
    </Box>
  );
}

export default Header;