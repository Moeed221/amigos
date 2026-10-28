export const metadata = {
  title: "Amigo's Mexican Grill — Mexican × Thai × Fast Food, delivered",
  description: "Amigo's Mexican Grill — 124 dishes of Mexican, Thai and fast food. Fresh, fast and full of fuego.",
  icons: { icon: '/assets/logo-sm.png' },
  openGraph: { title: "Amigo's Mexican Grill", description: 'Mexican × Thai × Fast Food.', images: ['/assets/hero.jpg'] }
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#150f0c' };
export default function RootLayout({ children }) { return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html: "try{var t=localStorage.getItem('amigos_theme')==='dark'?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}"}} /></head><body>{children}</body></html>; }
