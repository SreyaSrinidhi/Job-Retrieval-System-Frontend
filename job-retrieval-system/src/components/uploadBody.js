import {
  Box,
  Stack,
  Alert
} from "@mui/material";
import { usePageContext } from "../pages/uploadPageContext";

function UploadBody({ children }) {
    const { error } = usePageContext();

    return (
        <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}
                {children}
            </Stack>
        </Box>
    );
}

export default UploadBody;