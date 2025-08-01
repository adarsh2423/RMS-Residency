import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Branch } from '../types';
import Gallery from './Gallery';

const Branches: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
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

  const openGallery = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  const closeGallery = () => {
    setSelectedBranch(null);
  };

  
  const currentBranch = branches.find(branch => branch.id === selectedBranch);
  if (loading) {
    return (
      <section id="branches" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading branches...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="branches" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Branches
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our premium accommodation facilities across prime locations, 
              each designed to provide comfort and convenience.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.2 + (index * 0.1) 
                }}
              >
                <div className="relative group cursor-pointer" onClick={() => openGallery(branch.id)}>
                  <img
                    src={branch.mainImage}
                    alt={branch.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Camera size={48} className="mx-auto mb-2" />
                      <p className="text-lg font-semibold">View Gallery</p>
                      <p className="text-sm">{branch.galleryImages.length} photos</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{branch.name}</h3>
                  <p className="text-gray-700 leading-relaxed">{branch.description}</p>
                  
                  <button
                    onClick={() => openGallery(branch.id)}
                    className="mt-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                  >
                    <Camera size={20} />
                    <span>View Photos</span>
                  </button>
                  <button className='text-blue text-sm text-blue-500 text-start pl-7'>
                    <a href='https://drive.google.com/drive/folders/1IP2yqH9I_J8ROE3pHKhKnskzgPE52y33?usp=sharing' target='_blank' rel='noopener noreferrer'>Click here to view more</a>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {currentBranch && (
        <Gallery
          isOpen={!!selectedBranch}
          onClose={closeGallery}
          images={currentBranch.galleryImages}
          branchName={currentBranch.name}
        />
      )}
    </>
  );
};

export default Branches;