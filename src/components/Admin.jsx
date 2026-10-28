import AdminLogin from './admin/AdminLogin';
import AdminShell from './admin/AdminShell';
import ItemModal from './admin/ItemModal';
import OfferModal from './admin/OfferModal';
import AdminController from './AdminController';
export default function Admin() { return <><link rel="stylesheet" href="/css/admin.css" /><AdminLogin /><AdminShell /><ItemModal /><OfferModal /><AdminController /></>; }
