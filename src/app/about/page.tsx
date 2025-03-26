"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Award, History, ThumbsUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  // Variantes de animación
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-black min-h-screen text-gold-light/90">
      {/* Hero Section */}
      <section className="relative h-72 md:h-96 bg-black">
        {/* Botón de regreso */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="bg-black/50 backdrop-blur-sm border-gold/30 text-gold hover:bg-gold/20 rounded-full w-10 h-10"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Regresar</span>
            </Button>
          </Link>
        </div>

        <Image
          src="/trofeoAboutSection.webp"
          alt="Trofeos GD - Nosotros"
          fill
          sizes="(max-width: 768px) 100vw, 100vw"
          priority
          quality={80}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIhAAAgICAQQDAAAAAAAAAAAAAQIDBAUGESEABxITFDFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAT/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBETIUH/2gAMAwEAAhEDEQA/AMxsOezcFZb+PiEsXwKHUeC/hVVlLvz9sqjkAk9AdLZDK3bdrHVZmtZB2nZInIKsxAYkfnHUDpNa5Z86WoWQljPr8lXryonq+KwkBIOyDwQQCP7ozt2dz+bDwVeS7DDyokjZT3lZTyQAOPBeCSeOnBwaiAOEI0o7a2aFSfHIqbMsSzP/2Q=="
          className="object-cover opacity-40"
          style={{
            objectPosition: "center 40%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/95"></div>
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gold text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Nuestra Historia
          </motion.h1>
        </div>
      </section>

      {/* Historia y Misión */}
      <section className="py-16">
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
                Desde 1995, Trofeos GD ha sido sinónimo de calidad y prestigio
                en el mundo de los reconocimientos deportivos y corporativos. Lo
                que comenzó como un pequeño taller familiar en Rosario, se ha
                convertido en una empresa referente en el sector, manteniendo
                siempre la pasión por el detalle y la excelencia artesanal.
              </p>
              <p className="text-gold-light/80 mb-6">
                A lo largo de estos años, hemos tenido el honor de crear trofeos
                y reconocimientos para eventos deportivos de primer nivel,
                competiciones internacionales, premios empresariales y
                ceremonias institucionales, siempre con el compromiso de que
                cada pieza refleje el valor del logro que representa.
              </p>
              <div className="flex items-center space-x-2 text-gold">
                <History className="h-5 w-5" />
                <span className="font-medium">Fundada en 1995</span>
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
                src="/placeholder.svg"
                alt="Historia de Trofeos GD"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIhAAAgICAQQDAAAAAAAAAAAAAQIDBAUGESEABxITFDFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAT/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBETIUH/2gAMAwEAAhEDEQA/AMxsOezcFZb+PiEsXwKHUeC/hVVlLvz9sqjkAk9AdLZDK3bdrHVZmtZB2nZInIKsxAYkfnHUDpNa5Z86WoWQljPr8lXryonq+KwkBIOyDwQQCP7ozt2dz+bDwVeS7DDyokjZT3lZTyQAOPBeCSeOnBwaiAOEI0o7a2aFSfHIqbMsSzP/2Q=="
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores */}
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
              Los principios que guían nuestro trabajo diario y nos permiten
              ofrecer productos y servicios excepcionales.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-black border border-gold/20 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-gold/10 p-4 rounded-full inline-flex mb-4">
                <Award className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-medium text-gold mb-3">Calidad</h3>
              <p className="text-gold-light/70">
                Nos dedicamos a ofrecer productos de la más alta calidad,
                seleccionando cuidadosamente los mejores materiales y procesos
                de fabricación para garantizar trofeos duraderos y elegantes.
              </p>
            </motion.div>

            <motion.div
              className="bg-black border border-gold/20 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gold/10 p-4 rounded-full inline-flex mb-4">
                <DollarSign className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-medium text-gold mb-3">Precio</h3>
              <p className="text-gold-light/70">
                Mantenemos precios competitivos y transparentes, ofreciendo la
                mejor relación calidad-precio del mercado sin comprometer la
                excelencia de nuestros productos.
              </p>
            </motion.div>

            <motion.div
              className="bg-black border border-gold/20 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-gold/10 p-4 rounded-full inline-flex mb-4">
                <ThumbsUp className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-xl font-medium text-gold mb-3">
                Cumplimiento
              </h3>
              <p className="text-gold-light/70">
                Respetamos rigurosamente los plazos acordados, asegurando que
                tus trofeos y reconocimientos estén listos para el gran momento.
                La puntualidad es nuestra promesa.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Equipo - Con imágenes optimizadas */}
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
              Nuestro Equipo
            </h2>
            <p className="text-gold-light/80 max-w-3xl mx-auto">
              Profesionales apasionados que ponen su talento y experiencia al
              servicio de cada proyecto.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Carlos García",
                position: "Director General",
                imageUrl: "/placeholder.svg",
              },
              {
                name: "Ana Martínez",
                position: "Diseñadora",
                imageUrl: "/placeholder.svg",
              },
              {
                name: "Miguel Rodríguez",
                position: "Maestro Artesano",
                imageUrl: "/placeholder.svg",
              },
              {
                name: "Laura Sánchez",
                position: "Atención al Cliente",
                imageUrl: "/placeholder.svg",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative h-64 w-full rounded-lg overflow-hidden border border-gold/20 shadow-lg mb-4">
                  <Image
                    src={member.imageUrl}
                    alt={`${member.name} - ${member.position}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                    loading="lazy"
                    quality={70}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIhAAAgICAQQDAAAAAAAAAAAAAQIDBAUGESEABxITFDFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAT/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBETIUH/2gAMAwEAAhEDEQA/AMxsOezcFZb+PiEsXwKHUeC/hVVlLvz9sqjkAk9AdLZDK3bdrHVZmtZB2nZInIKsxAYkfnHUDpNa5Z86WoWQljPr8lXryonq+KwkBIOyDwQQCP7ozt2dz+bDwVeS7DDyokjZT3lZTyQAOPBeCSeOnBwaiAOEI0o7a2aFSfHIqbMsSzP/2Q=="
                  />
                </div>
                <h3 className="text-xl font-medium text-gold">{member.name}</h3>
                <p className="text-gold-light/70">{member.position}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
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
            {[
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
            ].map((testimonial, index) => (
              <motion.div
                key={index}
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
                <p className="text-gold-light/70 italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="font-medium text-gold">{testimonial.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
            <Button className="bg-gold hover:bg-gold-dark text-black font-medium px-8 py-3 rounded-md transition-colors">
              Contacta con nosotros
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
