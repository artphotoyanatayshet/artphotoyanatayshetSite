import axios from 'axios';
import { GITHUB_TOKEN } from '../../../constants/globalVar';

interface GitHubUploadResponse {
  content: {
    path: string;
    sha: string;
  };
}

export const addImageToRepo = async (
  owner: string,
  repo: string,
  filePath: string,
  file: File
): Promise<GitHubUploadResponse> => {
  const base64File = await convertFileToBase64(file);
  
  const response = await axios.put(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      message: `Upload image ${filePath}`,
      content: base64File,
    },
    {
      headers: {
        Authorization: GITHUB_TOKEN, // Замените на ваш токен доступа
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

// Функция для конвертации файла в base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result?.toString().split(',')[1]; // Убираем "data:image/png;base64,"
      resolve(base64 || '');
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
