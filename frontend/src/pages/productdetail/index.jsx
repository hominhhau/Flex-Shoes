import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./productdetail.module.scss";
import { Api_Product } from "../../../apis/Api_Product";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

// Map color names to hex color codes
const colors = {
  Red: "#FF0000",
  Blue: "#0000FF",
  Green: "#008000",
  Black: "#000000",
  White: "#FFFFFF",
  Gray: "#808080",
  Yellow: "#FFFF00",
  Pink: "#FFC0CB",
  Brown: "#A52A2A",
  Purple: "#800080",
};

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [productDetail, setProductDetail] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await Api_Product.getProductDetail(id);
        if (response) {
          setProductDetail(response);

          // Set default color and size
          if (response.colors && response.colors.length > 0) {
            setSelectedColor(response.colors[0].colorId);
          }
          if (response.sizes && response.sizes.length > 0) {
            setSelectedSize(response.sizes[0].sizeId);
          }
        } else {
          setError("Product data not found.");
        }
      } catch (error) {
        setError("Error fetching product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!productDetail) {
    return <div>No product details available.</div>;
  }

  // Remove duplicate colors and sizes
  const uniqueColors = Array.from(
    new Set(productDetail.colors.map(color => color.colorId))
  ).map(id => productDetail.colors.find(color => color.colorId === id));

  const uniqueSizes = Array.from(
    new Set(productDetail.sizes.map(size => size.sizeId))
  ).map(id => productDetail.sizes.find(size => size.sizeId === id));

  return (
    <div className={cx("wrapper")}>
      <div className={cx("content-header")}>
        <div className={cx("product-images")}>
          <img
            src={productDetail.images[selectedImage]}
            alt={productDetail.productName}
            className={cx("main-image")}
          />
          <div className={cx("thumbnail-container")}>
            {productDetail.images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`${productDetail.productName} thumbnail ${index + 1}`}
                className={cx("thumbnail", {
                  active: selectedImage === index,
                })}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className={cx("product-info")}>
          <span className={cx("status")}>{productDetail.status}</span>
          <h1 className={cx("product-name")}>{productDetail.productName}</h1>
          <p className={cx("product-price")}>
            ${productDetail.salePrice.toFixed(2)}
          </p>
          <div className={cx("color-selection")}>
            <p>COLOR</p>
            <div className={cx("color-options")}>
              {uniqueColors.map((color, index) => (
                <button
                  key={index}
                  className={cx("color-option", {
                    active: selectedColor === color.colorId,
                  })}
                  style={{
                    backgroundColor: colors[color.colorName] || "#000",
                  }}
                  onClick={() => setSelectedColor(color.colorId)}
                ></button>
              ))}
            </div>
          </div>

          <div className={cx("size-selection")}>
            <p>SIZE</p>
            <div className={cx("size-options")}>
              {uniqueSizes.map((size) => (
                <button
                  key={size.sizeId}
                  className={cx("size-option", {
                    active: selectedSize === size.sizeId,
                  })}
                  onClick={() => setSelectedSize(size.sizeId)}
                >
                  {size.sizeName}
                </button>
              ))}
            </div>
          </div>

          <div className={cx("product-actions")}>
            <button className={cx("add-to-cart")}>ADD TO CART</button>
            <button className={cx("add-to-wishlist")}>♡</button>
            <button
              className={cx("buy-now")}
              onClick={() => {
                if (!selectedSize || !selectedColor) {
                  alert("Please select both size and color before proceeding.");
                  return;
                }

                navigate("/cart", {
                  state: {
                    productId: productDetail.id,
                    name: productDetail.productName,
                    size: selectedSize.sizeName,
                    color: selectedColor.colorName,
                    price: productDetail.salePrice,
                    image: productDetail.images[0],
                  },
                });
              }}
            >
              BUY IT NOW
            </button>
          </div>

          <div className={cx("product-description")}>
            <h2>ABOUT THE PRODUCT</h2>
            <p>{productDetail.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
