import React, { useEffect } from "react";
import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  const [year, setYear] = useState(Number);
  const fetchYear = () => {
    const date = new Date();
    setYear(date.getFullYear());
  };

  useEffect(() => {
    fetchYear();
  }, []);
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-40 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">RMS Mens PG</h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner for comfortable and secure accommodation.
              Experience premium living at affordable prices.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-blue-400" />
                <span className="text-gray-300">+91 9884151809</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-400" />
                <span className="text-gray-300">rmsmenspg@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-blue-400" />
                <span className="text-gray-300">Multiple Locations</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="block text-gray-300 hover:text-white transition-colors duration-200"
              >
                About Us
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("branches")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="block text-gray-300 hover:text-white transition-colors duration-200"
              >
                Our Branches
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("availability")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="block text-gray-300 hover:text-white transition-colors duration-200"
              >
                Availability
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("find-us")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="block text-gray-300 hover:text-white transition-colors duration-200"
              >
                Find Us
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {year} RMS Mens PG. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
