import {Suspense} from 'react';
import {LoginPage} from '../../../components/ShopPages';
export const metadata={title:"Login | Amigos Mexican Grill"};
export default function Page(){return <Suspense fallback={<p className="shop-loading" role="status">Loading…</p>}><LoginPage/></Suspense>}
