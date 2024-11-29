import OrderDetails from '../pages/admin/OrderDetails/OrderDetails';

const routes = {
    main: '/',


    home: '/home',
    productdetail: '/productdetail',

    home: '/',

    C: '/',

    // productdetail: '/productdetail',
    productdetail: '/productdetail/:id',
    listing: '/listing',
    search: '/search',
    product: '/product',
    login: '/login',
    register: '/register',
    // admin
    dashboard: '/dashboard',
    purchasedProductsList: '/purchasedProductsList/:id',
    cart: '/cart',
    checkout: '/checkout',
    managerCustomer: '/managerCustomer',
    ProductDetails: '/ProductDetails',
    OrderDetails: '/OrderDetails',
    addNewProduct: '/addNewProduct',

    // AllProduct
    AllProduct: '/AllProduct',
};

export default routes;
