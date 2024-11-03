import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[180.5px] h-[100px] mb-4">
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          className="object-contain"
          unoptimized
          priority
        />
      </div>
      <h1 className="text-2xl font-bold">면접, 그 이상의 기록</h1>
      <div className="relative w-[200.5px] h-[60px] my-8">
        <Image
          src="/kakao_login_large_narrow.png"
          alt="Kakao Oauth Login Button"
          fill
          className="object-contain"
          unoptimized
          priority
        />
      </div>
    </div>
  );
}
