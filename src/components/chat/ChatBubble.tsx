import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatBubbleProps {
    message: string;
    isUser: boolean;
}

export default function ChatBubble({ message, isUser }: ChatBubbleProps) {
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
            <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${isUser
                    ? "bg-[rgb(0,196,196)] text-white rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md shadow-md border border-gray-100"
                    }`}
            >
                {isUser ? (
                    <p className="text-sm leading-relaxed m-0">{message}</p>
                ) : (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:m-0 prose-ul:my-1 prose-ol:my-1 prose-p:empty:hidden">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
