import { useState } from "react";
import Image from "next/image";

type UserFormProps = {
  onSubmit: (formData: FormData) => void;
  isEditPage?: boolean;
};

const UserForm = ({ onSubmit, isEditPage = false }: UserFormProps) => {
  const [nickname, setNickname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("male");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleNicknameCheck = async () => {
    try {
      const response = await fetch(`/api/check-nickname?nickname=${nickname}`); //우리 api로 수정 필요
      const { unique } = await response.json();
      alert(
        unique ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다."
      );
    } catch (error) {
      console.error("닉네임 중복 검사 오류:", error);
      alert("중복 검사 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditPage && !agreedToPrivacy) {
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-2xl mx-auto px-8"
    >
      <div className="flex flex-col items-center">
        <div className="relative inline-block">
          <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-200">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt="프로필 이미지"
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src="/profile-img.png"
                alt="기본 프로필 이미지"
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <label
            htmlFor="profileImageInput"
            className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232a3 3 0 014.242 4.242L7.5 21H3v-4.5L15.232 5.232z"
              />
            </svg>
          </label>
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>
      <div>
        <label className="block font-semibold">닉네임</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border p-2 rounded w-full h-10"
            placeholder="닉네임을 입력하세요"
            required
          />
          <button
            type="button"
            onClick={handleNicknameCheck}
            className="bg-primary text-white py-2 px-6 font-semibold rounded-md h-10 whitespace-nowrap"
          >
            중복 검사
          </button>
        </div>
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
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1 font-medium">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={() => setGender("male")}
              className="h-4 w-4"
              required
            />
            남성
          </label>
          <label className="flex items-center gap-1 font-medium">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === "female"}
              onChange={() => setGender("female")}
              className="h-4 w-4"
              required
            />
            여성
          </label>
        </div>
      </div>
      {!isEditPage && (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={agreedToPrivacy}
            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">개인정보 처리 방침에 동의합니다.</label>
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded font-semibold"
        disabled={!isEditPage && !agreedToPrivacy}
      >
        완료
      </button>
    </form>
  );
};

export default UserForm;
