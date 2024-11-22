import React from "react";
import classNames from "classnames/bind";
import styles from "./AllProduct.module.scss";

const cx = classNames.bind(styles);

const AllProduct = () => {
  const products = [
    {
      name: "Adidas Ultra Boost",
      image: "https://via.placeholder.com/150",
      price: 110.4,
      summary: "Long distance running requires a lot from athletes.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Forum Exhibit Low",
      image: "https://via.placeholder.com/150",
      price: 74.0,
      summary: "Comfortable sneakers for everyday wear.",
      sales: 109,
      remaining: 1500,
    },
    {
      name: "Ultraboost Cleats",
      image: "https://via.placeholder.com/150",
      price: 800.4,
      summary: "High-performance footwear for athletes.",
      sales: 1269,
      remaining: 1269,
    },
    {
      name: "Adizero SL Running",
      image: "https://via.placeholder.com/150",
      price: 64.4,
      summary: "Lightweight running shoes for speed and comfort.",
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
            <p className={cx("price")}>${product.price.toFixed(2)}</p>
            <p className={cx("summary")}>{product.summary}</p>
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
