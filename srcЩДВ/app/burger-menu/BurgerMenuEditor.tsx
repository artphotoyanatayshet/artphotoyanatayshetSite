import React, { useEffect, useState } from 'react';
import { GITHUB_API_URL, GITHUB_TOKEN, GITREPO, GITREPOSITORY_OWNER } from '../../constants/globalVar';
import textBurgerMenu from './burger-menu.json';
import { updateFileContent } from '../../components/api-github/utils/useUpdateFileContent';

const BurgerMenuEditor: React.FC = () => {
    const [burgerMenuData, setBurgerMenuData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Загрузка данных меню из JSON
        setBurgerMenuData(textBurgerMenu.BurgerMenu);
        setLoading(false);
    }, []);

    const handleTitleChange = (key: string, value: string) => {
        setBurgerMenuData((prevData: any) => ({
            ...prevData,
            [key]: {
                ...prevData[key],
                title: value
            }
        }));
    };

    const handleIsActiveChange = (key: string, value: boolean) => {
        setBurgerMenuData((prevData: any) => ({
            ...prevData,
            [key]: {
                ...prevData[key],
                is_active: value
            }
        }));
    };

    const handleSave = async () => {
        try {
            const owner = GITREPOSITORY_OWNER;
            const repo = GITREPO;
            const path = 'src/app/burger-menu/burger-menu.json'; // Путь к файлу burger-menu.json
            setLoading(true);

            // Получаем текущее содержимое файла с SHA
            const response = await fetch(`${GITHUB_API_URL}/${owner}/${repo}/contents/${path}`, {
                method: 'GET',
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки файла: ${response.statusText}`);
            }

            const data = await response.json();
            const sha = data.sha;
            const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify({ BurgerMenu: burgerMenuData }, null, 2))));

            // Обновляем файл
            const updatedContent = {
                message: 'Update BurgerMenu',
                content: encodedContent,
                sha: sha,
            };

            await updateFileContent(owner, repo, path, updatedContent);
            setLoading(false);
            alert('BurgerMenu успешно обновлено!');
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Редактор BurgerMenu</h2>
            {loading ? (
                <p className="text-center">Загрузка...</p>
            ) : (
                <div className="flex flex-col space-y-6">
                    {Object.keys(burgerMenuData).map((key) => (
                        <div key={key} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                            <label className="block text-lg font-semibold mb-2">
                                {key} (Заголовок) {/* Изменили значение метки на ключ */}
                            </label>
                            <input
                                type="text"
                                value={burgerMenuData[key].title || ''}
                                onChange={(e) => handleTitleChange(key, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Введите заголовок"
                            />
                            {burgerMenuData[key].hasOwnProperty('is_active') && (
                                <div className="flex items-center mt-4">
                                    <label className="mr-2">{key} Активно:</label> {/* Изменили значение метки на ключ */}
                                    <input
                                        type="checkbox"
                                        checked={burgerMenuData[key].is_active}
                                        onChange={(e) => handleIsActiveChange(key, e.target.checked)}
                                        className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                    >
                        {loading ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default BurgerMenuEditor;
