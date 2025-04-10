import { Modal, Button, Form, Card } from 'react-bootstrap';
import { useState } from 'react';

export const SearchProductModal = ({ show, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    {
      name: "Áo thun basic",
      price: "250.000 VND",
      sizes: ["S", "M", "L"],
      colors: ["Đen", "Trắng", "Xám"]
    },
    {
      name: "Quần jeans slim",
      price: "450.000 VND",
      sizes: ["28", "30", "32"],
      colors: ["Xanh đậm", "Xanh nhạt"]
    },
    {
      name: "Giày sneaker",
      price: "750.000 VND",
      sizes: ["39", "40", "41"],
      colors: ["Trắng", "Đen"]
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép!');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              const productText = `Tên: ${product.name}\nGiá: ${product.price}\nSize: ${product.sizes.join(', ')}\nMàu: ${product.colors.join(', ')}`;
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
