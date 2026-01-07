import { useState, FormEvent, KeyboardEvent } from "react";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex gap-2 p-3 bg-white border-t border-gray-100"
        >
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요.."
                disabled={disabled}
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-sm transition-all"
            />
            <button
                type="submit"
                disabled={disabled || !message.trim()}
                className="p-2.5 bg-[rgb(0,196,196)] text-white rounded-full hover:bg-[rgb(0,180,180)] focus:outline-none focus:ring-2 focus:ring-[rgb(0,196,196)]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="전송"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3 21l18-9L3 3l3 9zm0 0l6 0"
                    />
                </svg>
            </button>
        </form>
    );
}
