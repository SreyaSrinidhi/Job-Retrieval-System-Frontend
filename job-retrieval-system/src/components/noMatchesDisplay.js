import {
  Alert
} from "@mui/material";
import { usePageContext } from "../pages/uploadPageContext";

function NoMatchesDisplay() {
    const { loading, resumeId, matches } = usePageContext();

    return (
        <>
            {!loading && resumeId && matches.length === 0 && (
                <Alert severity="info">
                Resume uploaded and scored, but no matching jobs were found.
                </Alert>
            )}
        </>
    );
}

export default NoMatchesDisplay;