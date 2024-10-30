import Home from '../pages/Home';
import Search from '../pages/Search';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';

import config from '../config';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.cart, component: Cart },
    { path: config.routes.checkout, component: Checkout },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
