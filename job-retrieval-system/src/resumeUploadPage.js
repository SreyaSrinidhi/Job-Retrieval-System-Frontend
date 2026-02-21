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

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    console.log("Uploading:", file);
    
    // Create FormData
    const formData = new FormData();
    formData.append("file", file); // key must match Flask's request.files["file"]

    try {
      //NOTE - we should probably store the backend url in some kinda global env var for ease of use
      const response = await fetch("https://job-retrieval-system-backend.onrender.com/files/upload_resume", {    //NOTE - to test with current changes, edit this to localhost and run locally
        method: "POST",
        body: formData, // multipart/form-data is set automatically
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Upload failed: ${data.error || response.statusText}`);
        return;
      }

      console.log("Upload success:", data);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Error uploading file. See console for details.");
    }
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