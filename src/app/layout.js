import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Leilances",
  description: "Participe de leilões virtuais em tempo real",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className} class={"bg-gray-300"}>
        <noscript><meta httpEquiv="refresh" content="1; /noscript"></meta></noscript>
        <header class={"text-center py-4"}>
          <h1 class={"text-2xl font-bold"}><a href="/">LEILANCES</a></h1>
        </header>
        <main>
          {children}
        </main>
        <footer class={"text-center py-4"}>
          <p>&copy; Leilances Ltda. 2024</p>
        </footer>
      </body>
    </html>
  );
}
