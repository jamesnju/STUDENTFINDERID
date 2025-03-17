import type { Metadata } from "next";
import { Arsenal_SC, EB_Garamond, Roboto_Mono } from "next/font/google"; // Import your fonts
import "./globals.css";
import  { Toaster } from "react-hot-toast";

const arsenalSC = Arsenal_SC({
  weight: "400",
  variable: "--font-arsenal-sc", // Set a custom CSS variable for Arsenal SC
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond", // Set a custom CSS variable for EB Garamond
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono", // Set a custom CSS variable for Roboto Mono
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STUDENTID FINDER",
  description: "Lost and found items",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${arsenalSC.variable} ${ebGaramond.variable} ${robotoMono.variable} antialiased`} // Apply the custom fonts globally
      >
        {children}
        <Toaster   position="top-right"
 reverseOrder={false} />
      </body>
    </html>
  );
}
