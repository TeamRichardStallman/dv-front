import Image from "next/image";

interface NoContentProps {
    text: string;
}

export default function NoContent({text}: NoContentProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="relative w-48 h-48">
                <Image
                    src="/surprised_logo_gray.png"
                    alt="내용이 없습니다."
                    layout="fill"
                    className="object-contain"
                    unoptimized
                    priority
                />
            </div>
            <p className="text-lg">{text} 없습니다.</p>
        </div>
    )
};