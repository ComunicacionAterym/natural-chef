import { createClient } from "@supabase/supabase-js";

// Cliente público (anon). Solo lee el catálogo. Se usará en la tienda del cliente.
export function supabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );
}
