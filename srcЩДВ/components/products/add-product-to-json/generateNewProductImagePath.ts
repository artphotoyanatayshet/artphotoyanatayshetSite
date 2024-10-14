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
  interface Result {
    imgNameSaveGit: string;
    imgUrlSaveGit: string;
  }
  
  /**
   * Функция проверяет массив продуктов и возвращает путь к изображению для нового продукта.
   *
   * @param products - массив существующих продуктов
   * @returns Путь к изображению для нового продукта
   */
  export function generateNewProductImagePath(products: Product[]): Result {
    // Находим максимальный ID в существующем массиве продуктов
    const newId = products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
    
    // Генерируем путь к изображению на основе нового ID
    const newImgUrl = `images-product/product-${newId}.png`;
    const imgNameSaveGit = `product-${newId}.png`;

    const result = {imgNameSaveGit, imgUrlSaveGit:newImgUrl};

    return result;
  }
  