# Natural Chef · Tienda online

App de pedidos con stock por sucursal, hecha en Next.js + Supabase, lista para Vercel.

## Estado (vamos por fases)
- ✅ Fase 1: base de datos (Supabase) — `schema.sql`
- ✅ Fase 2: login admin + Sucursales (datos, horarios por día, envío)
- ✅ Fase 2b: Categorías + Productos (precio, descripción, cantidad, gramos) + Stock por sucursal
- ⬜ Fase 3: tienda del cliente (sucursal, carrito, checkout)
- ⬜ Fase 4: panel de pedidos
- ⬜ Fase 5: Mercado Pago

## Variables de entorno
Copiá `.env.local.example` a `.env.local` y completá:

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — clave pública (anon / publishable)
- `SUPABASE_SERVICE_ROLE_KEY` — clave secreta (service_role) · **solo servidor, nunca al front**
- `ADMIN_PASSWORD` — contraseña para entrar al panel
- `ADMIN_TOKEN` — texto largo al azar (secreto interno de sesión)

## Probar en local
```bash
npm install
cp .env.local.example .env.local   # completá las variables
npm run dev
```
- Tienda: http://localhost:3000
- Panel: http://localhost:3000/admin

## Subir a Vercel
1. Subí esta carpeta a un repo de GitHub.
2. vercel.com → Add New → Project → importá el repo.
3. Cargá las 5 variables de entorno (las mismas de arriba).
4. Deploy.
