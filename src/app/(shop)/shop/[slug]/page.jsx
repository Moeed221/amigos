import {sauces} from '../../../../data/sauce-products';
import {SauceDetail} from '../../../../components/bucks/ReferencePages';
export function generateStaticParams(){return sauces.map(p=>({slug:p.slug}))}
export default async function Page({params}){const {slug}=await params;return <SauceDetail slug={slug}/>}
