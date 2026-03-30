import {
  Typography,
  Button,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import { usePageContext } from "../../pages/uploadPageContext";

function UploadButtonsContainer() {
    const { file, setFile, setSkillsJson, setMatches, setResumeId, setError, loading, setLoading, userJobDescription } = usePageContext();

    const handleFileChange = (event) => {
        const f = event.target.files?.[0] || null;
        setFile(f);
        setSkillsJson(null);
        setMatches([]);
        setResumeId(null);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
        setError("Please choose a resume file first.");
        return;
        }

        setLoading(true);
        setError(null);
        setSkillsJson(null);
        setMatches([]);
        setResumeId(null);

        try {
        const formData = new FormData();
        formData.append("resume", file);

        if (userJobDescription.trim()) {
            formData.append("user_job_description", userJobDescription.trim());
        }


        /*
            OVERALL NOTE - something in this pipeline is moving VERY slow... investigate
        */

        const uploadRes = await fetch("http://127.0.0.1:5000/upload/upload_resume", {
            method: "POST",
            body: formData,
        });

        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok || !uploadJson.ok) {
            throw new Error(uploadJson.error || "Resume upload failed");
        }

        const extractedSkills = uploadJson.data?.extracted || null;
        const newResumeId = uploadJson.data?.resume_id;

        if (!newResumeId) {
            throw new Error("No resume_id returned from backend");
        }

        setSkillsJson(extractedSkills);
        setResumeId(newResumeId);

        //NOTE - socring should probably be processed on backend, not via function call from frontend
        const scoreRes = await fetch(
            `http://127.0.0.1:5000/database/resumes/${newResumeId}/score`,
            {
            method: "POST",
            }
        );

        const scoreJson = await scoreRes.json();

        if (!scoreRes.ok || scoreJson.status !== "ok") {
            throw new Error(scoreJson.message || "Scoring failed");
        }

        const matchesRes = await fetch(
            `http://127.0.0.1:5000/database/resumes/${newResumeId}/matches?limit=10`
        );

        const matchesJson = await matchesRes.json();

        if (!matchesRes.ok || matchesJson.status !== "ok") {
            throw new Error(matchesJson.message || "Failed to fetch matched jobs");
        }

        setMatches(matchesJson.jobs || []);
        } catch (e) {
        setError(e?.message || "Failed to fetch");
        } finally {
        setLoading(false);
        }
  };

  return (
    <Box
        sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "background.paper",
        }}
        >
        <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
            Upload resume
            </Typography>

            <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems="stretch"
            >
            <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ borderRadius: 2.5, py: 1.2 }}
            >
                Choose file
                <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                />
            </Button>

            <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading || !file}
                fullWidth
                sx={{ borderRadius: 2.5, py: 1.2, fontWeight: 700 }}
            >
                {loading ? (
                <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} color="inherit" />
                    <span>Finding jobs...</span>
                </Stack>
                ) : (
                "Find Jobs"
                )}
            </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary">
            {file ? (
                <>
                Selected:{" "}
                <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {file.name}
                </Box>
                </>
            ) : (
                "No file selected."
            )}
            </Typography>
        </Stack>
    </Box>
  );
}

export default UploadButtonsContainer;
          
        