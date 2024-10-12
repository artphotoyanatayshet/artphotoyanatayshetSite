// edit-main-logo
import React, { useState } from 'react';
import { handleFileUpload } from './FileUploaderLogo';
import { Link } from 'react-router-dom';

const EditMainLogo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('/logo.svg'); // начальный путь к изображению
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // состояние для индикатора загрузки

  // Обработка выбора файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file)); // обновляем изображение при выборе нового файла
    }
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile) {
      setIsLoading(true); // показываем индикатор загрузки
      try {
        // Обновляем файл через API
        await handleFileUpload(selectedFile, 'public/logo.svg'); // Путь для обновления
        setUploadMessage(`Файл ${selectedFile.name} успешно загружен и обновлен!`);
        setSelectedFile(null); // сбрасываем выбранный файл
      } catch (err) {
        setUploadMessage('Ошибка при загрузке файла.');
        console.error(err);
      } finally {
        setIsLoading(false); // скрываем индикатор загрузки
      }
    } else {
      setUploadMessage('Пожалуйста, выберите файл.');
    }
  };

  return (
    <div className='mt-12 bg-gray-300 p-3 rounded-2xl'>
      {/* Кнопка "На главную" */}
      <Link
        to="/"
        className=" fixed top-4 right-20 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        На главную
      </Link>
      
      <img
        className="w-28 h-full object-contain rounded-lg grayscale"
        src={imageUrl} // Используем состояние для URL изображения
        alt="logo"
      />
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Выберите файл:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        
        <button type="submit" className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          {isLoading ? 'Загрузка...' : 'Загрузить и обновить файл'}
        </button>
      </form>
      
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default EditMainLogo;
