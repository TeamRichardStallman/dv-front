import Footer from "@/components/footer";
import Header from "@/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 opacity-50 z-0"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="relative flex-1 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-5xl font-bold mb-4">Interview King Dev Kim</h1>
          <p className="text-xl font-medium mb-12 max-w-lg leading-relaxed">
            면접, 그 이상의 기록
          </p>

          <Link
            href={"/interview"}
            className="absolute bottom-14 px-8 py-4 bg-secondary font-semibold text-white rounded text-xl shadow-lg hover:bg-primary transition-all duration-300"
          >
            시작하기
          </Link>
        </main>
        <Footer />
      </div>
    </div>
  );
}
