import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saúde Emocional no Relacionamento | Teste de Autoconhecimento",
  description: "Descubra como sua história está afetando seu relacionamento. Avaliação completa baseada em psicanálise freudiana para mulheres que buscam saúde emocional.",
  keywords: ["saúde emocional", "relacionamento", "psicanálise", "autoconhecimento", "terapia"],
  openGraph: {
    title: "Saúde Emocional no Relacionamento",
    description: "Avaliação completa de saúde emocional baseada em psicanálise freudiana",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
