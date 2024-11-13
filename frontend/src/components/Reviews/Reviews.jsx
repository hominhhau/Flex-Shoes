import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

import styles from './Reviews.module.scss';
import Image from '../Image';
import Button from '../Button';

const cx = classNames.bind(styles);

const reviews = [
    {
        name: 'Good Quality',
        text: 'I highly recommend shopping from kicks',
        rating: 5.0,
        avatar: '/placeholder.svg?height=40&width=40',
    },
    {
        name: 'Good Quality',
        text: 'I highly recommend shopping from kicks',
        rating: 5.0,
        avatar: '/placeholder.svg?height=40&width=40',
    },
    {
        name: 'Good Quality',
        text: 'I highly recommend shopping from kicks',
        rating: 5.0,
        avatar: '/placeholder.svg?height=40&width=40',
    },
];

const sneakerImages = [
    './src/assets/images/reviews/reviews1.png',
    './src/assets/images/reviews/reviews2.png',
    './src/assets/images/reviews/reviews3.png',
];

function Reviews() {
    return (
        <div className=" pt-6 md:pt-8 lg:pt-12">
            <div className="w-full mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-[74px] font-semibold ">REVIEWS</h2>
                    <Button primary className="w-[200px] text-center">
                        SEE ALL
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-white p-6 rounded-t-[24px] shadow-md">
                            <div className="flex flex-row items-center mb-4">
                                <Image
                                    src={review.avatar}
                                    alt="User avatar"
                                    className="w-14 h-14 rounded-full mr-4"
                                    fallBack="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
                                />
                                <div>
                                    <h3 className="font-semibold text-[14px]">{review.name}</h3>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <FontAwesomeIcon
                                                key={i}
                                                icon={faStar}
                                                className="w-6 h-6 text-yellow-400"
                                            />
                                        ))}
                                        <span className="ml-2 text-[14px] text-gray-600">
                                            {review.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600">{review.text}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sneakerImages.map((src, index) => (
                        <Image
                            key={index}
                            src={src}
                            alt={`Sneaker ${index + 1}`}
                            className="w-full h-auto rounded-b-[24px] shadow-md"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Reviews;
