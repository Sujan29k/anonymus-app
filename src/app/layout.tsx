// src/app/layout.tsx
"use client"; // Make sure this layout is a client component if it uses SessionProvider

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  // Adjust the path as needed
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
