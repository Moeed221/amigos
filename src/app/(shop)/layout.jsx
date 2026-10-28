import {ShopProvider} from '../../components/ShopProvider';
import ShopShell from '../../components/ShopShell';
export default function ShopLayout({children}) {return <><link rel="stylesheet" href="/css/site.css"/><link rel="stylesheet" href="/css/shop.css"/><ShopProvider><ShopShell>{children}</ShopShell></ShopProvider></>}
