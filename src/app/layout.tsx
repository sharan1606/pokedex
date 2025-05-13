import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokédex App",
  description: "A Next.js application to explore Pokémon data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="container py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
