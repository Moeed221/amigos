export const metadata = {
  metadataBase: new URL("https://amigos-flavour-preview.faizan-ajmal.chatgpt.site"),
  title: "Amigos — Big flavour. Good company.",
  description: "Four bold sauces. Real ingredients. Find your favourite flavour and build your own three-pack at Amigos.",
  icons: { icon: '/assets/logo-sm.png' },
  openGraph: { title: "Amigos — Big flavour. Good company.", description: 'Four bold sauces. Endless possibilities.', images: ['/assets/logo.png'] }
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#100b06' };
export default function RootLayout({ children }) { return <html lang="en"><body>{children}</body></html>; }
