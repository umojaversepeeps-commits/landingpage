import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const sans = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-sans-local",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Umojaverse — Africa’s builders",
    template: "%s | Umojaverse",
  },
  description: site.description,
  icons: { icon: "/images/icon.png", apple: "/images/icon.png" },
  openGraph: {
    title: "Umojaverse — Africa’s builders",
    description: site.description,
    type: "website",
    siteName: "Umojaverse",
  },
  twitter: {
    card: "summary",
    title: "Umojaverse — Africa’s builders",
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={sans.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
