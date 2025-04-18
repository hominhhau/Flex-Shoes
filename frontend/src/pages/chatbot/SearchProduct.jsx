import { Modal, Button, Form, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getAllProducts } from "../../redux/chatSlice";
import { useSelector, useDispatch } from "react-redux";

export const SearchProductModal = ({ show, handleClose }) => {
  // const messages = useSelector((state) => state.chat.message);
  const allProducts = useSelector((state) => state.chat.allProducts);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const [products, setProduct] = useState([]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép!');
  };

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchAllProduct = async () => {
    let res = await dispatch(getAllProducts())
    if (res.payload) {
      const enrichedProducts = res.payload
        .filter(product => product.status === "Available")
        .map(product => {
          const sizes = [];
          const colors = [];

          product.inventory.forEach(inv => {
            const sizeName = inv.numberOfProduct?.size?.nameSize;
            const colorName = inv.numberOfProduct?.color?.colorName;

            if (sizeName && !sizes.includes(sizeName)) {
              sizes.push(sizeName);
            }
            if (colorName && !colors.includes(colorName)) {
              colors.push(colorName);
            }
          });

          return {
            ...product,
            sizes,
            colors,
          };
        });

      setProduct(enrichedProducts);
    }

  }

  useEffect(() => {
    fetchAllProduct()
  }, [])

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Tìm kiếm sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Nhập tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => {
              const productText = `Tên: ${product.productName}\nGiá: ${product.sellingPrice}\nSize: ${product.sizes.join(', ')}\nMàu: ${product.colors.join(', ')}`;
              return (
                <Card key={index} className="mb-2">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{productText}</pre>
                    <Button variant="outline-primary" size="sm" onClick={() => copyToClipboard(productText)}>
                      Copy
                    </Button>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <p>Không tìm thấy sản phẩm nào</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
