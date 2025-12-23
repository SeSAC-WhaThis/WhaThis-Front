import React from "react";

const MainPage: React.FC = () => {
  return (
    <div className="bg-white my-5 w-full flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <main className="bg-sky-300 px-5 py-5 md:w-4/5 lg:w-3/4">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">메인 페이지</h1>
          <p className="text-lg">환영합니다! whathis 메인 페이지입니다.</p>
        </div>
      </main>
      <aside className="bg-green-300 md:w-1/3 lg:w-1/4 px-5 py-40">
        <h1 className="text-2xl md:text-4xl"> Sidebar </h1>
      </aside>
    </div>
  );
};

export default MainPage;
