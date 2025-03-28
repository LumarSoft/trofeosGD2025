import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProductForm from "@/app/admin/dashboard/admin-product-form";
import ProductsTable from "./ProductsTable";
import CategoriesManager from "./CategoriesManager";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductTabsProps {
  products: any[];
  categories: { id: number; name: string }[];
  isFormOpen: boolean;
  editingProduct: any;
  handleEditProduct: (product: any) => void;
  handleDeleteProduct: (productId: number) => void;
  handleSaveProduct: (productData: any) => Promise<void>;
  handleCancelForm: () => void;
  handleAddProduct: () => void;
  onTabChange?: (tab: string) => void;
}

export default function ProductTabs({
  products,
  categories: initialCategories,
  isFormOpen,
  editingProduct,
  handleEditProduct,
  handleDeleteProduct,
  handleSaveProduct,
  handleCancelForm,
  handleAddProduct,
  onTabChange,
}: ProductTabsProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [activeTab, setActiveTab] = useState("products");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categorias");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error al cargar las categorías");
      }
    };

    fetchCategories();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-black border border-gold/30">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-gold data-[state=active]:text-black"
            >
              Productos
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-gold data-[state=active]:text-black"
            >
              Categorías
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {!isFormOpen && !isAddingCategory && (
          <Button
            className="bg-gold hover:bg-gold/80 text-black w-full sm:w-auto"
            onClick={
              activeTab === "products"
                ? handleAddProduct
                : () => setIsAddingCategory(true)
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "products" ? "Nuevo Producto" : "Nueva Categoría"}
          </Button>
        )}
      </div>

      {activeTab === "products" && (
        <div className="mt-6">
          {isFormOpen ? (
            <AdminProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={handleCancelForm}
              categories={categories}
            />
          ) : (
            <ProductsTable
              products={products}
              handleEditProduct={handleEditProduct}
              handleDeleteProduct={handleDeleteProduct}
            />
          )}
        </div>
      )}

      {activeTab === "categories" && (
        <div className="mt-6">
          <CategoriesManager
            categories={categories}
            isAddingCategory={isAddingCategory}
            setIsAddingCategory={setIsAddingCategory}
          />
        </div>
      )}
    </div>
  );
}
