"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <motion.section
      className="py-16 bg-gradient-to-b from-black/70 to-black"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold text-gold mb-6">
          ¿Listo para crear algo único?
        </h2>
        <p className="text-gold-light/80 max-w-2xl mx-auto mb-8">
          Permítenos ayudarte a reconocer la excelencia con trofeos y premios
          que están a la altura de tus logros.
        </p>
        <Link href="/contact">
          <Button className="bg-gold hover:bg-gold-dark text-black font-medium px-10 py-6 rounded-md transition-colors text-lg">
            Contacta con nosotros
          </Button>
        </Link>
      </div>
    </motion.section>
  );
}
