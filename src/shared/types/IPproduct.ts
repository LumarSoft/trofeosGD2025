/**
 * Props para el componente AdminProductForm
 */
export interface AdminProductFormProps {
  product?: any;
  categories?: Category[];
  onSave: (productData: ProductFormData) => void;
  onCancel: () => void;
  maxFileSize?: number;
}

/**
 * Representación de una categoría
 */
export interface Category {
  id: number;
  name: string;
}

/**
 * Estado del formulario de producto
 */
export interface ProductFormData {
  id?: number;
  name: string;
  description: string;
  category: string;
  category_id?: number;
  category_name: string;
  image: string;
  imagePath?: string;
}

/**
 * Información de la imagen cargada
 */
export interface ImageInfo {
  name: string;
  size: number;
  sizeFormatted: string;
}
