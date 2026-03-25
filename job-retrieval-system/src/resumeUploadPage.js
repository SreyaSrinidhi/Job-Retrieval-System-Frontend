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
  TextField,
} from "@mui/material";

function stripHtml(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return doc.body.textContent || "";
}

function decodeHtmlEntities(text) {
  if (!text) return "";
  const textarea = document.createElement("textarea");
  textarea.innerHTML = String(text);
  return textarea.value;
}

function cleanText(text) {
  if (!text) return "";

  let cleaned = decodeHtmlEntities(stripHtml(String(text)));

  cleaned = cleaned
    .replace(/\uFFFD/g, "")
    .replace(/â/g, "'")
    .replace(/â/g, "'")
    .replace(/â/g, '"')
    .replace(/â/g, '"')
    .replace(/â/g, "-")
    .replace(/â/g, "-")
    .replace(/&nbsp;/g, " ")
    .replace(/\*\*/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/<\/br>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [skillsJson, setSkillsJson] = useState(null);
  const [matches, setMatches] = useState([]);
  const [resumeId, setResumeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userJobDescription, setUserJobDescription] = useState("");

  const categorizedSkills = useMemo(() => {
    const d = skillsJson || {};

    if (Array.isArray(d.skills)) return { Skills: d.skills };
    if (Array.isArray(d.extracted_skills)) return { Skills: d.extracted_skills };
    if (Array.isArray(d.skill_list)) return { Skills: d.skill_list };

    if (d.skills && typeof d.skills === "object" && !Array.isArray(d.skills)) {
      const out = {};
      for (const [k, v] of Object.entries(d.skills)) {
        if (Array.isArray(v) && v.length) {
          const label = k.charAt(0).toUpperCase() + k.slice(1);
          out[label] = v;
        }
      }
      if (Object.keys(out).length) return out;
    }

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

          <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}

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

              {skillsJson && (
                <>
                  <Divider />

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "baseline" }}
                    spacing={0.5}
                  >
                    <Typography variant="h6" fontWeight={800}>
                      Extracted Skills
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {totalSkillCount > 0 ? `${totalSkillCount} found` : ""}
                    </Typography>
                  </Stack>

                  {Object.keys(categorizedSkills).length === 0 ? (
                    <Alert severity="info">
                      No structured skills were returned for this resume.
                    </Alert>
                  ) : (
                    <Stack spacing={2}>
                      {Object.entries(categorizedSkills).map(([category, skills]) => (
                        <Box
                          key={category}
                          sx={{
                            p: 2.25,
                            borderRadius: 3,
                            bgcolor: "rgba(25,118,210,0.03)",
                            border: "1px solid",
                            borderColor: "rgba(25,118,210,0.08)",
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.25 }}>
                            {category}
                          </Typography>

                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {skills.slice(0, 80).map((s, idx) => (
                              <Chip
                                key={`${category}-${String(s)}-${idx}`}
                                label={cleanText(String(s))}
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

              {matches.length > 0 && (
                <>
                  <Divider />

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "baseline" }}
                    spacing={0.5}
                  >
                    <Typography variant="h6" fontWeight={800}>
                      Job Recommendations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {matches.length} found
                    </Typography>
                  </Stack>

                  <Stack spacing={2}>
                    {matches.map((job, index) => {
                      const title = cleanText(job.title);
                      const company = cleanText(job.company);
                      const location = cleanText(job.location);
                      const explanation = cleanText(job.explanation);
                      const description = cleanText(job.description);
                      const score =
                        typeof job.score === "number"
                          ? job.score.toFixed(2)
                          : cleanText(job.score);

                      return (
                        <Paper
                          key={job.match_id || `${title}-${index}`}
                          variant="outlined"
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            borderColor: "rgba(0,0,0,0.08)",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                          }}
                        >
                          <Stack spacing={1.25}>
                            <Typography variant="h6" fontWeight={700}>
                              {title || "Untitled role"}
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                              {company || "Unknown company"}
                              {location ? ` • ${location}` : ""}
                            </Typography>

                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Match Score: <strong>{score}%</strong>
                            </Typography>

                            {explanation && (
                              <Typography variant="body2" color="text.secondary">
                                {explanation}
                              </Typography>
                            )}

                            {Array.isArray(job.tags) && job.tags.length > 0 && (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {job.tags
                                  .map((tag) => cleanText(String(tag)))
                                  .filter(Boolean)
                                  .slice(0, 8)
                                  .map((tag, idx) => (
                                    <Chip
                                      key={`${job.match_id || index}-tag-${idx}`}
                                      label={tag}
                                      size="small"
                                      sx={{ borderRadius: 2 }}
                                    />
                                  ))}
                              </Box>
                            )}

                            {description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mt: 0.5,
                                  lineHeight: 1.7,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 4,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {description}
                              </Typography>
                            )}

                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={1}
                              sx={{ pt: 1 }}
                            >
                              {job.url && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  href={job.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  sx={{ borderRadius: 2 }}
                                >
                                  View Job
                                </Button>
                              )}

                              {job.apply_url && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  href={job.apply_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  sx={{ borderRadius: 2 }}
                                >
                                  Apply
                                </Button>
                              )}
                            </Stack>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </>
              )}

              {!loading && resumeId && matches.length === 0 && (
                <Alert severity="info">
                  Resume uploaded and scored, but no matching jobs were found.
                </Alert>
              )}
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ResumeUpload;