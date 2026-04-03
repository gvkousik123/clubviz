import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { DirectLoginWrapper } from "@/components/auth/direct-login-wrapper"
import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { DataProvider } from "@/lib/store"
import { ForceLogoutListener } from "@/components/auth/force-logout-listener"
import { ImageViewerProvider } from "@/components/ui/image-viewer-provider"

export const metadata: Metadata = {
  title: "ClubViz - Ultimate Platform for Booking Clubs",
  description: "ClubViz is the ultimate platform for booking clubs, events, and discovering the best nightlife experiences. Book your next club adventure with ease.",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Zen+Tokyo+Zoo&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo/logo.png" />
        <meta name="theme-color" content="#021313" />
        {/* Cashfree SDK for payment gateway integration */}
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
      </head>
      <body className="antialiased bg-background-primary text-text-primary dark">
        <ToastProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
            <ImageViewerProvider>
              <DataProvider>
                <AuthProvider>
                  <DirectLoginWrapper>
                    <main className="min-h-screen max-w-md mx-auto relative overflow-hidden">
                      {children}
                    </main>
                  </DirectLoginWrapper>
                </AuthProvider>
              </DataProvider>
            </ImageViewerProvider>
          </ThemeProvider>
          <Toaster />
          <ForceLogoutListener />
        </ToastProvider>
      </body>
    </html>
  )
}
