import { useMemo } from "react";
import {
  Typography,
  Box,
  Divider,
  Stack,
  Alert,
  Chip
} from "@mui/material";
import { usePageContext } from "../pages/uploadPageContext";
import { cleanText } from "../utils/htmlCleaning";

function SkillsList() {
    const { skillsJson } = usePageContext();

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
        <>
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
        </>
    );
}

export default SkillsList;