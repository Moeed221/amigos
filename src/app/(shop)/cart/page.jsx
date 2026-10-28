import {Suspense} from 'react';
import {CartPage} from '../../../components/ShopPages';
export const metadata={title:"Cart | Amigos Mexican Grill"};
export default function Page(){return <Suspense fallback={<p className="shop-loading" role="status">Loading…</p>}><CartPage/></Suspense>}
