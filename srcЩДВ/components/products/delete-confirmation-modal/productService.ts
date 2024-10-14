import { GITHUB_API_URL, GITHUB_TOKEN } from "../../../constants/globalVar";
import { GitHubFileResponse } from "../../api-github/types/githubTypes";

// Получение содержимого файла
export const getFileContent = async (
    owner: string,
    repo: string,
    path: string
  ): Promise<GitHubFileResponse> => {
    const response = await fetch(`${GITHUB_API_URL}/${owner}/${repo}/contents/${path}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });
  
  
    if (!response.ok) {
      throw new Error('Не удалось получить содержимое файла');
    }
  
    const data: GitHubFileResponse = await response.json();
    return data;
  };
  

// Обновление файла JSON
export const updateProductJsonFile = async (owner: string, repo: string, path: string, newContent: string, sha: string) => {
  const response = await fetch(`${GITHUB_API_URL}/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: "Удаление продукта",
      content: btoa(newContent), // Кодируем содержимое в Base64
      sha,
    }),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить файл JSON');
  }
};

// Удаление файла изображения из репозитория
export const deleteImageFromRepo = async (owner: string, repo: string, path: string, sha: string) => {
  const response = await fetch(`${GITHUB_API_URL}/${owner}/${repo}/contents/${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: "Удаление изображения",
      sha,
    }),
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить файл изображения');
  }
};
