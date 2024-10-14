import React, { useState, useEffect, useCallback } from 'react';
import { GITREPO, GITREPOSITORY_OWNER } from '../../../constants/globalVar';
import { getFileContent } from '../../api-github/utils/useGetFileContent';
import { generateNewProductImagePath } from './generateNewProductImagePath';
import { updateFileContent } from '../../api-github/utils/useUpdateFileContent';

interface Product {
  id: number;
  img_url: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  is_active: boolean;
  is_delivery: boolean;
}

const AddProductToJson: React.FC = () => {
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    img_url: '',
    title: '',
    description: '',
    price: 0,
    discount: 0,
    is_active: false,
    is_delivery: false,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);
  const [fileSha, setFileSha] = useState<string | null>(null); // SHA файла
  const owner = GITREPOSITORY_OWNER;
  const repo = GITREPO;
  const jsonFilePath = 'src/components/products/data-product-json/products.json';
  const imageUploadPathPublic = 'public/images-product';
  const imagePathToJsonFile = 'images-product/';

  // Загрузка продуктов из JSON
  const loadProducts = useCallback(async () => {
    try {
      const data = await getFileContent(owner, repo, jsonFilePath);
      const decodedContent = decodeURIComponent(escape(atob(data.content)));
      const existingProducts: Product[] = JSON.parse(decodedContent);
      setProducts(existingProducts);
      setFileSha(data.sha); // Сохранение SHA файла для последующего обновления
    } catch (err) {
      console.error('Ошибка загрузки продуктов:', err);
      setError('Ошибка загрузки продуктов.');
    }
  }, [owner, repo, jsonFilePath]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Обработчик изменения файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // Проверка наличия файла перед загрузкой
  const checkIfFileExists = async (filePath: string) => {
    try {
      const data = await getFileContent(owner, repo, filePath);
      return !!data; // Файл существует
    } catch (err) {
      return false; // Файл не найден
    }
  };

  // Конвертация файла в Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => resolve(btoa(reader.result as string));
      reader.onerror = (error) => reject(error);
    });
  };

  // Загрузка изображения на GitHub
  const uploadImageToGitHub = useCallback(async () => {
    if (!selectedFile) {
      setError('Пожалуйста, выберите изображение.');
      return;
    }

    const dataSaveProductGit = generateNewProductImagePath(products);
    if (!dataSaveProductGit?.imgNameSaveGit) {
      setError('Ошибка генерации имени изображения.');
      return;
    }

    const imageName = dataSaveProductGit.imgNameSaveGit;
    const imagePathToJson = `${imageUploadPathPublic}${imageName}`;

    // Проверка существования файла
    const fileExists = await checkIfFileExists(imagePathToJson);
    if (fileExists) {
      setError('Изображение с таким именем уже существует.');
      return;
    }

    setImageUploadLoading(true);
    try {
      const base64Image = await convertFileToBase64(selectedFile);

      const payload = {
        message: `Загружено изображение: ${imageName}`,
        content: base64Image,
      };

      await updateFileContent(owner, repo, `${imageUploadPathPublic}/${imageName}`, payload);
      setUploadMessage('Изображение успешно загружено!');
      setNewProduct((prev) => ({ ...prev, img_url: `${imagePathToJsonFile}/${imageName}` }));
      setImageUrl(imageUploadPathPublic);
    } catch (err) {
      console.error('Ошибка загрузки изображения:', err);
      setError('Ошибка загрузки изображения.');
    } finally {
      setImageUploadLoading(false);
    }
  }, [selectedFile, owner, repo, products]);

  // Добавление нового продукта
 // Добавление нового продукта
const addProduct = useCallback(async () => {
  if (!newProduct.title) {
    setError('Заполните обязательные поля.');
    return;
  }

  // Проверка наличия изображения
  if (!newProduct.img_url) {
    setError('Загрузите изображение продукта.');
    return;
  }

  if (!fileSha) {
    setError('Не удалось получить SHA файла.');
    return;
  }

  setLoading(true);
  const newId = products.length ? products[products.length - 1].id + 1 : 1;
  const updatedProduct = { ...newProduct, id: newId };
  const updatedProducts = [...products, updatedProduct];

  const jsonString = JSON.stringify(updatedProducts, null, 2);
  const encodedContent = btoa(unescape(encodeURIComponent(jsonString)));

  try {
    const payload = {
      message: `Добавлен продукт: ${newProduct.title}`,
      content: encodedContent,
      sha: fileSha, // Включение SHA в запрос
    };

    await updateFileContent(owner, repo, jsonFilePath, payload);
    setUploadMessage('Продукт успешно добавлен!');
    resetNewProduct();
    loadProducts();
    setIsModalOpen(false);
  } catch (err) {
    console.error('Ошибка сохранения продукта:', err);
    setError('Ошибка сохранения продукта.');
  } finally {
    setLoading(false);
  }
}, [newProduct, products, owner, repo, jsonFilePath, fileSha, loadProducts]);


  // Сброс состояния формы
  const resetNewProduct = () => {
    setNewProduct({
      id: 0,
      img_url: '',
      title: '',
      description: '',
      price: 0,
      discount: 0,
      is_active: false,
      is_delivery: false,
    });
    setSelectedFile(null);
    setImageUrl('');
  };

  // Обработчик изменений полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
  
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploadMessage && <p style={{ color: 'green' }}>{uploadMessage}</p>}

      <button className="bg-indigo-300 rounded-lg p-2 w-full" onClick={() => setIsModalOpen(true)}>
        Добавить продукт
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Добавить продукт</h2>

            {imageUrl && <img className="w-28 h-full object-contain rounded-lg" src={imageUrl} alt="product" />}
            <label>Выбрать изображение:</label>
            <input type="file" onChange={handleFileChange} />
            <button
              className="bg-blue-500 text-white p-2 rounded mt-2"
              onClick={uploadImageToGitHub}
              disabled={imageUploadLoading}
            >
              {imageUploadLoading ? 'Загрузка...' : 'Загрузить изображение'}
            </button>

            <input
              type="text"
              name="title"
              placeholder="Название продукта"
              value={newProduct.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
            <textarea
              name="description"
              placeholder="Описание продукта"
              value={newProduct.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              rows={4}
            />
            <input
              type="number"
              name="price"
              placeholder="Цена"
              value={newProduct.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
            <input
              type="number"
              name="discount"
              placeholder="Скидка"
              value={newProduct.discount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={newProduct.is_active}
                onChange={handleChange}
              />
              Активен
            </label>
            <label>
              <input
                type="checkbox"
                name="is_delivery"
                checked={newProduct.is_delivery}
                onChange={handleChange}
              />
              Доставка
            </label>

            <button className="bg-green-500 text-white p-2 rounded mt-2" onClick={addProduct} disabled={loading}>
              {loading ? 'Сохранение...' : 'Добавить продукт'}
            </button>

            <button className="bg-red-500 text-white p-2 rounded mt-2" onClick={() => setIsModalOpen(false)}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductToJson;
