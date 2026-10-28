import {Suspense} from 'react';
import {MenuPage} from '../../components/ShopPages';
export default function Page(){return <Suspense fallback={<p className="shop-loading" role="status">Loading…</p>}><MenuPage/></Suspense>}
