import MultiFileUploadPanel from "@/components/multi-file-upload-panel";
import { FILES } from "@/data/profileData";

const ProfilePage = () => {
  return <MultiFileUploadPanel files={FILES} />;
};

export default ProfilePage;
