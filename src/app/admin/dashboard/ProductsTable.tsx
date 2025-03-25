import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
}

interface ProductsTableProps {
  products: Product[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: number) => void;
}

export default function ProductsTable({
  products,
  handleEditProduct,
  handleDeleteProduct,
}: ProductsTableProps) {
  return (
    <div className="border border-gold/30 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gold/10">
            <tr>
              <th className="px-4 py-3 text-left text-gold font-medium">
                Imagen
              </th>
              <th className="px-4 py-3 text-left text-gold font-medium">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-gold font-medium">
                Categoría
              </th>
              <th className="px-4 py-3 text-left text-gold font-medium">
                Descripción
              </th>
              <th className="px-4 py-3 text-right text-gold font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gold/5">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-12 rounded overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-gold-light">{product.name}</td>
                <td className="px-4 py-3 text-gold-light/70">
                  {product.category}
                </td>
                <td className="px-4 py-3 text-gold-light/70 max-w-xs truncate">
                  {product.description}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gold-light/70 hover:text-gold hover:bg-gold/10"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gold-light/70 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
