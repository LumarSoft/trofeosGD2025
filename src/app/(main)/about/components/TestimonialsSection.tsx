"use client";

import { motion } from "framer-motion";
import { fadeIn } from "../utils/animations";

// Tipo para los testimonios
interface TestimonialProps {
  name: string;
  quote: string;
  index: number;
}

// Componente de testimonio reutilizable
const TestimonialCard: React.FC<TestimonialProps> = ({
  name,
  quote,
  index,
}) => (
  <motion.div
    className="bg-black border border-gold/20 rounded-lg p-6 shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    <div className="mb-4">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-gold text-xl">
          ★
        </span>
      ))}
    </div>
    <p className="text-gold-light/70 italic mb-6">"{quote}"</p>
    <div className="font-medium text-gold">{name}</div>
  </motion.div>
);

export default function TestimonialsSection() {
  // Datos de testimonios
  const testimonialsData = [
    {
      name: "APA - Asociación Pádel Argentino",
      quote:
        "Trofeos GD ha sido nuestro proveedor de confianza para los campeonatos nacionales durante más de una década. Su profesionalidad y la calidad de sus trofeos han estado siempre a la altura de las circunstancias.",
    },
    {
      name: "Club Fábrica de Armas",
      quote:
        "Buscábamos trofeos únicos para nuestra competición anual y Trofeos GD superó todas nuestras expectativas. El diseño personalizado y la atención recibida fueron excepcionales.",
    },
    {
      name: "NewellsCup",
      quote:
        "Los reconocimientos para nuestros premios de innovación debían transmitir exclusividad y calidad. Trofeos GD captó perfectamente nuestra visión y entregó piezas que son auténticas obras de arte.",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-semibold text-gold mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-gold-light/80 max-w-3xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mejor carta de
            presentación.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              quote={testimonial.quote}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
