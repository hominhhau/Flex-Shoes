import { Modal, Button, Form, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getAllProducts } from "../../redux/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { getMessages, sendMessages } from "../../redux/chatSlice";

export const SearchProductModal = ({ senderID, show, handleClose }) => {
  // const messages = useSelector((state) => state.chat.message);
  const allProducts = useSelector((state) => state.chat.allProducts);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const [products, setProduct] = useState([]);

  const sendToClipboard = async (text, images, productId) => {
    let res1 = await dispatch(sendMessages({ clientId: senderID, senderId: 1, message: text , type: "text" , productId: ""}));
    let res2 = await dispatch(sendMessages({ clientId: senderID, senderId: 1, message: images[0].imageID.URL , type: "image" , productId: productId }));

    if (res1.meta.requestStatus === "fulfilled" && res2.meta.requestStatus === "fulfilled") {
      await dispatch(getMessages({ senderID }));
      handleClose();
    }
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
              const productText = `Tên sản phẩm: ${product.productName}\nGiá: ${product.sellingPrice}\nSize: ${product.sizes.join(', ')}\nMàu: ${product.colors.join(', ')}`;
              return (
                <Card key={index} className="mb-2">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{productText}</pre>
                    <Button variant="outline-primary" size="sm" onClick={() => sendToClipboard(productText, product.image, product._id)}>
                      Gửi
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
