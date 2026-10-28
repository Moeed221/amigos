import {Suspense} from 'react';
import {ProductPage} from '../../../components/ShopPages';
export const metadata={title:"Product | Amigos Mexican Grill"};
export default function Page(){return <Suspense fallback={<p className="shop-loading" role="status">Loading…</p>}><ProductPage/></Suspense>}
