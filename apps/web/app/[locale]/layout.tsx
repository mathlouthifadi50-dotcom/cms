import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getGlobalSettings } from "@/lib/strapi-client";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MENAPS - Integrated Strategic Consulting",
  description: "Strategic and operational consulting group, with a strong dimension of technological and digital innovation.",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  
  let globalSettings = null;
  try {
    globalSettings = await getGlobalSettings(locale);
  } catch (error) {
    console.error('Failed to fetch global settings:', error);
  }

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${inter.variable} ${raleway.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar navigation={globalSettings?.attributes?.navigation} locale={locale} />
          {children}
          <Footer footer={globalSettings?.attributes?.footer} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
