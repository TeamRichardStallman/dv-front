interface GetUserResponse {
  data: GetUserProps;
}

interface GetUserProps {
  type: string;
  userId: number;
  socialId: string;
  email: string;
  name: string;
  nickname: string;
  s3ProfileImageUrl: string;
  leave: boolean;
  gender: string;
  birthdate: Date;
}

interface UserInfo {
  userId: number;
  socialId: string;
  email: string;
  username: string;
  name: string;
  nickname: string;
  s3ProfileImageUrl: string;
  leave: boolean;
  gender: string;
  birthDate: Date;
}

interface GetUserInfo {
  userId: number;
  socialId: string;
  email: string;
  username: string;
  name: string;
  nickname: string;
  s3ProfileImageUrl: string;
  leave: boolean;
  gender: string;
  birthDate: Date;
}
