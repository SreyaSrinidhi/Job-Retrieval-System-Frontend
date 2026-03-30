import {
  Typography,
  Box,
  Stack,
  TextField
} from "@mui/material";
import { usePageContext } from "../pages/uploadPageContext";

function RefinementTextbox() {
    const { userJobDescription, setUserJobDescription} = usePageContext();

    return (
        <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
        >
            <Stack spacing={1.25}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Desired Job Type
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Optional. Add a short description of the type of role you want to help refine
                    extraction and matching.
                </Typography>

                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Example: Entry-level software engineer in backend, AI/ML, or product-focused roles. Prefer full-time roles in SF, NYC, or remote."
                    value={userJobDescription}
                    onChange={(e) => setUserJobDescription(e.target.value)}
                />
            </Stack>
        </Box>
    );
}

export default RefinementTextbox;
