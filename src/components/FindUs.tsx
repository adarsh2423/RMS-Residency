import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { branches } from '../data/mockData';

const FindUs: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="find-us" className="py-16 lg:py-24 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Find Us
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Locate our branches and get directions to visit us. We're strategically located 
            for your convenience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {branches.map((branch, index) => (
            <motion.div 
              key={branch.id} 
              className="bg-gray-50 rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="text-blue-600 mr-2" size={24} />
                  {branch.name}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Phone className="text-teal-600" size={18} />
                    <span className="text-gray-700">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-orange-600" size={18} />
                    <span className="text-gray-700">info@comfortstay.com</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 bg-gray-200">
                <iframe
                  src={branch.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${branch.name} Location`}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FindUs;