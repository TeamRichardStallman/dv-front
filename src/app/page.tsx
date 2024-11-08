"use client";

import { motion } from "framer-motion";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4"
          >
            Interview King Dev Kim
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-xl md:text-2xl whitespace-nowrap font-medium mb-12 text-gray-700 max-w-lg leading-relaxed"
          >
            면접, 그 이상의 기록과 성장을 위한 당신의 가상 면접 파트너
          </motion.p>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.8,
            }}
          >
            <Link
              href="/interview"
              className="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              시작하기
            </Link>
          </motion.div>
        </main>

        <Footer />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.1, x: 100 }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        className="absolute top-1/3 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-10"
      />
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.1, x: -100 }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        className="absolute bottom-1/3 right-0 w-80 h-80 bg-purple-400 rounded-full opacity-10"
      />
    </div>
  );
}
