import { ApiManager } from "./ApiManager";



// register

export const Api_Listing = {

    filterProductsByCriteria: async (filterData) => {

        const params = new URLSearchParams({

            colors: filterData.colors.join(','),

            sizes: filterData.sizes.join(','),

            brands: filterData.brands.join(','),

            category: filterData.category.join(','),

            genders: filterData.genders.join(','),

            minPrice: filterData.minPrice,

            maxPrice: filterData.maxPrice,

        }).toString();



        return ApiManager.get(`/api/public/listing-products/filter?${params}`);

    },

}
