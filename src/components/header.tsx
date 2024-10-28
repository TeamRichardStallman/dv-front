import Link from "next/link";

export default function Header() {
  return (
    <header className="flex h-16 justify-between items-center px-8 border-b">
      <div>
        <Link href="/">로고</Link>
      </div>
      <div>
        <ul className="flex gap-4">
          <li>
            <Link href="/practice">면접연습</Link>
          </li>
          <li>
            <Link href="/community">커뮤니티</Link>
          </li>
          <li>
            <Link href="/guide">가이드</Link>
          </li>
        </ul>
      </div>
      <div>
        <ul className="flex gap-4">
          {/* <li>Point: 31,270</li> */}
          <li>
            <Link href="/login">로그인</Link>
            {/* <Link href="/user">내 정보</Link> */}
          </li>
        </ul>
      </div>
    </header>
  );
}
