import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Api_Payment } from '../../../apis/Api_Payment';

const PaymentReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processPaymentReturn = async () => {
            try {
                // Get all parameters from URL
                const params = {
                    vnp_Amount: searchParams.get('vnp_Amount'),
                    vnp_BankCode: searchParams.get('vnp_BankCode'),
                    vnp_OrderInfo: searchParams.get('vnp_OrderInfo'),
                    vnp_ResponseCode: searchParams.get('vnp_ResponseCode'),
                    vnp_TxnRef: searchParams.get('vnp_TxnRef'),
                    vnp_PayDate: searchParams.get('vnp_PayDate'),
                    vnp_TransactionNo: searchParams.get('vnp_TransactionNo'),
                };

                const response = await Api_Payment.getPaymentInfo(params);

                if (response.status === 'ok') {
                    // Navigate to confirmation page with payment details
                    navigate('/order-confirmation', {
                        state: {
                            invoiceId: params.vnp_TxnRef,
                            amount: parseInt(params.vnp_Amount) / 100, // Convert from VNP amount format
                            bankCode: params.vnp_BankCode,
                            orderInfo: params.vnp_OrderInfo,
                            transactionNo: params.vnp_TransactionNo,
                            payDate: params.vnp_PayDate,
                        },
                    });
                } else {
                    // Handle payment failure
                    navigate('/payment-failed');
                }
            } catch (error) {
                console.error('Error processing payment return:', error);
                navigate('/payment-failed');
            } finally {
                setLoading(false);
            }
        };

        processPaymentReturn();
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

    return null;
};

export default PaymentReturn;
