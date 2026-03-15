import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer bg-gray-100/50 backdrop-blur-sm shadow-sm mt-auto border-t border-gray-200">
      <div className="mx-auto w-full max-w-7xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="self-center text-xl font-bold whitespace-nowrap text-rose-500">
                Nivaso
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                Company
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link to="#" className="hover:underline">About</Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">Careers</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                Support
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link to="#" className="hover:underline">Help Center</Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">Safety</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © 2024 Nivaso™. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
            <Link to="#" className="text-gray-500 hover:text-gray-900">
              <FaFacebook className="w-4 h-4" />
              <span className="sr-only">Facebook page</span>
            </Link>
            <Link to="#" className="text-gray-500 hover:text-gray-900">
              <FaInstagram className="w-4 h-4" />
              <span className="sr-only">Instagram page</span>
            </Link>
            <Link to="#" className="text-gray-500 hover:text-gray-900">
              <FaTwitter className="w-4 h-4" />
              <span className="sr-only">Twitter page</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
