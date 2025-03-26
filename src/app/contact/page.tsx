"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Instagram,
  Facebook,
  Twitter,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Aquí irá la lógica de envío del formulario
    // Simulamos un retardo para mostrar el estado de carga
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Resetear el formulario después de 3 segundos
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }, 3000);
    }, 1500);
  };

  // Animación para elementos que entran desde abajo
  const fadeInUp = {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6 },
  };

  // Animación para elementos que entran desde la izquierda
  const fadeInLeft = {
    initial: { x: -60, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-black min-h-screen text-gold-light/90">
      {/* Hero Section con imagen optimizada */}
      <section className="relative h-64 md:h-80 bg-black">
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
          src="/trofeosBackground.jpg"
          alt="Contacto Trofeos GD"
          fill
          sizes="(max-width: 768px) 100vw, 100vw"
          priority
          quality={80}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAdEAABBAIDAAAAAAAAAAAAAAAAAQIDBBEhBRJR/8QAFAEBAAAAAAAAAAAAAAAAAAAAA//EABgRAAMBAQAAAAAAAAAAAAAAAAECAwAE/9oADAMBAAIRAxEAPwCb6LY2zncq/bQzSsNLRFRERE+wADi3UqUukv/Z"
          className="object-cover opacity-40"
          style={{
            objectPosition: "center 30%",
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
            Contacta con Nosotros
          </motion.h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <motion.div
            className="space-y-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <motion.div variants={fadeInLeft}>
              <h2 className="text-2xl font-semibold text-gold mb-6">
                Estamos para Ayudarte
              </h2>
              <p className="text-gold-light/70 mb-8">
                Queremos ofrecerte nuestro mejor servicio. Si tenés preguntas
                sobre nuestros productos, presupuestos personalizados o querés
                hacer un pedido, no dudes en contactarnos.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInLeft}
              className="flex items-start space-x-4"
            >
              <div className="bg-gold/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gold-light">
                  Teléfono
                </h3>
                <p className="text-gold-light/70 mt-1">+54 9 3416 61-5774</p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInLeft}
              className="flex items-start space-x-4"
            >
              <div className="bg-gold/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gold-light">Email</h3>
                <p className="text-gold-light/70 mt-1">
                  trofeos-gd@hotmail.com.ar
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInLeft}
              className="flex items-start space-x-4"
            >
              <div className="bg-gold/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gold-light">
                  Dirección
                </h3>
                <p className="text-gold-light/70 mt-1">Bruch 5612</p>
                <p className="text-gold-light/70">Rosario, Santa Fe</p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInLeft}
              className="flex items-start space-x-4"
            >
              <div className="bg-gold/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gold-light">Horario</h3>
                <p className="text-gold-light/70 mt-1">
                  Lunes a Viernes: 9:00 - 20:00
                </p>
                <p className="text-gold-light/70">Sábados: 10:00 - 14:00</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Formulario de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="bg-black border border-gold/20 rounded-lg p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-gold mb-6">
              Envíanos un Mensaje
            </h2>

            {submitSuccess ? (
              <motion.div
                className="bg-gold/10 border border-gold/30 rounded-lg p-6 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                  <Send className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-medium text-gold mb-2">
                  ¡Mensaje Enviado!
                </h3>
                <p className="text-gold-light/70">
                  Gracias por contactarnos. Te responderemos lo antes posible.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gold-light mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-gold/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-gold-light/90"
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gold-light mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-black border border-gold/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-gold-light/90"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-gold-light mb-2"
                    >
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black border border-gold/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-gold-light/90"
                      placeholder="Tu teléfono (opcional)"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-gold-light mb-2"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-black border border-gold/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-gold-light/90 resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gold hover:bg-gold-dark text-black font-medium py-3 rounded-md transition-colors flex items-center justify-center ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Mapa */}
      <motion.section
        className="py-12 bg-black/90"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gold mb-8 text-center">
            Encuéntranos
          </h2>
          <div className="border border-gold/20 rounded-lg overflow-hidden h-96 md:h-[500px]">
            {/* Utilizando lazy loading para el mapa */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3346.0274383977594!2d-60.681131123593566!3d-33.00305207474096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ac08f1d2cacd%3A0xae33038d938a9d54!2sBruch%205612%2C%20S2012HOF%20Rosario%2C%20Santa%20Fe!5e0!3m2!1ses-419!2sar!4v1742933187385!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Trofeos GD"
              className="bg-gold/5"
            ></iframe>
          </div>
        </div>
      </motion.section>

      {/* Preguntas Frecuentes */}
      <motion.section
        className="py-16 bg-gradient-to-b from-black to-black/95"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gold mb-8 text-center">
            Preguntas Frecuentes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="border border-gold/20 rounded-lg p-6"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-medium text-gold mb-3">
                ¿Cuál es el plazo de entrega habitual?
              </h3>
              <p className="text-gold-light/70">
                Nuestro plazo de entrega estándar es de 7 a 10 días laborables.
                Para pedidos urgentes, contamos con servicio express con entrega
                en 48-72 horas (consultar disponibilidad).
              </p>
            </motion.div>

            <motion.div
              className="border border-gold/20 rounded-lg p-6"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-medium text-gold mb-3">
                ¿Realizan envíos internacionales?
              </h3>
              <p className="text-gold-light/70">
                Sí, realizamos envíos a toda Europa y América. Los plazos y
                costes varían según el destino. Contacta con nosotros para un
                presupuesto personalizado.
              </p>
            </motion.div>

            <motion.div
              className="border border-gold/20 rounded-lg p-6"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-medium text-gold mb-3">
                ¿Ofrecen personalización en todos los productos?
              </h3>
              <p className="text-gold-light/70">
                Sí, todos nuestros trofeos y reconocimientos pueden ser
                personalizados con grabados, placas o impresiones a color según
                el material. También ofrecemos diseños exclusivos a medida.
              </p>
            </motion.div>

            <motion.div
              className="border border-gold/20 rounded-lg p-6"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-medium text-gold mb-3">
                ¿Cómo puedo realizar un pedido?
              </h3>
              <p className="text-gold-light/70">
                Puedes realizar tu pedido a través de nuestra web, por teléfono
                o enviándonos un email. Para pedidos corporativos o
                personalizados, te recomendamos contactar directamente con
                nuestro equipo comercial.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
