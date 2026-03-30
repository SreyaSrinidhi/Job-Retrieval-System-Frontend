import {
  Container,
  Box,
  Paper
} from "@mui/material";

function UploadContainer({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, sm: 6 },
        background:
          "radial-gradient(1200px 600px at 20% 10%, rgba(25,118,210,0.10), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(156,39,176,0.10), transparent 55%), #f7f8fb",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "rgba(0,0,0,0.05)",
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
          }}
        >

          {children}

        </Paper>
      </Container>
    </Box>
  );
}

export default UploadContainer;