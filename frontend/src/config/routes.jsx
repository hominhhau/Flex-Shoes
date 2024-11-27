import OrderDetails from "../pages/admin/OrderDetails/OrderDetails";

const routes = {
    main: '/',
    C: '/',
    // productdetail: '/productdetail',
    home: '/',
    //productdetail: '/productdetail',
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
    OrderDetails: '/OrderDetails',

    // AllProduct
    AllProduct: '/AllProduct',
};

export default routes;
