import React from "react";
import PropTypes from "prop-types"; // Để định nghĩa kiểu dữ liệu của props
import styles from "./Modal.module.scss";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Icon tích xanh

function Modal({ title, message, onConfirm, onCancel, contentButtonRight, contentButtonLeft }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <AiOutlineCheckCircle className={styles.icon} />
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles.actions}>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        {contentButtonLeft}
                    </button>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        {contentButtonRight}
                    </button>
                </div>
            </div>
        </div>
    );
}

Modal.propTypes = {
    title: PropTypes.string.isRequired, // Tiêu đề modal
    message: PropTypes.string.isRequired, // Nội dung thông báo
    onConfirm: PropTypes.func.isRequired, // Hàm xử lý nút xác nhận
    onCancel: PropTypes.func.isRequired, // Hàm xử lý nút hủy
    contentButtonRight: PropTypes.string, // Nội dung nút bên phải
    contentButtonLeft: PropTypes.string, // Nội dung nút bên trái
};

export default Modal;
