import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World of Health Science Research Centre",
  description: "World of Health Science Research Centre in Kampala, Uganda — an initiative in development focused on responsible research, health education, and scientific collaboration.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
