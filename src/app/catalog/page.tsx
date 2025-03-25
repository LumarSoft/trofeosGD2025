"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/shared/components/navbar"
import Footer from "@/shared/components/footer"
import ProductModal from "@/shared/components/product-modal"

// Sample data - in a real app, this would come from an API or database
const products = [
  {
    id: 1,
    name: "Copa Campeón Elite",
    description: "Copa metálica de alta calidad con base de mármol negro y detalles dorados.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Copas Metálicas",
  },
  {
    id: 2,
    name: "Trofeo Victoria",
    description: "Trofeo elegante con figura de victoria alada y base personalizable.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Trofeos",
  },
  {
    id: 3,
    name: "Medalla Olímpica",
    description: "Medalla de metal con cinta personalizable y acabado brillante.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Medallas",
  },
  {
    id: 4,
    name: "Plaqueta Conmemorativa",
    description: "Plaqueta de cristal con grabado láser y base iluminada.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Plaquetas",
  },
  {
    id: 5,
    name: "Placa Corporativa",
    description: "Placa de metal con acabado mate y grabado personalizado.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Placas",
  },
  {
    id: 6,
    name: "Set Ejecutivo Premium",
    description: "Set de escritorio con bolígrafo, tarjetero y llavero personalizables.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Regalos Empresariales",
  },
  {
    id: 7,
    name: "Portafolio Ejecutivo",
    description: "Portafolio de cuero genuino con compartimentos y cierre seguro.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Marroquinería",
  },
  {
    id: 8,
    name: "Copa Challenger",
    description: "Copa metálica con asas y grabado personalizado.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Copas Metálicas",
  },
]

const categories = [
  "Todas",
  "Copas Metálicas",
  "Trofeos",
  "Medallas",
  "Plaquetas",
  "Placas",
  "Regalos Empresariales",
  "Marroquinería",
]

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todas" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gold">Catálogo de Productos</h1>
            <p className="text-lg text-gold-light/80 max-w-2xl mx-auto">
              Explore nuestra colección de trofeos, medallas y reconocimientos de alta calidad
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-light/50" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black border-gold/30 focus:border-gold text-gold-light"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-black border-gold/30 focus:border-gold text-gold-light">
                  <Filter className="h-4 w-4 mr-2 text-gold" />
                  <SelectValue placeholder="Categoría" />
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
          </div>

          {filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProductClick(product)}
                  className="bg-black border border-gold/30 rounded-lg overflow-hidden cursor-pointer transition-all hover:border-gold hover:shadow-[0_0_15px_rgba(208,177,110,0.3)]"
                >
                  <div className="relative h-64 w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gold mb-1">{product.name}</h3>
                    <p className="text-sm text-gold-light/70 line-clamp-2">{product.description}</p>
                    <div className="mt-3 text-xs text-gold-light/50">{product.category}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gold-light/70 text-lg">No se encontraron productos que coincidan con su búsqueda.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {isModalOpen && selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} />}
    </main>
  )
}

