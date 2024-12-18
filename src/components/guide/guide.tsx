"use client";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

interface GuideProps {
  file: string;
}

const Guide: React.FC<GuideProps> = ({ file }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/guides/${file}.md`)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, [file]);
  return (
    <div style={{ display: "flex" }}>
      <aside
        className="toc"
        style={{
          width: "250px",
          position: "sticky",
          top: "10px",
          height: "100vh",
          overflowY: "auto",
          borderRight: "1px solid #ddd",
          padding: "1rem",
        }}
      >
        <nav>
          <ul>
            <li>
              <a href="#1-면접왕-김개발이란">1. 면접왕 김개발이란?</a>
            </li>
            <li>
              <a href="#2-면접-과정은-어떻게-되나요">
                2. 면접 과정은 어떻게 되나요?
              </a>
            </li>
            <ul>
              <li>
                <a href="#면접-준비">- 면접 준비</a>
              </li>
              <li>
                <a href="#면접-진행">- 면접 진행</a>
              </li>
              <li>
                <a href="#평가-조회">- 평가 조회</a>
              </li>
            </ul>
            <li>
              <a href="#3-주의-사항">3. 주의 사항</a>
            </li>
            <li>
              <a href="#4-자주-묻는-질문-faq">4. 자주 묻는 질문 (FAQ)</a>
            </li>
            <li>
              <a href="#5-문의-사항">5. 문의 사항</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main
        className="markdown content"
        style={{ flex: 1, padding: "1rem 2rem", lineHeight: "1.6" }}
      >
        <ReactMarkdown rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>
          {content}
        </ReactMarkdown>
      </main>
    </div>
  );
};

export default Guide;
