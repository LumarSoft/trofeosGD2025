import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gold/20 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-gold font-bold text-lg mb-4">TrofeosGD</h3>
            <p className="text-gold-light/70 mb-4">
              Ofrecemos productos de la más alta calidad para reconocer y
              celebrar los logros más importantes.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.instagram.com/trofeosgd/"
                className="text-gold-light/70 hover:text-gold transition-colors"
                target="_blank"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-gold font-bold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gold-light/70 hover:text-gold transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="text-gold-light/70 hover:text-gold transition-colors"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gold-light/70 hover:text-gold transition-colors"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gold-light/70 hover:text-gold transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gold-light/70">
                <MapPin className="h-5 w-5 mr-2 text-gold" />
                <span>Pasaje Bruch 5612</span>
              </li>
              <li className="flex items-center text-gold-light/70">
                <Phone className="h-5 w-5 mr-2 text-gold" />
                <a
                  href="tel:+5493416615774"
                  className="hover:text-gold transition-colors"
                  aria-label="Llamar al teléfono"
                >
                  +54 9 3416 61-5774
                </a>
              </li>
              <li className="flex items-center text-gold-light/70">
                <Mail className="h-5 w-5 mr-2 text-gold" />
                <a
                  href="mailto:trofeos-gd@hotmail.com.ar"
                  className="hover:text-gold transition-colors"
                  aria-label="Enviar correo electrónico"
                >
                  trofeos-gd@hotmail.com.ar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-6 text-center text-gold-light/50 text-sm">
          <p>
            © {new Date().getFullYear()} TrofeosGD. Todos los derechos
            reservados.
          </p>
          <p className="text-sm text-gray-500 font-semibold">
            Powered by{" "}
            <a
              href="https://lumarsoft.com/es"
              target="_blank"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:underline"
            >
              LumarSoft
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
