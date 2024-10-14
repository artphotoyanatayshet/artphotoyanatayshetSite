import React, { useState, useEffect, useCallback } from 'react';
import { GITREPO, GITREPOSITORY_OWNER } from '../../../constants/globalVar';
import { getFileContent } from '../../api-github/utils/useGetFileContent';
import { updateFileContent } from '../../api-github/utils/useUpdateFileContent';
import { handleFileUploadForCard } from './FileUploaderForCard';

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

interface EditProductToJsonProps {
  productToEdit?: Product;
  onClose: () => void;
}

const EditProductToJson: React.FC<EditProductToJsonProps> = ({ productToEdit, onClose }) => {
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [selectedFileForCard, setSelectedFileForCard] = useState<File | null>(null);
  const [imageUrlForCard, setImageUrlForCard] = useState<string>('');
  const [uploadMessageForCard, setUploadMessageForCard] = useState<string | null>(null);
  const [uploadMessageImage, setUploadMessageImage] = useState<string | null>(null);


  const owner = GITREPOSITORY_OWNER;
  const repo = GITREPO;
  const path = 'src/components/products/data-product-json/products.json';

  const loadProducts = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await getFileContent(owner, repo, path);
      const decodedContent = decodeURIComponent(escape(atob(data.content)));
      const existingProducts: Product[] = JSON.parse(decodedContent);
      setProducts(existingProducts);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error loading data');
    } finally {
      setIsFetching(false);
    }
  }, [owner, repo, path]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (productToEdit) {
      setNewProduct(productToEdit);
      setImageUrlForCard(productToEdit.img_url);
    }
  }, [productToEdit]);

  const handleFileChangeForCard = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileForCard(file);
      setImageUrlForCard(URL.createObjectURL(file));
    }
  };

  const uploadImage = useCallback(async () => {
    if (selectedFileForCard && newProduct) {
      setLoading(true);
      const newFileName = `product-${newProduct.id}.png`; // Изменено на .png
      const newFilePathPublic = `public/images-product/${newFileName}`; // Путь к файлу с новым именем
      const newFilePathJson = `images-product/${newFileName}`; // Путь к файлу с новым именем


      try {
         handleFileUploadForCard(selectedFileForCard, newFilePathPublic);
        setUploadMessageImage(`Файл ${newFileName} успешно загружен!`);
        setSelectedFileForCard(null);

        // Обновляем URL изображения в newProduct
        setNewProduct((prev) => ({
          ...prev,
          img_url: newFilePathJson, // Обновляем URL
        }) as Product);
      } catch (err) {
        setError('Ошибка при загрузке файла.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setUploadMessageImage('Пожалуйста, выберите файл.');
    }
  }, [selectedFileForCard, newProduct]);

  const updateProduct = useCallback(async () => {
    if (!newProduct || !newProduct.title || !newProduct.img_url) {
      setError('Заполните обязательные поля: заголовок и URL изображения.');
      return;
    }

    setLoading(true);
    const updatedProducts = products.map((product) =>
      product.id === newProduct.id ? newProduct : product
    );

    const jsonString = JSON.stringify(updatedProducts, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(jsonString)));

    try {
      const currentFileContent = await getFileContent(owner, repo, path);
      const payload = {
        message: `Updated product: ${newProduct.title}`,
        content: encodedContent,
        sha: currentFileContent.sha,
      };
      await updateFileContent(owner, repo, path, payload);
      setUploadMessageForCard('Продукт успешно обновлен!');
      loadProducts();
      onClose();
    } catch (err) {
      console.error('Ошибка при сохранении данных:', err);
      setError('Ошибка при сохранении данных');
    } finally {
      setLoading(false);
    }
  }, [newProduct, products, owner, repo, path, loadProducts, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (newProduct) {
      setNewProduct((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }) as Product); // Ensure to assert the type as Product
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isFetching ? (
        <p>Загрузка продуктов...</p>
      ) : (
        <button className="bg-indigo-300 rounded-lg p-2 w-full" onClick={onClose}>
          Редактировать продукт
        </button>
      )}

      {newProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Редактировать продукт</h2>
            <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="absolute px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Закрыть
          </button>
        </div>
            <img
              className="w-28 h-full object-contain rounded-lg "
              src={imageUrlForCard}
              alt="product"
            />
            <label>Выберите файл (Обязательно формат .png):</label>
            <div className="flex items-center mb-2">
              <input type="file" onChange={handleFileChangeForCard} className="mr-2" />
              
            </div>
            <button onClick={uploadImage} className="bg-blue-500 text-white rounded-lg p-2">
                Обновить Изображение
              </button>
            {uploadMessageImage && ( <p style={{ color: 'green' }}>{uploadMessageImage}</p>)}

            <input
              type="text"
              name="img_url"
              placeholder="URL изображения"
              value={imageUrlForCard}
              className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
              readOnly
            />
            <input
              type="text"
              name="title"
              placeholder="Название продукта"
              value={newProduct.title}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
              required
            />
            <textarea
              name="description"
              placeholder="Описание продукта"
              value={newProduct.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="Цена"
              value={newProduct.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
              min="0"
            />
            <input
              type="number"
              name="discount"
              placeholder="Скидка"
              value={newProduct.discount}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
              min="0"
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="is_active"
                checked={newProduct.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              Активен
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="is_delivery"
                checked={newProduct.is_delivery}
                onChange={handleChange}
                className="mr-2"
              />
              Доставка
            </label>
            <button onClick={updateProduct} className="bg-green-500 text-white rounded-lg p-2 w-full">
              {loading ? "Обновление":"Обновить продукт"}
            </button>
            {uploadMessageForCard && (
              <p style={{ color: 'green' }}>{uploadMessageForCard}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductToJson;
