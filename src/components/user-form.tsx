"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { GetUserProps } from "@/app/(user)/auth/page";

export type formDataType = {
  nickname: string;
  birthdate: Date;
  gender: string;
};

type UserFormProps = {
  onSubmit: (formData: formDataType) => void;
  isEditPage?: boolean;
  initUserData?: GetUserProps;
};

const UserForm = ({
  onSubmit,
  isEditPage = false,
  initUserData,
}: UserFormProps) => {
  const [nickname, setNickname] = useState(
    initUserData?.nickname ? initUserData?.nickname : ""
  );
  const [birthdate, setBirthdate] = useState(
    initUserData?.birthdate ? new Date(initUserData.birthdate) : undefined
  );
  const [gender, setGender] = useState(
    initUserData?.gender ? initUserData?.gender : "MAN"
  );
  const [, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  useEffect(() => {
    setNickname(initUserData?.nickname ?? "");
    if (initUserData?.birthdate) {
      setBirthdate(new Date(initUserData.birthdate));
    }
    setGender(initUserData?.gender ?? "MAN");
  }, [initUserData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditPage && !agreedToPrivacy) {
      alert("개인정보 동의가 필요합니다.");
      return;
    }

    if (!birthdate) {
      alert("생일을 입력해주세요");
      return;
    }

    const formData = {
      nickname: nickname,
      birthdate: birthdate,
      gender: gender,
    };

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
            {initUserData?.s3ProfileImageUrl ? (
              <Image
                src={initUserData?.s3ProfileImageUrl}
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
        </div>
      </div>
      <div>
        <label className="block font-semibold">생년월일</label>
        <input
          type="date"
          value={
            birthdate instanceof Date
              ? birthdate.toISOString().substring(0, 10)
              : ""
          }
          onChange={(e) =>
            setBirthdate(e.target.value ? new Date(e.target.value) : undefined)
          }
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
              value="MAN"
              checked={gender === "MAN"}
              onChange={() => setGender("MAN")}
              className="h-4 w-4"
              required
            />
            남성
          </label>
          <label className="flex items-center gap-1 font-medium">
            <input
              type="radio"
              name="gender"
              value="WOMAN"
              checked={gender === "WOMAN"}
              onChange={() => setGender("WOMAN")}
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
        {isEditPage ? "저장" : "완료"}
      </button>
    </form>
  );
};

export default UserForm;
