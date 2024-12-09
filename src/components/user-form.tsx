"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { removeBucketDomain } from "@/utils/format";
import { setUrl } from "@/utils/setUrl";

export type formDataType = {
  name: string;
  userId?: number;
  username: string;
  nickname: string;
  birthdate: Date | string;
  gender: string;
  s3ProfileImageObjectKey?: string;
  s3ProfileImageUrl?: string;
};

type UserFormProps = {
  onSubmit: (formData: formDataType) => void;
  isEditPage?: boolean;
  initUserData?: Partial<formDataType>;
};

type ValidateUsernameResponse = {
  code: number;
  message: string;
  data: boolean;
};

type PresignedUrlResponse = {
  presignedUrl: string;
};

const apiUrl = `${setUrl}`;

const UserForm = ({
  onSubmit,
  isEditPage = false,
  initUserData = {},
}: UserFormProps) => {
  const [name, setName] = useState<string>(initUserData?.name || "");
  const [username, setUsername] = useState<string>(
    initUserData?.username || ""
  );
  const [nickname, setNickname] = useState<string>(
    initUserData?.nickname || ""
  );
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [birthdate, setBirthdate] = useState<string>(
    initUserData?.birthdate
      ? typeof initUserData.birthdate === "string"
        ? initUserData.birthdate
        : new Date(initUserData.birthdate).toISOString().substring(0, 10)
      : ""
  );
  const [gender, setGender] = useState<string>(initUserData?.gender || "MAN");
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    initUserData?.s3ProfileImageObjectKey
      ? `https://ktb-8-dev-bucket.s3.ap-northeast-2.amazonaws.com/${initUserData.s3ProfileImageObjectKey}`
      : "/profile-img.png"
  );
  const [s3ProfileImageObjectKey, setS3ProfileImageObjectKey] = useState<
    string | undefined
  >(initUserData?.s3ProfileImageObjectKey);
  const [uploading, setUploading] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [userId, setUserId] = useState<number | undefined>();

  useEffect(() => {
    console.log(initUserData);
    if (initUserData) {
      setName((prev) => initUserData.name ?? prev);
      setUsername((prev) => initUserData.username ?? prev);
      setNickname((prev) => initUserData.nickname ?? prev);
      setUserId((prev) => initUserData.userId ?? prev);
      setBirthdate((prev) =>
        initUserData.birthdate
          ? typeof initUserData.birthdate === "string"
            ? initUserData.birthdate
            : new Date(initUserData.birthdate).toISOString().substring(0, 10)
          : prev
      );
      setGender((prev) => initUserData.gender ?? prev);
      if (isEditPage && initUserData?.s3ProfileImageUrl) {
        setProfileImageUrl(initUserData.s3ProfileImageUrl);
      } else {
        setProfileImageUrl((prev) =>
          initUserData?.s3ProfileImageObjectKey
            ? `https://ktb-8-dev-bucket.s3.ap-northeast-2.amazonaws.com/${initUserData.s3ProfileImageObjectKey}`
            : prev
        );
      }
      setS3ProfileImageObjectKey(
        (prev) => initUserData.s3ProfileImageObjectKey ?? prev
      );
    }
  }, [isEditPage, initUserData]);

  const handleUsernameChange = (value: string) => {
    const regex = /^[a-zA-Z0-9]*$/;
    if (!regex.test(value)) {
      setUsernameError("Username은 영어와 숫자만 사용할 수 있습니다.");
    } else {
      setUsernameError(null);
      setUsername(value);
    }
    setIsUsernameAvailable(null);
  };

  const handleNicknameChange = (value: string) => {
    const regex = /^[a-zA-Z0-9]*$/;
    if (!regex.test(value)) {
      setNicknameError("Nickname은 영어와 숫자만 사용할 수 있습니다.");
    } else {
      setNicknameError(null);
      setNickname(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = /^[a-zA-Z0-9]$/;
    if (
      !allowedKeys.test(event.key) &&
      event.key !== "Backspace" &&
      event.key !== "Delete" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    ) {
      event.preventDefault();
    }
  };

  const handleUsernameCheck = async () => {
    if (!username) {
      toast.error("Username을 입력해주세요.");
      return;
    }

    try {
      setUsernameChecking(true);

      const response = await axios.get<ValidateUsernameResponse>(
        `${apiUrl}/user/validate-username`,
        {
          params: { username },
        }
      );

      const isDuplicate = response.data.data;
      setIsUsernameAvailable(!isDuplicate);

      if (!isDuplicate) {
        toast.success("사용 가능한 Username입니다!");
      } else {
        toast.error("이미 사용 중인 Username입니다.");
      }
    } catch (error) {
      console.error("Username 중복 검사 실패:", error);
      toast.error("Username 중복 검사에 실패했습니다.");
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    try {
      setUploading(true);

      const uploadResponse = await axios.post<PresignedUrlResponse>(
        "/api/s3/uploadFiles",
        {
          fileName: `profile-image/${userId}/${file.name}`,
          fileType: file.type,
        }
      );

      const presignedUrl = uploadResponse.data.presignedUrl;

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      const uploadedUrl = presignedUrl.split("?")[0];
      const objectKey = removeBucketDomain(uploadedUrl);

      const simplifiedObjectKey = objectKey.replace(
        `profile-image/${userId}/`,
        ""
      );
      setS3ProfileImageObjectKey(simplifiedObjectKey);
      const fetchResponse = await axios.post<PresignedUrlResponse>(
        "/api/s3/getFile",
        {
          bucketName: "ktb-8-dev-bucket",
          objectKey,
        }
      );

      setProfileImageUrl(fetchResponse.data.presignedUrl);
      toast.success("프로필 이미지가 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
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

    if (usernameError || nicknameError) {
      toast.error("영어와 숫자만 입력 가능합니다.");
      return;
    }

    if (!isEditPage && isUsernameAvailable === null) {
      toast.error("Username 중복 검사를 진행해주세요.");
      return;
    }

    if (!isEditPage && !isUsernameAvailable) {
      toast.error(
        "이미 사용 중인 Username입니다. 다른 Username을 입력해주세요."
      );
      return;
    }

    const formData: formDataType = {
      name,
      userId,
      username,
      nickname,
      birthdate: new Date(birthdate).toISOString(),
      gender,
      s3ProfileImageObjectKey,
    };

    try {
      onSubmit(formData);
      toast.success("프로필이 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("프로필 저장 실패:", error);
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
        <label className="block font-semibold">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          maxLength={20}
          className="border p-2 rounded w-full h-10"
          placeholder="이름을 입력하세요"
          required
        />
        <p className="text-sm text-gray-500 mt-1">{name.length}/20 글자</p>
      </div>
      {!isEditPage && (
        <div>
          <label className="block font-semibold">Username</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) =>
                handleUsernameChange(e.target.value.slice(0, 20))
              }
              onKeyDown={handleKeyDown}
              maxLength={20}
              className="border p-2 rounded w-full h-10"
              placeholder="Username을 입력하세요"
              required
            />
            <button
              type="button"
              onClick={handleUsernameCheck}
              className="h-10 px-6 min-w-[140px] bg-primary text-white rounded font-bold"
              disabled={usernameChecking}
            >
              {usernameChecking ? "확인 중..." : "중복 검사"}
            </button>
          </div>
          {usernameError && (
            <p className="text-red-600 text-sm">{usernameError}</p>
          )}
          {isUsernameAvailable !== null && (
            <p
              className={`text-sm mt-2 ${
                isUsernameAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {isUsernameAvailable
                ? "사용 가능한 Username입니다."
                : "이미 사용 중인 Username입니다."}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {username.length}/20 글자
          </p>
        </div>
      )}

      <div>
        <label className="block font-semibold">Nickname</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => handleNicknameChange(e.target.value.slice(0, 15))}
          onKeyDown={handleKeyDown}
          maxLength={15}
          className="border p-2 rounded w-full h-10"
          placeholder="Nickname을 입력하세요"
          required
        />
        {nicknameError && (
          <p className="text-red-600 text-sm">{nicknameError}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">{nickname.length}/15 글자</p>
      </div>
      <div>
        <label className="block font-semibold">생년월일</label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="border p-2 rounded w-full"
          max={new Date().toISOString().split("T")[0]}
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
