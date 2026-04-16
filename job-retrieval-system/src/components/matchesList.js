import {
  Box,
  Stack,
  Divider,
  Typography,
  Paper,
  Chip,
  Button
} from "@mui/material";
import { cleanText } from "../utils/htmlCleaning";
import { usePageContext } from "../pages/uploadPageContext";

function MatchesList() {
    const { matches  } = usePageContext();

    return (
        <>
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
                            Match Score: <strong>{score}</strong>
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
        </>
    );
}

export default MatchesList;