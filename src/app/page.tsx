import Footer from "@/components/footer";
import Header from "@/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('/backImage.webp')` }}
      ></div> */}

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="relative flex-1 flex flex-col items-center justify-center">
          <Link
            href={"/interview"}
            className="absolute bottom-14 px-6 py-3 bg-secondary text-white rounded text-xl"
          >
            시작하기
          </Link>
        </main>
        <Footer />
      </div>
    </div>
  );
}
