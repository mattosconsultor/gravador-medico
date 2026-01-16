import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Gravador Médico",
  description: "Método VoicePen para prontuários médicos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white">{children}</body>
    </html>
  )
}
