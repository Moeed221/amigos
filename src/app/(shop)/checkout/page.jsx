import {Suspense} from 'react';
import {CheckoutPage} from '../../../components/ShopPages';
export const metadata={title:"Checkout | Amigos Mexican Grill"};
export default function Page(){return <Suspense fallback={<p className="shop-loading" role="status">Loading…</p>}><CheckoutPage/></Suspense>}
