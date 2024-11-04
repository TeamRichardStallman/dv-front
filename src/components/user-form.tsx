import { useState } from "react";

type UserFormProps = {
  onSubmit: (formData: FormData) => void;
};

const UserForm = ({ onSubmit }: UserFormProps) => {
  const [nickname, setNickname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPrivacy) {
      alert("개인정보 동의가 필요합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("birthdate", birthdate);
    formData.append("gender", gender);
    if (profileImage) formData.append("profileImage", profileImage);
    formData.append("agreedToPrivacy", String(agreedToPrivacy));

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">프로필 이미지</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div>
        <label className="block font-semibold">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="닉네임을 입력하세요"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">생년월일</label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">성별</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">성별을 선택하세요</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={agreedToPrivacy}
          onChange={(e) => setAgreedToPrivacy(e.target.checked)}
          className="mr-2"
        />
        <label className="text-sm">개인정보 처리 방침에 동의합니다.</label>
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded font-semibold"
        disabled={!agreedToPrivacy}
      >
        완료
      </button>
    </form>
  );
};

export default UserForm;
