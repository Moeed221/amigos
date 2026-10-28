import {Suspense} from 'react';
import {LocationPage} from '../../../components/ShopPages';
export const metadata={title:"Location | Amigos Mexican Grill"};
export default function Page(){return <Suspense fallback={<p className="shop-loading" role="status">Loading…</p>}><LocationPage/></Suspense>}
