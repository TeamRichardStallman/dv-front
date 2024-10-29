import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex h-16 justify-between items-center px-8 border-b">
      <div>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={72.2}
            height={40}
            unoptimized
          />
        </Link>
      </div>
      <div>
        <ul className="flex gap-8">
          <li>
            <Link
              href="/practice"
              className="font-bold hover:text-primary hover:underline"
            >
              면접연습
            </Link>
          </li>
          <li>
            <Link
              href="/community"
              className="font-bold hover:text-primary hover:underline"
            >
              커뮤니티
            </Link>
          </li>
          <li>
            <Link
              href="/guide"
              className="font-bold hover:text-primary hover:underline"
            >
              가이드
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <ul className="flex gap-4">
          <li>
            <Link
              href="/login"
              className="font-bold hover:text-secondary hover:underline"
            >
              로그인
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
