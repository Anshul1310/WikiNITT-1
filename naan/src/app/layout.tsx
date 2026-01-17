import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Wikinitt - The Community Platform for NITT",
  description:
    "Wikinitt is a community platform for students of NIT Trichy to connect, share, and discuss.",
};

import { SetupModal } from "@/components/SetupModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SetupModal />
          <Navbar>
            {children}
            <Footer />
          </Navbar>
        </Providers>
      </body>
    </html>
  );
}
