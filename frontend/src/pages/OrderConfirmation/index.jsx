import { useLocation, Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
// import { useAuth } from '../../hooks/useAuth';

const OrderConfirmation = () => {
    // const { id } = useParams();
    // const { isLoggedIn, role } = useAuth()
    const { state } = useLocation();
    const { invoiceId, amount, bankCode, orderInfo, transactionNo, payDate } = state || {};

    // Format payDate từ YYYYMMDDHHmmss sang định dạng đẹp hơn
    const formatPayDate = (dateString) => {
        if (!dateString) return '';
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        const hour = dateString.substring(8, 10);
        const minute = dateString.substring(10, 12);
        const second = dateString.substring(12, 14);
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-green-600 mb-2">
                        Thanh toán thành công!
                    </h1>
                    <p className="text-gray-600">
                        Cảm ơn bạn đã mua hàng. Dưới đây là chi tiết đơn hàng của bạn.
                    </p>
                </div>

                <div className="border-t border-b py-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-gray-600">Mã đơn hàng:</div>
                        <div className="font-semibold">{invoiceId}</div>

                        <div className="text-gray-600">Số tiền:</div>
                        <div className="font-semibold">{formatCurrency(amount)}</div>

                        <div className="text-gray-600">Ngân hàng:</div>
                        <div className="font-semibold">{bankCode}</div>

                        <div className="text-gray-600">Nội dung thanh toán:</div>
                        <div className="font-semibold">{orderInfo}</div>

                        <div className="text-gray-600">Mã giao dịch:</div>
                        <div className="font-semibold">{transactionNo}</div>

                        <div className="text-gray-600">Thời gian thanh toán:</div>
                        <div className="font-semibold">{formatPayDate(payDate)}</div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Tiếp tục mua sắm
                    </Link>
                    <Link
                        to="/purchasedProductsList/1"
                        className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors ml-4"
                    >
                        Historry oders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation; 