import Home from '../pages/Home';
import Search from '../pages/Search';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import ProductDetail from '../pages/productdetail';
import Listing from '../pages/Listing';
import Login from '../pages/Login';
import Register from '../pages/Register';

// admin
import Dashboard from '../pages/admin/Dashboard';
import PaymentReturn from '../pages/PaymentReturn';
import OrderConfirmation from '../pages/OrderConfirmation';
import PurchasedProductsList from '../pages/PurchasedProductsList';
import ProductForm from '../pages/admin/ProductDetails/ProductForm';
import ProductDetails from '../pages/admin/ProductDetails';
import OrderDetails from '../pages/admin/OrderDetails';

import AddNewProduct from '../pages/admin/AddNewProduct';

import config from '../config';
import CheckoutForm from '../pages/Checkout';
import ManagerCustomer from '../pages/admin/ManagerCustomer';

// AllProduct
import AllProduct from '../pages/admin/Allproduct/Allproduct';

const publicRoutes = [
    { path: config.routes.main, component: Home },
    // { path: config.routes.home, component: Home },
    { path: config.routes.productdetail, component: ProductDetail },
    { path: config.routes.listing, component: Listing },
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.cart, component: Cart },
    { path: config.routes.checkout, component: Checkout },
    { path: config.routes.search, component: Search },
    { path: config.routes.purchasedProductsList, component: PurchasedProductsList },
    { path: config.routes.login, component: Login },
    { path: config.routes.register, component: Register },
    { path: config.routes.dashboard, component: Dashboard },
    { path: '/payment-return', component: PaymentReturn },
    // { path: 'payment-failed', component: PaymentReturn },
    { path: '/order-confirmation', component: OrderConfirmation },
    { path: config.routes.managerCustomer, component: ManagerCustomer },

    // { path: config.routes.ProductDetails, component: ProductDetails },

    // AllProduct
    { path: config.routes.AllProduct, component: AllProduct },
    { path: config.routes.ProductDetails, component: ProductForm },
    //admin
    { path: config.routes.OrderDetails, component: OrderDetails },
    { path: config.routes.addNewProduct, component: AddNewProduct },
    { path: '/payment-failed', component: Home },
];
const privateRoutes = [];
export { privateRoutes, publicRoutes };
