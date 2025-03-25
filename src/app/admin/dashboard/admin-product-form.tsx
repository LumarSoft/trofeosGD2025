"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Copas Metálicas",
  "Trofeos",
  "Medallas",
  "Plaquetas",
  "Placas",
  "Regalos Empresariales",
  "Marroquinería",
];

interface AdminProductFormProps {
  product?: any;
  onSave: (productData: any) => void;
  onCancel: () => void;
}

export default function AdminProductForm({
  product,
  onSave,
  onCancel,
}: AdminProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: "/placeholder.svg?height=400&width=300", // Default placeholder
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        image: product.image,
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageChange = () => {
    // In a real app, this would open a file picker and upload the image
    // For this demo, we'll just use a different placeholder
    const randomId = Math.floor(Math.random() * 1000);
    setFormData((prev) => ({
      ...prev,
      image: `/placeholder.svg?height=400&width=300&text=Image+${randomId}`,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gold/30 rounded-lg p-6"
    >
      <h2 className="text-xl font-bold text-gold mb-6">
        {product ? "Editar Producto" : "Nuevo Producto"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-48 w-full rounded-lg overflow-hidden border border-gold/30">
                <Image
                  src={formData.image || "/placeholder.svg"}
                  alt="Product preview"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full border-gold/30 text-gold hover:bg-gold/10"
                onClick={handleImageChange}
              >
                <Upload className="mr-2 h-4 w-4" />
                Subir imagen
              </Button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gold-light">
                Nombre del producto
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-black border-gold/30 focus:border-gold text-gold-light"
                placeholder="Ingrese el nombre del producto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-gold-light">
                Categoría
              </Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="bg-black border-gold/30 focus:border-gold text-gold-light">
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gold/30">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-gold-light hover:bg-gold/10 focus:bg-gold/10"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gold-light">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-black border-gold/30 focus:border-gold text-gold-light min-h-[120px]"
                placeholder="Ingrese la descripción del producto"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-gold hover:bg-gold-dark text-black"
          >
            Guardar
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
