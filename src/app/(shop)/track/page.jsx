import {Suspense} from 'react';
import TrackingPage from '../../../components/TrackingPage';
export const metadata={title:'Track your order | Amigos Mexican Grill',robots:{index:false,follow:false}};
export default function Page(){return <Suspense fallback={<p className="shop-loading" role="status">Loading tracking…</p>}><TrackingPage/></Suspense>}
