import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gold/20 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-gold font-bold text-lg mb-4">PREMIUM TROPHIES</h3>
            <p className="text-gold-light/70 mb-4">
              Ofrecemos productos de la más alta calidad para reconocer y celebrar los logros más importantes.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gold-light/70 hover:text-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gold-light/70 hover:text-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gold-light/70 hover:text-gold transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-gold font-bold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gold-light/70 hover:text-gold transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gold-light/70 hover:text-gold transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gold-light/70 hover:text-gold transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gold-light/70 hover:text-gold transition-colors">
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
                <span>Av. Principal 1234, Ciudad</span>
              </li>
              <li className="flex items-center text-gold-light/70">
                <Phone className="h-5 w-5 mr-2 text-gold" />
                <span>+123 456 7890</span>
              </li>
              <li className="flex items-center text-gold-light/70">
                <Mail className="h-5 w-5 mr-2 text-gold" />
                <span>info@premiumtrophies.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-6 text-center text-gold-light/50 text-sm">
          <p>© {new Date().getFullYear()} Premium Trophies. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

