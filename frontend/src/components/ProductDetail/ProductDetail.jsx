import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL

    // Kiểm tra xem ID có phải là undefined không
    if (!id) {
        console.error('Product ID is undefined');
        return <div>Product not found</div>;
    }

    // Tiến hành lấy dữ liệu sản phẩm dựa trên ID
    // ...

    return <div>{/* Hiển thị thông tin sản phẩm */}</div>;
};

export default ProductDetail;
