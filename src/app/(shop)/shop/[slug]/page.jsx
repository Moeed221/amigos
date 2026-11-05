import {menuSeed,dishSlug} from '../../../../data/restaurant-menu';
import {FoodDetail} from '../../../../components/bucks/ReferencePages';
export function generateStaticParams(){return menuSeed.map(p=>({slug:dishSlug(p)}))}
export default async function Page({params}){const {slug}=await params;const dish=menuSeed.find(p=>dishSlug(p)===slug);return <FoodDetail id={dish?.id}/>}
