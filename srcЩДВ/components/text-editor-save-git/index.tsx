import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Импортируем стили Quill
import { GITREPO, GITREPOSITORY_OWNER } from '../../constants/globalVar';
import { getFileContent } from '../api-github/utils/useGetFileContent';
import { updateFileContent } from '../api-github/utils/useUpdateFileContent';
import Modal from 'react-modal'; // Модальное окно

interface GitFileEditorProps {
  path: string; // Путь к редактируемому файлу
}

const owner = GITREPOSITORY_OWNER; // Имя владельца репозитория
const repo = GITREPO;   // Название репозитория

// Функция для кодировки строки в Base64 с поддержкой символов UTF-8
const encodeBase64 = (str: string) => {
  return btoa(unescape(encodeURIComponent(str)));
};

// Функция для декодирования строки из Base64 в UTF-8
const decodeBase64 = (str: string) => {
  return decodeURIComponent(escape(atob(str)));
};

const TextEditorSaveGit: React.FC<GitFileEditorProps> = ({ path }) => {
  //@ts-ignore
  const [fileContent, setFileContent] = useState<string>(''); // Содержимое файла
  const [sha, setSha] = useState<string>('');                 // SHA для коммита
  const [error, setError] = useState<string | null>(null);    // Ошибки
  const [loading, setLoading] = useState<boolean>(false);     // Состояние загрузки
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Состояние модального окна
  const [htmlContent, setHtmlContent] = useState<string>(''); // Содержимое HTML в модальном окне
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }], // Заголовки: H1, H2, H3 и обычный текст
            ['bold', 'italic', 'underline'], // Форматирование
            ['clean'],  // Очистка форматирования
          ],
        },
      });
    }
  }, []);

  // Загрузка содержимого файла при загрузке компонента
  const fetchFile = async () => {
    try {
      const data = await getFileContent(owner, repo, path);
      const decodedContent = decodeBase64(data.content); // Декодируем содержимое Base64 в UTF-8
      setFileContent(decodedContent);
      setSha(data.sha);  // Сохраняем SHA файла

      // Устанавливаем содержимое файла в редактор
      if (quillRef.current) {
        quillRef.current.root.innerHTML = decodedContent;
      }
    } catch (err) {
      setError('Ошибка при загрузке файла');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFile();
  }, [path]);

  const handleSave = async () => {
    const html = quillRef.current?.root.innerHTML; // Получаем содержимое редактора Quill
    if (html) {
      setFileContent(html);
    }

    const encodedContent = encodeBase64(html || ''); // Кодируем содержимое с поддержкой UTF-8

    // Получаем актуальный SHA перед сохранением
    await fetchFile();

    const payload = {
      message: `Update ${path} via API`,
      content: encodedContent,
      sha: sha,  // Обновляем SHA перед сохранением
    };

    setLoading(true); // Устанавливаем состояние загрузки

    try {
      await updateFileContent(owner, repo, path, payload);
      alert('Файл успешно обновлен!');
    } catch (err) {
      setError('Ошибка при обновлении файла');
      console.error(err);
    } finally {
      setLoading(false); // Завершаем состояние загрузки
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleHtmlSave = async () => {
    const encodedHtml = encodeBase64(htmlContent); // Кодируем содержимое HTML

    // Получаем актуальный SHA перед сохранением
    try {
      await fetchFile(); // Обновляем SHA перед сохранением
    } catch (err) {
      setError('Ошибка при загрузке файла для сохранения HTML');
      return;
    }

    const payload = {
      message: `Save HTML of ${path} via API`,
      content: encodedHtml,
      sha: sha,  // Обновляем SHA перед сохранением
    };

    setLoading(true);

    try {
      await updateFileContent(owner, repo, path, payload); // Сохраняем как HTML через API
      alert('HTML содержимое сохранено!');
      closeModal(); // Закрываем модальное окно после сохранения
    } catch (err) {
      setError('Ошибка при сохранении HTML');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div ref={editorRef} style={{ height: '300px' }}></div>
      <button 
        className={`m-2 p-2 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`} 
        onClick={handleSave}
        disabled={loading} // Отключаем кнопку при загрузке
      >
        {loading ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
      <button
        className="m-2 p-2 rounded-lg bg-green-500 hover:bg-green-700"
        onClick={openModal}
        disabled={loading}
      >
        Добавить HTML и сохранить
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Добавить HTML"
        ariaHideApp={false}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <h2>Введите HTML содержимое</h2>
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          style={{ width: '100%', height: '200px' }}
        />
        <button
          className="m-2 p-2 rounded-lg bg-blue-500 hover:bg-blue-700"
          onClick={handleHtmlSave}
        >
          Сохранить HTML
        </button>
        <button
          className="m-2 p-2 rounded-lg bg-gray-500 hover:bg-gray-700"
          onClick={closeModal}
        >
          Отмена
        </button>
      </Modal>
    </div>
  );
};

export default TextEditorSaveGit;
