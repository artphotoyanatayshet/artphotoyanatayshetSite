import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import textJsonRu from '../../locale/texts-site-ru.json';


const About: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    const loadHtmlFragment = async () => {
      try {
        const response = await fetch('/fragmentAbout.html'); // Путь к вашему HTML-файлу
        if (response.ok) {
          const text = await response.text();
          setHtmlContent(text);
        } else {
          console.error('Ошибка при загрузке HTML-файла:', response.status);
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    loadHtmlFragment();
  }, []);

  return (
    <div className="mt-12 flex flex-col items-center min-h-screen rounded-lg bg-gray-300">
      <h1 className="pt-10 text-4xl font-bold text-gray-800">{textJsonRu.about.title}</h1>
      {/* Используем dangerouslySetInnerHTML для отображения HTML-контента */}
      <div className="mt-4 p-5 w-full max-w-4xl">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
       <Link
        to="/"
        className="mb-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        На главную
      </Link>
    </div>
  );
};

export default About;
