import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Branch } from '../types';

const Availability: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
    try {
      const branchesCollection = collection(db, 'branches');
      const branchSnapshot = await getDocs(branchesCollection);
      const branchList = branchSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Branch[];
      setBranches(branchList);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };
    fetchBranches();
  }, [branches]);

   useEffect(() => {
      if (!loading && branches.length > 0) {
        setHasEntered(true);
      }
    }, [loading, branches]);
  
  if (loading) {
    return (
      <section id="availability" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading availability...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="availability" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Room Availability
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check real-time availability across our branches and find the perfect room for your needs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {branches.map((branch, index) => (
            <motion.div 
              key={branch.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
            >
              <div className="px-6 py-4 bg-blue-600">
                <h3 className="text-xl font-bold text-white">{branch.name}</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sharing Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beds Available
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {branch.rooms.map((room, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {room.roomNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {room.sharingType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {room.bedsAvailable}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {room.bedsAvailable > 0 ? (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle size={16} />
                              <span className="text-sm font-medium">Available</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-red-600">
                              <XCircle size={16} />
                              <span className="text-sm font-medium">Full</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Availability;