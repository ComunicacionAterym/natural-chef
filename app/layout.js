import "./globals.css";

export const metadata = {
  title: "Natural Chef",
  description: "Pedidos online · Natural Chef",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
