"use client";

const TermsSection = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <section className="mb-4">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-600 whitespace-pre-line">{content}</p>
    </section>
  );
};

export default TermsSection;
