import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";

let conversationId: string | null = null;

// UUID 생성 함수
const generateUUID = (): string => {
    return crypto.randomUUID();
};

export const sendChatMessage = async (message: string): Promise<string> => {
    try {
        const headers: Record<string, string> = {};

        // conversationId가 없으면 새로 생성
        if (!conversationId) {
            conversationId = generateUUID();
        }
        headers["ConversationId"] = conversationId;

        // 백엔드가 단순 String을 반환하므로 responseType 설정
        const response = await axiosInstance.post<string>(
            "/ai/inquiry",
            { message },
            { headers }
        );

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status;
            if (status === 401) {
                console.error("Chat API: 인증 오류");
                throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
            } else if (status === 403) {
                console.error("Chat API: 권한 오류");
                throw new Error("접근 권한이 없습니다.");
            } else if (status && status >= 500) {
                console.error("Chat API: 서버 오류");
                throw new Error("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
            } else if (!error.response) {
                console.error("Chat API: 네트워크 오류");
                throw new Error("네트워크 연결을 확인해주세요.");
            }
        }
        console.error("Chat API: 알 수 없는 오류");
        throw new Error("메시지 전송에 실패했습니다. 다시 시도해주세요.");
    }
};

export const resetChatConversation = (): void => {
    conversationId = null;
};

export const getChatConversationId = (): string | null => conversationId;
