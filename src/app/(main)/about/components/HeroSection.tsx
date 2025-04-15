"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
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
          className="text-5xl md:text-7xl font-bold text-gold text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Nuestra historia
        </motion.h1>
      </div>
    </section>
  );
}
