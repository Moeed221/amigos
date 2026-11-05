import {ShopProvider} from '../../components/ShopProvider';
import ReferenceShell from '../../components/bucks/ReferenceShell';
export default function ShopLayout({children}) {return <><link rel="stylesheet" href="/css/site.css"/><link rel="stylesheet" href="/css/shop.css"/><link rel="stylesheet" href="/css/bucks.css"/><link rel="stylesheet" href="/css/restaurant.css"/><ShopProvider><ReferenceShell>{children}</ReferenceShell></ShopProvider></>}
