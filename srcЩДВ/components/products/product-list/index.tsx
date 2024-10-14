import React, { useState } from 'react';
import styles from './styles.module.css';
import productsData from '../data-product-json/products.json'; // Data about products
import ProductDescriptionModal from '../product-description';
import ProductCard from '../product-card';
import EditProductToJson from '../edit-product-to-json';
import DeleteConfirmationModal from '../delete-confirmation-modal';
import { useAuth } from '../../../app/auth/AuthContext';

// Normalize product data
const products = productsData.map(product => ({
  ...product,
  price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
  discount: typeof product.discount === 'string' ? parseFloat(product.discount) : product.discount,
}));

const ProductList: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<null | { title: string; description: string }>(null);
  const [editingProduct, setEditingProduct] = useState<null | any>(null); // State for the product being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // State for the edit modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); // State for delete confirmation modal
  const [productToDelete, setProductToDelete] = useState<null | any>(null); // Product to delete

  const { isAuthenticated } = useAuth();

  // Filter products based on authentication status
  const filteredProducts = isAuthenticated
    ? products // Show all products if authenticated
    : products.filter(product => product.is_active); // Show only active products if not authenticated

  const openModal = (title: string, description: string) => {
    setSelectedProduct({ title, description });
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product); // Set the product to be edited
    setIsEditModalOpen(true); // Open the edit modal
  };

  const closeEditModal = () => {
    setEditingProduct(null); // Reset the editing product
    setIsEditModalOpen(false); // Close the edit modal
  };

  const openDeleteModal = (product: any) => {
    setProductToDelete(product); // Set the product to be deleted
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const closeDeleteModal = () => {
    setProductToDelete(null); // Reset the product to delete
    setIsDeleteModalOpen(false); // Close the delete confirmation modal
  };

  const confirmDelete = () => {
    // Здесь вы можете добавить логику для удаления продукта
    console.log(`Product ${productToDelete?.title} deleted!`);
    closeDeleteModal(); // Закрыть модальное окно после удаления
  };

  return (
    <div className={styles.productList}>
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onMoreDetails={() => openModal(product.title, product.description)}
          onEdit={() => openEditModal(product)} // Pass the product to edit
          onDelete={() => openDeleteModal(product)} // Open delete modal
        />
      ))}
      {selectedProduct && (
        <ProductDescriptionModal
          title={selectedProduct.title}
          description={selectedProduct.description}
          onClose={closeModal}
        />
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <EditProductToJson
          productToEdit={editingProduct} // Pass the product to edit
          onClose={closeEditModal} // Function to close the modal
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && (
        <DeleteConfirmationModal
          title={productToDelete.title}
          pathImage={`public/images-product/product-${productToDelete.id}.png`} 
          pathProductJson={'src/components/products/data-product-json/products.json'}
          idProductJson={productToDelete.id}
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
};

export default ProductList;
