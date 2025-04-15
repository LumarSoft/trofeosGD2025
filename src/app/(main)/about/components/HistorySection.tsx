"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { History } from "lucide-react";
import { fadeInLeft, fadeInRight } from "../utils/animations";

export default function HistorySection() {
  return (
    <section className="py-0 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInLeft}
          >
            <h2 className="text-3xl font-semibold text-gold mb-6">
              Más de tres décadas premiando la excelencia
            </h2>
            <p className="text-gold-light/80 mb-6">
              Desde 1989, Trofeos GD ha sido sinónimo de calidad y prestigio en
              el mundo de los reconocimientos deportivos y corporativos. Lo que
              comenzó como un pequeño taller familiar en Rosario, se ha
              convertido en una empresa referente en el sector, manteniendo
              siempre la pasión por el detalle y la excelencia artesanal.
            </p>
            <p className="text-gold-light/80 mb-6">
              A lo largo de estos años, hemos tenido el honor de fabricar
              trofeos y reconocimientos para eventos deportivos de primer nivel,
              competencias internacionales, premios empresariales y ceremonias
              institucionales, siempre con el compromiso de entrega y que cada
              premio refleje el valor del logro que representa.
            </p>
            <div className="flex items-center space-x-2 text-gold">
              <History className="h-5 w-5" />
              <span className="font-medium">Fundada en 1989</span>
            </div>
          </motion.div>

          <motion.div
            className="relative h-96 rounded-lg overflow-hidden shadow-xl border border-gold/20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInRight}
          >
            <Image
              src="/fotoUs.jpeg"
              alt="Historia de Trofeos GD"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIhAAAgICAQQDAAAAAAAAAAAAAQIDBAUGESEABxITFDFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAT/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBETIUH/2gAMAwEAAhEDEQA/AMxsOezcFZb+PiEsXwKHUeC/hVVlLvz9sqjkAk9AdLZDK3bdrHVZmtZB2nZInIKsxAYkfnHUDpNa5Z86WoWQljPr8lXryonq+KwkBIOyDwQQCP7ozt2dz+bDwVeS7DDyokjZT3lZTyQAOPBeCSeOnBwaiAOEI0o7a2aFSfHIqbMsSzP/2Q=="
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
