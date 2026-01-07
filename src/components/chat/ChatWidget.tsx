import { useState, useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { sendChatMessage, resetChatConversation } from "../../api/chatApi";

interface Message {
    id: string;
    text: string;
    isUser: boolean;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (message: string) => {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: message, isUser: true }]);
        setIsLoading(true);

        try {
            const response = await sendChatMessage(message);
            setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: response, isUser: false }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    text: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
                    isUser: false,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([]);
        resetChatConversation();
    };

    return (
        <>
            {/* 플로팅 토글 버튼 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-[rgb(0,196,196)] text-white rounded-full hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[rgb(0,196,196)]/30 transition-all duration-300 z-50 flex items-center justify-center"
                aria-label={isOpen ? "채팅 닫기" : "채팅 열기"}
            >
                {isOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                )}
            </button>

            {/* 채팅창 */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-180 max-h-[calc(100vh-8rem)] bg-gray-50 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
                    {/* 헤더 */}
                    <div className="bg-[rgb(0,196,196)] text-white px-5 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">WhaThis AI 상담</span>
                        </div>
                        <button
                            onClick={handleReset}
                            className="text-white/80 hover:text-white text-sm transition-colors hover:bg-white/10 px-2 py-1 rounded"
                            title="대화 초기화"
                        >
                            새 대화
                        </button>
                    </div>

                    {/* 메시지 목록 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 mt-8">
                                <p className="text-sm">안녕하세요! WhaThis AI 상담사입니다.</p>
                                <p className="text-sm">무엇이든 물어보세요!</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} />
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-md border border-gray-100">
                                    <div className="flex gap-1.5">
                                        <div
                                            className="w-2 h-2 bg-[rgb(0,196,196)] rounded-full"

                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-[rgb(0,196,196)] rounded-full"

                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-[rgb(0,196,196)] rounded-full"

                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* 입력창 */}
                    <ChatInput onSend={handleSend} disabled={isLoading} />
                </div>
            )}
        </>
    );
}
