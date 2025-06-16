import React from "react";

const Home = ({ isAsideOpen }) => {
  return (
    <main
      id="main"
      className={`flex-1 p-4  bg-gray-100 min-h-screen transition-margin duration-300 ease-in-out ${
        isAsideOpen ? "ml-64" : "ml-0"
      } mt-16`} // mt-16 para o Header e ml-64 para o Aside
    >
      {/* Page Title */}
    </main>
  );
};

export default Home;
