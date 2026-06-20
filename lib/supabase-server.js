import { createClient } from "@supabase/supabase-js";

// Cliente con la clave SECRETA (service_role). Solo se usa en el servidor.
// Salta las reglas RLS, así que nunca debe llegar al navegador.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
