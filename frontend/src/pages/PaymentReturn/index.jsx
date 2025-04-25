import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Api_Payment } from '../../../apis/Api_Payment';

const PaymentReturn = () => {
    const [searchParams] = useSearchParams(); // Lấy tham số từ URL
    const navigate = useNavigate(); // Dùng để điều hướng
    const [loading, setLoading] = useState(true); // Quản lý trạng thái loading

    useEffect(() => {
        const processPaymentReturn = async () => {
            try {
                // Lấy tất cả tham số từ URL
                const params = {
                    vnp_Amount: searchParams.get('vnp_Amount'),
                    vnp_BankCode: searchParams.get('vnp_BankCode'),
                    vnp_OrderInfo: searchParams.get('vnp_OrderInfo'),
                    vnp_ResponseCode: searchParams.get('vnp_ResponseCode'),
                    vnp_TxnRef: searchParams.get('vnp_TxnRef'),
                    vnp_PayDate: searchParams.get('vnp_PayDate'),
                    vnp_TransactionNo: searchParams.get('vnp_TransactionNo'),
                    vnp_SecureHash: searchParams.get('vnp_SecureHash'),
                };

                // Gọi API để xử lý thông tin trả về từ VNPAY
                const response = await Api_Payment.payment_return(params);

                if (response.status === 'ok') {
                    // Nếu thanh toán thành công, điều hướng đến trang xác nhận
                    navigate('/order-confirmation', {
                        state: {
                            invoiceId: params.vnp_TxnRef,
                            amount: parseInt(params.vnp_Amount) / 100, // Chuyển từ định dạng tiền VNP
                            bankCode: params.vnp_BankCode,
                            orderInfo: params.vnp_OrderInfo,
                            transactionNo: params.vnp_TransactionNo,
                            payDate: params.vnp_PayDate,
                        },
                    });
                } else {
                    // Nếu thanh toán không thành công, điều hướng đến trang lỗi
                    navigate('/payment-failed');
                }
            } catch (error) {
                console.error('Error processing payment return:', error);
                // Nếu có lỗi, điều hướng đến trang lỗi
                navigate('/payment-failed');
            } finally {
                setLoading(false); // Kết thúc trạng thái loading
            }
        };

        processPaymentReturn(); // Gọi hàm xử lý thanh toán khi component mount
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang xử lý thanh toán...</p>
                </div>
            </div>
        );
    }

    return null; // Không hiển thị gì nếu không cần
};

export default PaymentReturn;
