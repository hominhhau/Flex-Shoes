import ProductDetail from '../pages/productdetail';

const routes = {
    main: '/',
    home: '/home',
    // productdetail: '/productdetail',
    home: '/',
    // productdetail: '/productdetail',
    productdetail: '/productdetail/:id',
    listing: '/listing',
    search: '/search',
    product: '/product',
    login: '/login',
    register: '/register',

    // admin
    dashboard: '/dashboard',
    purchasedProductsList: '/purchasedProductsList',
    cart: '/cart',
    checkout: '/checkout',
    ProductDetails: '/ProductDetails',

    // AllProduct
    AllProduct: '/AllProduct',
};

export default routes;
