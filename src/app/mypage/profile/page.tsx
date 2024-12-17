import MultiFileUploadPanel from "@/components/fileupload/multi-file-upload-panel";
import { FILES } from "@/data/profileData";

const ProfilePage = () => {
  return <MultiFileUploadPanel interviewId={0} files={FILES} />;
};

export default ProfilePage;
