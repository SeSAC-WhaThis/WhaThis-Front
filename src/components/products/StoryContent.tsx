import React from "react";

interface StoryContentProps {
    storyImageUrl?: string;
}

const StoryContent: React.FC<StoryContentProps> = ({ storyImageUrl }) => {
    if (!storyImageUrl) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400">
                등록된 스토리가 없습니다.
            </div>
        );
    }

    return (
        <div>
            <img
                src={storyImageUrl}
                alt="프로젝트 스토리"
                className="w-full h-auto object-cover"
            />
        </div>
    );
};

export default StoryContent;
