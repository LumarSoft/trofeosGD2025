import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProductForm from "@/app/admin/dashboard/admin-product-form";
import ProductsTable from "./ProductsTable";
import { Product } from "@/shared/types/Product";

interface ProductTabsProps {
  products: Product[];
  isFormOpen: boolean;
  editingProduct: Product | null;
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: number) => void;
  handleSaveProduct: (productData: Product[]) => void;
  handleCancelForm: () => void;
}

export default function ProductTabs({
  products,
  isFormOpen,
  editingProduct,
  handleEditProduct,
  handleDeleteProduct,
  handleSaveProduct,
  handleCancelForm,
}: ProductTabsProps) {
  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="bg-black border border-gold/30 mb-6">
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

      <TabsContent value="products" className="mt-0">
        {isFormOpen ? (
          <AdminProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={handleCancelForm}
          />
        ) : (
          <ProductsTable
            products={products}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        )}
      </TabsContent>

      <TabsContent value="categories">
        <div className="text-center py-12 text-gold-light/70">
          Gestión de categorías en desarrollo...
        </div>
      </TabsContent>
    </Tabs>
  );
}
