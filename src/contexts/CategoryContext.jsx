import React, { createContext, useState } from "react";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <CategoryContext.Provider
      value={{ activeCategory, setActiveCategory, sidebarOpen, setSidebarOpen }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
