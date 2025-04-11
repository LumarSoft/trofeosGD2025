// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Cliente para uso en el lado del servidor (con la clave de servicio, que tiene permisos elevados)
export function getServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Faltan las variables de entorno de Supabase");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Cliente para uso en el navegador (con la clave anónima, permisos limitados)
export function getClientSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan las variables de entorno de Supabase");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
