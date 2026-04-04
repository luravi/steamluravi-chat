export const metadata = {
  title: 'STEAMLURAVI',
  description: 'Profesor experto en educación STEAM',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
