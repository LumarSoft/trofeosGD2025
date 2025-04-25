import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Categoria, Producto } from "@/shared/types/catalog";

// Prefetching y persistencia en localStorage
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutos
const PRODUCTS_CACHE_KEY = "cached_products";
const CATEGORIES_CACHE_KEY = "cached_categories";
const ADMIN_UPDATE_TIMESTAMP_KEY = "admin_update_timestamp";

// Función para obtener datos del caché
const getFromCache = <T>(key: string): { data: T | null; timestamp: number | null } => {
  if (typeof window === 'undefined') return { data: null, timestamp: null };
  
  try {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return { data: null, timestamp: null };
    
    const parsed = JSON.parse(cachedData);
    return { data: parsed.data, timestamp: parsed.timestamp };
  } catch (e) {
    return { data: null, timestamp: null };
  }
};

// Función para guardar datos en caché
const saveToCache = <T>(key: string, data: T) => {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheObject = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(key, JSON.stringify(cacheObject));
  } catch (e) {
    console.error('Error guardando datos en caché:', e);
  }
};

// Función para comprobar si el caché debe invalidarse
const shouldInvalidateCache = (cacheKey: string): boolean => {
  if (typeof window === 'undefined') return true;
  
  try {
    // Obtener timestamp de la última actualización del admin
    const adminUpdateTimestamp = localStorage.getItem(ADMIN_UPDATE_TIMESTAMP_KEY);
    if (!adminUpdateTimestamp) return false;
    
    // Obtener timestamp del caché actual
    const { timestamp: cacheTimestamp } = getFromCache<any>(cacheKey);
    if (!cacheTimestamp) return true;
    
    // Si la actualización del admin es más reciente que el caché, invalidar
    return parseInt(adminUpdateTimestamp) > cacheTimestamp;
  } catch (e) {
    // En caso de error, mejor recargar datos
    return true;
  }
};

// Obtención de datos optimizada
const fetcher = async (url: string) => {
  // Determinar qué caché usar según la URL
  const cacheKey = url.includes('productos') 
    ? PRODUCTS_CACHE_KEY 
    : url.includes('categorias') 
      ? CATEGORIES_CACHE_KEY 
      : null;
  
  if (cacheKey) {
    try {
      // Verificar si hay datos en caché y si son válidos
      const { data, timestamp } = getFromCache<any>(cacheKey);
      const isCacheValid = timestamp && (Date.now() - timestamp < CACHE_DURATION);
      
      // Verificar si hay un cambio en admin más reciente que nuestro caché
      const needsInvalidation = shouldInvalidateCache(cacheKey);
      
      // Si el caché es válido y no hay modificaciones recientes, devolver datos del caché
      if (data && isCacheValid && !needsInvalidation) {
        return data;
      }
    } catch (e) {
      console.error('Error al leer caché:', e);
      // Continuamos para obtener datos del servidor
    }
  }
  
  // Si no hay caché válido, obtener datos del servidor
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!res.ok) throw new Error("Error al cargar datos");
    
    const data = await res.json();
    
    // Guardar en caché si tenemos una clave válida
    if (cacheKey) {
      saveToCache(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

// Normalizar texto para búsqueda
const normalizeText = (text: string = ''): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

export function useCatalogData() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const searchParams = useSearchParams();

  // Cargar productos con SWR y optimizaciones
  const {
    data: productos,
    error: productosError,
    isLoading: productosLoading,
  } = useSWR<Producto[]>("/api/productos", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000, // Verificar cada 30 segundos si hay actualizaciones
    dedupingInterval: 15000,
    suspense: false,
    fallbackData: getFromCache<Producto[]>(PRODUCTS_CACHE_KEY).data || [],
    onSuccess: () => {
      // Marcar que ya no es la carga inicial cuando los datos se cargan exitosamente
      setIsInitialLoad(false);
    }
  });

  // Cargar categorías con SWR y optimizaciones
  const {
    data: categorias,
    error: categoriasError,
    isLoading: categoriasLoading,
  } = useSWR<Categoria[]>("/api/categorias", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000,
    dedupingInterval: 15000,
    suspense: false,
    fallbackData: getFromCache<Categoria[]>(CATEGORIES_CACHE_KEY).data || [],
  });

  // Estado combinado
  const loading = (productosLoading || categoriasLoading) && isInitialLoad;
  const error =
    productosError || categoriasError
      ? `Error al cargar datos: ${(productosError || categoriasError)?.message}`
      : null;

  // Efectos para manejar categoría desde URL
  useEffect(() => {
    const categoryFromUrl = searchParams?.get("category");
    if (categoryFromUrl && categorias?.length) {
      const categoryExists = categorias.some(
        (cat) => cat.name === categoryFromUrl
      );
      if (categoryExists) {
        setSelectedCategory(categoryFromUrl);
      }
    }
  }, [searchParams, categorias]);

  // Lista de categorías - memoizada para evitar recálculos
  const categoryOptions = useMemo(() => {
    return ["Todas", ...(categorias?.map((cat) => cat.name) || [])];
  }, [categorias]);

  // Término de búsqueda normalizado para optimizar el filtrado
  const normalizedSearchTerm = useMemo(() => normalizeText(searchTerm), [searchTerm]);

  // Filtrado de productos optimizado con useMemo
  const filteredProducts = useMemo(() => {
    if (!productos || !productos.length) return [];
    
    // Si no hay filtros, devolver todos los productos
    if (!normalizedSearchTerm && selectedCategory === "Todas") {
      return productos;
    }
    
    return productos.filter((product) => {
      // Filtrar por término de búsqueda
      const matchesSearch = !normalizedSearchTerm || (
        normalizeText(product.name).includes(normalizedSearchTerm) || 
        normalizeText(product.description || "").includes(normalizedSearchTerm)
      );

      // Filtrar por categoría
      const matchesCategory = 
        selectedCategory === "Todas" ||
        product.categoria?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [productos, normalizedSearchTerm, selectedCategory]);

  // Funciones para manejar el modal
  const handleProductClick = useCallback((product: Producto) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Opcional: retrasar la eliminación del producto seleccionado para permitir animaciones
    setTimeout(() => setSelectedProduct(null), 300);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    productos,
    categorias,
    filteredProducts,
    categoryOptions,
    loading,
    error,
    selectedProduct,
    isModalOpen,
    handleProductClick,
    closeModal,
  };
}
