import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="relative w-[24px] h-[24px] flex items-center justify-center">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="absolute w-2 h-0.5 bg-white rounded-full dot-fade"
          style={{
            transform: `rotate(${index * 45}deg) translate(8px)`,
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;
