import React, { useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function ResumeUploadPage() {
    return (
        <>
            <div className="header">
                <h1>Job Retrieval Platform</h1>
            </div>

            <ResumeUpload/>
        </>
    );
};

function ResumeUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    console.log("Uploading:", file);
    // To be changed later
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        Upload Resume
      </Typography>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      <br /><br />

      <Button variant="contained" onClick={handleUpload}>
        Upload
      </Button>
    </Container>
  );
}

export default ResumeUploadPage;