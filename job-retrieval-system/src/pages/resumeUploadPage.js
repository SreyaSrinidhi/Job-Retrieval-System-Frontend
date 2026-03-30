import React, { useMemo, useState } from "react";
import {
  Typography,
  Button,
  Paper,
  Box,
  Stack,
  Alert,
  Divider,
  Chip,
  TextField,
} from "@mui/material";
import { UploadPageProvider } from "./uploadPageContext";
import { cleanText } from "../utils/htmlCleaning";
import UploadHeader from "../components/uploadHeader"
import UploadContainer from "../components/uploadContainer"
import UploadButtonsContainer from "../components/uploadButtons/uploadButtonsContainer";

function ResumeUpload() {
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


  return (
    <UploadPageProvider>
      <UploadContainer>
          
        <UploadHeader />

        <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <UploadButtonsContainer />

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
        
      </UploadContainer>
    </UploadPageProvider>
  );
}

export default ResumeUpload;