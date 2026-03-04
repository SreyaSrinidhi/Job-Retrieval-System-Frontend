import React, { useMemo, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [skillsJson, setSkillsJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Builds a nicer categorized view if your JSON contains categories.
  // Falls back to a single "Skills" list.
  const categorizedSkills = useMemo(() => {
    const d = skillsJson || {};

    // Most common formats:
    // 1) { skills: [...] }
    // 2) { extracted_skills: [...] }
    // 3) { skill_list: [...] }
    if (Array.isArray(d.skills)) return { Skills: d.skills };
    if (Array.isArray(d.extracted_skills)) return { Skills: d.extracted_skills };
    if (Array.isArray(d.skill_list)) return { Skills: d.skill_list };

    // 4) { skills: { languages: [...], frameworks: [...], tools: [...] } }
    if (d.skills && typeof d.skills === "object" && !Array.isArray(d.skills)) {
      const out = {};
      for (const [k, v] of Object.entries(d.skills)) {
        if (Array.isArray(v) && v.length) {
          // Title-case the key: "languages" -> "Languages"
          const label = k.charAt(0).toUpperCase() + k.slice(1);
          out[label] = v;
        }
      }
      if (Object.keys(out).length) return out;
    }

    // 5) Last resort: if d itself looks like a category object (rare)
    if (typeof d === "object" && d && !Array.isArray(d)) {
      const out = {};
      for (const [k, v] of Object.entries(d)) {
        if (Array.isArray(v) && v.length) {
          const label = k.charAt(0).toUpperCase() + k.slice(1);
          out[label] = v;
        }
      }
      if (Object.keys(out).length) return out;
    }

    return {};
  }, [skillsJson]);

  const totalSkillCount = useMemo(() => {
    return Object.values(categorizedSkills).reduce((sum, arr) => sum + arr.length, 0);
  }, [categorizedSkills]);

  const handleFileChange = (event) => {
    const f = event.target.files?.[0] || null;
    setFile(f);
    setSkillsJson(null);
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

    try {
      const formData = new FormData();
      formData.append("resume", file); // backend expects "resume"

      const res = await fetch("http://127.0.0.1:5000/upload/upload_resume", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Upload failed");
      }

      setSkillsJson(json.data);
    } catch (e) {
      setError(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: { xs: 5, sm: 7 },
        background:
          "radial-gradient(1200px 600px at 20% 10%, rgba(25,118,210,0.10), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(156,39,176,0.10), transparent 55%), #f7f8fb",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* Header strip */}
          <Box
            sx={{
              px: 4,
              py: 3,
              background:
                "linear-gradient(135deg, rgba(25,118,210,0.12), rgba(156,39,176,0.10))",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
              Resume Skill Extractor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Upload a PDF/DOC/DOCX to extract skills and display them cleanly.
            </Typography>
          </Box>

          {/* Body */}
          <Box sx={{ p: 4 }}>
            <Stack spacing={2.25}>
              {error && <Alert severity="error">{error}</Alert>}

              {/* File picker card */}
              <Box
                sx={{
                  p: 2.25,
                  borderRadius: 3,
                  border: "1px dashed",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Upload resume
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="stretch">
                    <Button variant="outlined" component="label" fullWidth sx={{ borderRadius: 2 }}>
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
                      sx={{ borderRadius: 2 }}
                    >
                      {loading ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CircularProgress size={18} color="inherit" />
                          <span>Extracting…</span>
                        </Stack>
                      ) : (
                        "Extract skills"
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

              {/* Results */}
              {skillsJson && (
                <>
                  <Divider />

                  <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                    <Typography variant="h6" fontWeight={800}>
                      Extracted Skills
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {totalSkillCount > 0 ? `${totalSkillCount} found` : ""}
                    </Typography>
                  </Stack>

                  {totalSkillCount === 0 ? (
                    <Alert severity="info">
                      We received a response, but couldn’t find a recognizable skills list in the
                      JSON.
                    </Alert>
                  ) : (
                    <Stack spacing={2}>
                      {Object.entries(categorizedSkills).map(([category, skills]) => (
                        <Box key={category}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 0.6 }}
                          >
                            {category}
                          </Typography>

                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {skills.slice(0, 80).map((s, idx) => (
                              <Chip
                                key={`${category}-${String(s)}-${idx}`}
                                label={String(s)}
                                sx={{ borderRadius: 2 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </>
              )}

              {/* Footer */}
              
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ResumeUpload;