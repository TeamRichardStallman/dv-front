"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeBucketDomain } from "@/utils/format";

export type formDataType = {
  nickname: string;
  birthdate: Date;
  gender: string;
  s3ProfileImageObjectKey?: string;
};

type UserFormProps = {
  onSubmit: (formData: formDataType) => void;
  isEditPage?: boolean;
  initUserData?: formDataType;
};

const UserForm = ({
  onSubmit,
  isEditPage = false,
  initUserData,
}: UserFormProps) => {
  const [nickname, setNickname] = useState(initUserData?.nickname || "");
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    initUserData?.birthdate ? new Date(initUserData.birthdate) : undefined
  );
  const [gender, setGender] = useState(initUserData?.gender || "MAN");
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    initUserData?.s3ProfileImageObjectKey
      ? `https://ktb-8-dev-bucket.s3.ap-northeast-2.amazonaws.com/${initUserData.s3ProfileImageObjectKey}`
      : "/profile-img.png"
  );
  const [s3ProfileImageObjectKey, setS3ProfileImageObjectKey] = useState<
    string | undefined
  >(initUserData?.s3ProfileImageObjectKey);
  const [uploading, setUploading] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState<boolean>(false);

  useEffect(() => {
    setNickname(initUserData?.nickname || "");
    if (initUserData?.birthdate) {
      setBirthdate(new Date(initUserData.birthdate));
    }
    setGender(initUserData?.gender || "MAN");
  }, [initUserData]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    try {
      setUploading(true);

      // Presigned URL 요청
      const uploadResponse = await fetch("/api/s3/uploadFiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `profile-images/${file.name}`,
          fileType: file.type,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error("Presigned URL 요청 실패");
      }

      const { presignedUrl } = await uploadResponse.json();

      // S3로 파일 업로드
      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const uploadedUrl = presignedUrl.split("?")[0];
      const objectKey = removeBucketDomain(uploadedUrl);

      setS3ProfileImageObjectKey(objectKey);

      // Presigned URL로 이미지 URL 가져오기
      const fetchResponse = await fetch("/api/s3/getFile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucketName: "ktb-8-dev-bucket",
          objectKey: objectKey,
        }),
      });

      if (!fetchResponse.ok) {
        throw new Error("Presigned URL 요청 실패");
      }

      const { presignedUrl: viewUrl } = await fetchResponse.json();
      setProfileImageUrl(viewUrl);

      toast.success("프로필 이미지가 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("이미지 업로드 실패", error);
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditPage && !agreedToPrivacy) {
      toast.error("개인정보 동의가 필요합니다.");
      return;
    }

    if (!birthdate) {
      toast.error("생년월일을 입력해주세요.");
      return;
    }

    const formData: formDataType = {
      nickname,
      birthdate,
      gender,
      s3ProfileImageObjectKey,
    };

    try {
      onSubmit(formData);
      toast.success("프로필이 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("프로필 저장 실패", error);
      toast.error("프로필 저장에 실패했습니다.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-2xl mx-auto px-8"
    >
      <div className="flex flex-col items-center">
        <div className="relative inline-block">
          <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={profileImageUrl}
              alt="프로필 이미지"
              width={200}
              height={200}
              className="object-cover w-full h-full"
              onError={() =>
                console.error("이미지 로드 실패. URL:", profileImageUrl)
              }
            />
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
                strokeWidth={2}
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
        {uploading && (
          <p className="text-sm text-gray-500 mt-2">
            이미지를 업로드 중입니다...
          </p>
        )}
      </div>
      <div>
        <label className="block font-semibold">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="border p-2 rounded w-full h-10"
          placeholder="닉네임을 입력하세요"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">생년월일</label>
        <input
          type="date"
          value={birthdate ? birthdate.toISOString().substring(0, 10) : ""}
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
      <ToastContainer
        position="bottom-right"
        toastStyle={{ fontWeight: "500" }}
      />
    </form>
  );
};

export default UserForm;
