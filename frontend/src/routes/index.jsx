import Home from '../pages/Home';
import Search from '../pages/Search';
import ProductDetail from '../pages/productdetail';
import config from '../config';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    {path:config.routes.productdetail,component: ProductDetail},
    { path: config.routes.search, component: Search },
    // { path: config.routes.search, component: Search, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
