import React, { useState } from "react";
import { Container, Typography, Button } from "@mui/material";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [skillsJson, setSkillsJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setSkillsJson(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setSkillsJson(null);

    try {
      const formData = new FormData();
      formData.append("resume", file); // IMPORTANT: must be "resume" (backend expects this)

      const res = await fetch("http://127.0.0.1:5000/upload/upload_resume", {        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Upload failed");
      }

      // This is the skills JSON returned by the LLM
      setSkillsJson(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        Upload Resume
      </Typography>

      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

      <br /><br />

      <Button variant="contained" onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </Button>

      <br /><br />

      {error && (
        <Typography color="error" style={{ marginTop: "1rem" }}>
          {error}
        </Typography>
      )}

      {skillsJson && (
        <div style={{ marginTop: "1rem", textAlign: "left" }}>
          <Typography variant="h6">Skills JSON Output</Typography>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(skillsJson, null, 2)}
          </pre>
        </div>
      )}
    </Container>
  );
}
export default ResumeUpload;