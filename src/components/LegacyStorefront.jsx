import OrderControls from './OrderControls';
import Navigation from './storefront/Navigation';
import Hero from './storefront/Hero';
import Categories from './storefront/Categories';
import Offers from './storefront/Offers';
import Menu from './storefront/Menu';
import Tracking from './storefront/Tracking';
import About from './storefront/About';
import Reviews from './storefront/Reviews';
import CallToAction from './storefront/CallToAction';
import Footer from './storefront/Footer';
import Cart from './storefront/Cart';
import Checkout from './storefront/Checkout';
import OrderSuccess from './storefront/OrderSuccess';
import StorefrontController from './StorefrontController';
export default function Storefront() {
  return <><link rel="stylesheet" href="/css/site.css" /><link rel="stylesheet" href="/css/ordering.css" /><Navigation /><main id="top"><OrderControls /><Hero /><Categories /><Menu /><Offers /><Tracking /><About /><Reviews /><CallToAction /></main><Footer /><Cart /><Checkout /><OrderSuccess /><StorefrontController /></>;
}
