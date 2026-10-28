import {Suspense} from 'react';
import {StoresPage} from '../../../components/ShopPages';
export const metadata={title:"Stores | Amigos Mexican Grill"};
export default function Page(){return <Suspense fallback={<p className="shop-loading" role="status">Loading…</p>}><StoresPage/></Suspense>}
