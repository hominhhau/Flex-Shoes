import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import config from '../../config';

import Button from '../../components/Button';
import Image from '../../components/Image';
import ProductList from '../../components/ProductList';
import SlideShow from '../../components/SlideShow';
import Reviews from '../../components/Reviews';
import CategoriesShow from '../../layouts/components/CategoriesShow';

import styles from './Home.module.scss';
import ChatBot from '../chatbot/ChatBot';
import ChatAiGpt from '../chatbot/ChatAiGpt'

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('wrapper')}>
            {/* <Link to={config.routes.search}>
                <Button viewProduct>Hi</Button>
            </Link> */}

            <div className={cx('content')}>
                <div className={cx('content-header')}>
                    <div className={cx('header-title')}>
                        <span>
                            DO IT <span className="text-[#4a69e2]">RIGHT</span>
                        </span>
                    </div>
                    <SlideShow />
                </div>

                <div className={cx('content-product')}>
                    <div className={cx('product-header')}>
                        <h1 className={cx('product-header-title', 'w-[700px]')}>DON'T MISS OUT NEW DROPS</h1>
                        <div>
                            <Link to={config.routes.listing}>
                                <Button primary className="w-[200px]">
                                    <span>SHOP NEW DROPS</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <ProductList columns={4} />
                </div>
                <div className={cx('content-categories')}>
                    <CategoriesShow />
                </div>
                <div className={cx('content-reviews')}>
                    <Reviews />
                </div>
            </div>
        
        <ChatBot />
        <ChatAiGpt />

        </div>
    );
}

export default Home;
