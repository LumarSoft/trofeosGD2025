"use client";

import { motion } from "framer-motion";
import { Award, ThumbsUp, DollarSign } from "lucide-react";
import { fadeIn } from "../utils/animations";

// Definición del tipo para cada valor
interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

// Componente de tarjeta de valor reutilizable
const ValueCard: React.FC<ValueCardProps> = ({
  icon,
  title,
  description,
  delay,
}) => (
  <motion.div
    className="bg-black border border-gold/20 rounded-lg p-6 shadow-lg"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="bg-gold/10 p-4 rounded-full inline-flex mb-4">{icon}</div>
    <h3 className="text-xl font-medium text-gold mb-3">{title}</h3>
    <p className="text-gold-light/70">{description}</p>
  </motion.div>
);

export default function ValuesSection() {
  // Datos de los valores para reutilizar
  const valuesData = [
    {
      icon: <Award className="h-8 w-8 text-gold" />,
      title: "Calidad",
      description:
        "Nos dedicamos a ofrecer productos de la más alta calidad, seleccionando cuidadosamente los mejores materiales y procesos de fabricación para garantizar trofeos duraderos y elegantes.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-gold" />,
      title: "Precio",
      description:
        "Mantenemos precios competitivos y transparentes, ofreciendo la mejor relación calidad-precio del mercado sin comprometer la excelencia de nuestros productos.",
    },
    {
      icon: <ThumbsUp className="h-8 w-8 text-gold" />,
      title: "Cumplimiento",
      description:
        "Respetamos rigurosamente los plazos acordados, asegurando que tus trofeos y reconocimientos estén listos para el gran momento. La puntualidad es nuestra promesa.",
    },
  ];

  return (
    <section className="py-16 bg-gold/5">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-semibold text-gold mb-4">
            Nuestros Valores
          </h2>
          <p className="text-gold-light/80 max-w-3xl mx-auto">
            Los principios que guían el trabajo son fundamentales para ofrecer
            productos y servicios excepcionales. El compromiso con una entrega
            en tiempo y forma es clave para asegurar la satisfacción de sus
            clientes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valuesData.map((value, index) => (
            <ValueCard
              key={index}
              icon={value.icon}
              title={value.title}
              description={value.description}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
