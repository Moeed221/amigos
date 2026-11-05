export const metadata = {
 metadataBase:new URL('https://amigos-flavour-preview.faizan-ajmal.chatgpt.site'),
 title:'Amigos — Fresh. Fast. Fuego.',
 description:'Burgers, Mexican favourites, Thai dishes and crispy classics. Explore the Amigos restaurant menu, customise your meal and choose delivery or pickup.',
 icons:{icon:'/assets/logo-sm.png'},
 openGraph:{title:'Amigos — Fresh. Fast. Fuego.',description:'Your favourites. One Amigos table.',images:['/assets/hero.jpg']}
};
export const viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#100b06'};
export default function RootLayout({children}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
