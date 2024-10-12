// deleteProduct.ts
import { GITREPO, GITREPOSITORY_OWNER } from '../../../constants/globalVar';
import { getFileContent, updateProductJsonFile, deleteImageFromRepo } from './productService';

export const onConfirmDeleteProductAndImageGitRepo = async (productId: number, pathImage: string, pathProductJson: string) => {
    const owner = GITREPOSITORY_OWNER;
    const repo = GITREPO;

    try {
        // Получаем содержимое JSON-файла
        const jsonContent = await getFileContent(owner, repo, pathProductJson);
        const products = JSON.parse(atob(jsonContent.content)); // Декодируем содержимое

       
        // console.log('Текущие продукты:', products);

        // Находим продукт по ID и удаляем его
        const updatedProducts = products.filter((product: { id: number }) => product.id !== productId);
        const newJsonContent = JSON.stringify(updatedProducts, null, 2); // Форматируем JSON
        // console.log('Обновленный массив продуктов:', updatedProducts);

        // Получаем SHA файла для обновления
        const sha = jsonContent.sha;
        if (!sha) {
            throw new Error('SHA файла не найдено');
        }

        // Обновляем файл JSON
        await updateProductJsonFile(owner, repo, pathProductJson, newJsonContent, sha);

        // Удаляем изображение из репозитория
        const imageInfo = await getFileContent(owner, repo, pathImage);
        const imageSha = imageInfo.sha;
        await deleteImageFromRepo(owner, repo, pathImage, imageSha);

        // console.log(`Продукт с ID ${productId} успешно удален.`);
    } catch (error) {
        console.error('Ошибка при удалении продукта:', error);
    }
};
