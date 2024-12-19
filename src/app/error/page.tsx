import Image from "next/image";
import Link from "next/link";

const Error = () => {
  return (
    <div className="flex flex-col justify-center h-full text-center">
      <div className="text-center text-[50px] font-bold">Oops!</div>
      <div className="text-center text-[20px]">다시 시도해주세요.</div>
      <div className="relative w-48 h-48 mb-0">
        <Image
          src="/surprised_logo_gray.png"
          alt="비정상적인 접근입니다."
          layout="fill"
          className="object-contain"
          unoptimized
          priority
        />
      </div>
      <Link href="/">
        <button className="bg-secondary w-24 text-white py-2 px-6 rounded-md">
          홈으로
        </button>
      </Link>
    </div>
  );
};

export default Error;
