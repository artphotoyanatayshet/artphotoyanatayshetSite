/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        primary: "#ff6347",  // Красный для акцентов
        theme1: {
          background: '#1a1a1a', // Темный фон
          text: '#ffffff',       // Белый текст для контраста
          bgNav: '#0f0f0a',      // Ярко-красный для навигации
          bgCard: "black",
          anyTextColor: "white",
        },
        theme2: {
          background: '#f7f4ff',
          text: 'black',
          bgNav: '#474452', // Этот цвет можно оставить для совместимости
          bgCard: "#FFFFFFCC",
          anyTextColor: "#00FF00",
          gradientNavFrom: '#f7f4ff', // Светлый серый
          gradientNavTo: '#9376f7', // Более темный серый
        },
        theme3: {
          background: '#ff4757', // Ярко-красный фон
          text: '#FFD700',       // Белый текст для контраста
          bgNav: '#1a1a1a',      // Темный для навигации
          bgCard: "black",
          anyTextColor: "#a2f4bd",
        },
        theme4: {
          background: '#f0f0f0', // Очень светлый серый фон
          text: '#333333',       // Темно-серый текст
          bgNav: '#ff4757',      // Ярко-красный для навигации
          bgCard: "black",
          anyTextColor: "white",
        },
        theme5: {
          background: '#4caf50', // Умеренный зеленый фон
          text: '#ffffff',       // Белый текст
          bgNav: '#ff4757',      // Ярко-красный для навигации
          bgCard: "black",
          anyTextColor: "white",
        },
        
      },
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
        syne: ["Syne", "sans-serif"],
      },
    },
  },
  plugins: [],
}
