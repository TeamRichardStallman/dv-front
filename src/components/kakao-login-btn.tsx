import Image from "next/image";

const KakaoLoginButton = () => {
  return (
    <div className="relative w-[200.5px] h-[60px] cursor-pointer">
      <Image
        src="/kakao_login_large_narrow.png"
        alt="Kakao Oauth Login Button"
        fill
        className="object-contain"
        unoptimized
        priority
      />
    </div>
  );
};

export default KakaoLoginButton;
