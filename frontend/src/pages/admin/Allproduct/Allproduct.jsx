import React from "react";
import classNames from "classnames/bind";
import styles from "./AllProduct.module.scss";

const cx = classNames.bind(styles);

const AllProduct = () => {
  const products = [
    {
      name: "Adidas Ultra Boost",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 110.4,
      description: "Long distance running requires a lot from athletes.",
      sales: 1269,
      remaining: 1269,

    },
    {
      name: "Forum Exhibit Low",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 74.0,
      description: "Comfortable sneakers for everyday wear.",
      sales: 109,
      remaining: 1500,
    },
    {
      name: "Ultraboost Cleats",
      brand: "Nike",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 800.4,
      description: "High-performance footwear for athletes.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Adizero SL Running",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 64.4,
      description: "Lightweight running shoes for speed and comfort.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Adidas Ultra Boost",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 110.4,
      description: "Long distance running requires a lot from athletes.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Forum Exhibit Low",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 74.0,
      description: "Comfortable sneakers for everyday wear.",
      sales: 109,
      remaining: 1500,
    },
    {
      name: "Ultraboost Cleats",
      brand: "Nike",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 800.4,
      description: "High-performance footwear for athletes.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Adizero SL Running",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 64.4,
      description: "Lightweight running shoes for speed and comfort.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Adidas Ultra Boost",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 110.4,
      description: "Long distance running requires a lot from athletes.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Forum Exhibit Low",
      brand: "Adidas",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 74.0,
      description: "Comfortable sneakers for everyday wear.",
      sales: 109,
      remaining: 1500,
    },
    {
      name: "Ultraboost Cleats",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 800.4,
      description: "High-performance footwear for athletes.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Adizero SL Running",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 64.4,
      description: "Lightweight running shoes for speed and comfort.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Adidas Ultra Boost",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 110.4,
      description: "Long distance running requires a lot from athletes.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Forum Exhibit Low",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 74.0,
      description: "Comfortable sneakers for everyday wear.",
      sales: 109,
      remaining: 1500,
    },
    {
      name: "Ultraboost Cleats",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 800.4,
      description: "High-performance footwear for athletes.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Adizero SL Running",
      brand: "Adidas",
      image: "https://product.hstatic.net/1000150581/product/1124a7790-2__1_-2_5cc708555e894a9f8ab32abbeeff8a6c.jpg",
      price: 64.4,
      description: "Lightweight running shoes for speed and comfort.",
      sales: 1269,
      remaining: 1269,
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h1>All Products</h1>
        <button className={cx("add-product")}>Add New Product</button>
      </div>
      <div className={cx("product-list")}>
        {products.map((product, index) => (
          <div key={index} className={cx("product-card")}>
            <img
              src={product.image}
              alt={product.name}
              className={cx("product-image")}
            />
            <h2>{product.name}</h2>
            <p>{product.brand}</p>
            <p className={cx("price")}>${product.price.toFixed(2)}</p>
            <p className={cx("description")}>{product.description}</p>
            <div className={cx("stats")}>
              <div>
                <p>Sales</p>
                <p>{product.sales}</p>
              </div>
              <div>
                <p>Remaining Products</p>
                <p>{product.remaining}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProduct;
