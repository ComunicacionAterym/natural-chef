import { cookies } from "next/headers";

// ¿La sesión de admin es válida? (cookie == ADMIN_TOKEN)
export function isAuthed() {
  const v = cookies().get("nc_admin")?.value;
  return Boolean(v) && v === process.env.ADMIN_TOKEN;
}
