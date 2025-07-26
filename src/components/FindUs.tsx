import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Branch } from "../types";
import he from 'he';

const FindUs: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchesCollection = collection(db, "branches");
        const branchSnapshot = await getDocs(branchesCollection);
        const branchList = branchSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Branch[];
        setBranches(branchList);
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchContactInfo = async () => {
      try {
        const contactCollection = collection(db, "contact");
        const contactSnapshot = await getDocs(contactCollection);
        if (!contactSnapshot.empty) {
          const contactData = contactSnapshot.docs[0].data();
          setContactInfo({
            phone: contactData.phone || "+1 (555) 123-4567",
            email: contactData.email || "info@comfortstay.com",
          });
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };
    fetchBranches();
    fetchContactInfo();
  }, [branches, contactInfo]);

   useEffect(() => {
      if (!loading && branches.length > 0) {
        setHasEntered(true);
      }
    }, [loading, branches, contactInfo]);

  if (loading) {
    return (
      <section id="find-us" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading locations...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="find-us" className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Find Us
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Locate our branches and get directions to visit us. We're
            strategically located for your convenience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.id}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="text-blue-600 mr-2" size={24} />
                  {branch.name}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Phone className="text-teal-600" size={18} />
                    <span className="text-gray-700">{contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-orange-600" size={18} />
                    <span className="text-gray-700">{contactInfo.email}</span>
                  </div>
                </div>
              </div>

              <div className="h-64 bg-gray-200">
                <iframe
                  src={he.decode(branch.mapEmbedUrl)}
                  width="400"
                  height="300"
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