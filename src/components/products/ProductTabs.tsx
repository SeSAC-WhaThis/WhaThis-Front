import React from "react";

export type TabType = "story" | "reviews";

interface ProductTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs: { key: TabType; label: string }[] = [
        { key: "story", label: "스토리" },
        { key: "reviews", label: "기대평" },
    ];

    return (
        <div className="flex justify-center border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`
            px-6 py-3 text-base font-bold transition-colors
            ${activeTab === tab.key
                            ? "text-[#00cfcf] border-b-2 border-[#00cfcf]"
                            : "text-gray-500 hover:text-gray-700"
                        }
          `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default ProductTabs;
