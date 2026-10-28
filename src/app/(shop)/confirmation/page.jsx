import {Suspense} from 'react';
import {ConfirmationPage} from '../../../components/ShopPages';
export const metadata={title:"Confirmation | Amigos Mexican Grill"};
export default function Page(){return <Suspense fallback={<p className="shop-loading" role="status">Loading…</p>}><ConfirmationPage/></Suspense>}
