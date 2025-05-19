import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons';
import classNames from 'classnames/bind';

import Button from '../../../components/Button';
import Image from '../../../components/Image';
import { LogoWhiteIcon, LogoWhiteLargeIcon } from '../../../icons';

import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className="bg-blue-600 text-white w-100 my-20">
            <div className="bg-blue-600 p-8 h-[340px] flex items-center">
                <div className="container mx-auto px-4 flex items-center">
                    <div className="flex flex-col md:flex-col items-start w-[50%]">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-[48px] font-bold">JOIN OUR KICKSPLUS CLUB & GET 15% OFF</h2>
                            <p className="text-[20px]">Sign up for free! Join the community.</p>
                        </div>
                    </div>
                    <div className="mx-auto">
                        <LogoWhiteIcon />
                    </div>
                </div>
            </div>
            <div className=" w-full pt-8 bg-[#232321] h-[438px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="p-10">
                        <h3 className="text-[36px] font-bold text-[#FFA52F] mb-4">About us</h3>
                        <p>
                            We are the biggest hyperstore in the universe. We got you all cover with our exclusive
                            collections and latest drops.
                        </p>
                    </div>
                    <div className="flex justify-between p-10">
                        <div>
                            <h3 className="text-[24px] font-bold text-[#FFA52F] mb-4">Categories</h3>
                            <ul>
                                {['Runners', 'Sneakers', 'Basketball', 'Outdoor', 'Golf', 'Hiking'].map((item) => (
                                    <li key={item} className="mb-2">
                                        <a href="#" className="hover:text-[#FFA52F] ">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-[24px] font-bold text-[#FFA52F] mb-4">Company</h3>
                            <ul>
                                {['About', 'Contact', 'Blogs'].map((item) => (
                                    <li key={item} className="mb-2">
                                        <a href="#" className="hover:text-[#FFA52F] ">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-[24px] font-bold text-[#FFA52F] mb-4">Follow us</h3>
                            <div className="flex space-x-6">
                                {[
                                    { icon: faFacebookF, label: 'Facebook' },
                                    { icon: faInstagram, label: 'Instagram' },
                                    { icon: faTwitter, label: 'Twitter' },
                                    { icon: faTiktok, label: 'TikTok' },
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href="#"
                                        className="hover:text-[#FFA52F] "
                                        aria-label={social.label}
                                    >
                                        <FontAwesomeIcon icon={social.icon} size="lg" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-[40px] flex justify-center items-center">{/* <LogoWhiteLargeIcon /> */}</div>
            </div>
        </footer>
    );
}

export default Footer;
