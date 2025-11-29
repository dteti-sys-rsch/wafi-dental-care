import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import LayoutWrapper from "../components/layouts/LayoutWrapper";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Dental Management System",
  description: "Dental Management System by FT UGM",
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getTheme() {
                  const stored = localStorage.getItem('theme');
                  if (stored === 'light' || stored === 'dark') return stored;
                  if (stored === 'system' || !stored) {
                    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  return 'dark';
                }
                const theme = getTheme();
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`antialiased ${jakarta.variable}`}>
        <ToastContainer />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
