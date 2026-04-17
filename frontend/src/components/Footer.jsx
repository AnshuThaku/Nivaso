import { Link } from "react-router-dom";
import { 
  FaInstagram, 
  FaTwitter, 
  FaGithub, 
  FaLinkedin, 
  FaYoutube, 
  FaGlobe 
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          
          {/* Brand Section */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-white tracking-tight">
                Nivaso
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Making travel accessible and stays unforgettable. Discover unique homes and experiences around the world.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {[
                { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: FaGithub, href: "https://github.com", label: "GitHub" },
                { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
                { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
                { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a 
                  key={label}
                  href={href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 bg-gray-800 hover:bg-emerald-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  title={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Company</h3>
            <ul className="space-y-3 text-sm">
              {['About Us', 'Careers', 'Press', 'Blog', 'Investors'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hosting Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Hosting</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Host your home', to: '/listings/new' },
                { label: 'Hosting Resources', to: '#' },
                { label: 'Community Forum', to: '#' },
                { label: 'Host Guidelines', to: '#' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-gray-400 hover:text-emerald-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Support</h3>
            <ul className="space-y-3 text-sm">
              {['Help Center', 'Safety Info', 'Cancellation', 'Trust & Safety', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm text-gray-500">
              <span>© {currentYear} Nivaso, Inc. All rights reserved.</span>
              <div className="flex gap-4">
                <Link to="#" className="hover:text-gray-300 transition-colors">Privacy</Link>
                <Link to="#" className="hover:text-gray-300 transition-colors">Terms</Link>
                <Link to="#" className="hover:text-gray-300 transition-colors">Sitemap</Link>
              </div>
            </div>

            {/* Language Selector */}
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <FaGlobe size={16} />
              <span>English (IN)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;