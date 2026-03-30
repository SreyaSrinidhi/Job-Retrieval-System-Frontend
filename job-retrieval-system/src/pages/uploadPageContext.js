import { createContext, useContext, useState } from "react";

// Create the context
const PageContext = createContext(null);

// Custom hook for convenience
export const usePageContext = () => useContext(PageContext);

// Provider component
export function UploadPageProvider({ children }) {
  const [skillsJson, setSkillsJson] = useState(null);
  const [matches, setMatches] = useState([]);
  const [resumeId, setResumeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userJobDescription, setUserJobDescription] = useState("");

  // Provide both state and setters
  const value = {
    skillsJson,
    setSkillsJson,
    matches,
    setMatches,
    resumeId,
    setResumeId,
    loading,
    setLoading,
    error,
    setError,
    userJobDescription,
    setUserJobDescription,
  };

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}