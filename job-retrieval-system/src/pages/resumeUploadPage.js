import { UploadPageProvider } from "./uploadPageContext";
import UploadHeader from "../components/uploadHeader"
import UploadContainer from "../components/uploadContainer"
import UploadButtons from "../components/uploadButtons";
import UploadBody from "../components/uploadBody";
import SkillsList from "../components/skillsList";
import RefinementTextbox from "../components/refinementTextbox";
import NoMatchesDisplay from "../components/noMatchesDisplay";
import MatchesList from "../components/matchesList";

function ResumeUpload() {

  return (
    <UploadPageProvider>
      <UploadContainer>
          
        <UploadHeader />

        <UploadBody>

          <UploadButtons />

          <RefinementTextbox />

          <SkillsList />

          <MatchesList />

          <NoMatchesDisplay />

        </UploadBody>
        
      </UploadContainer>
    </UploadPageProvider>
  );
}

export default ResumeUpload;