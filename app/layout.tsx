import type React from "react";
import "@/app/globals.css";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Evergreen Technologies",
  description:
    "We partner with you to create transformative digital experiences. Our expert team offers creative designs, custom solutions, and end-to-end support.",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${poppins.variable}`}>
      <body className="font-poppins">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import "./globals.css";
