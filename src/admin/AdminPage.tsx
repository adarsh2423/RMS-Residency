import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc 
} from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { 
  LogOut, 
  Users, 
  Building, 
  Calendar, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';
import { Branch, Room } from '../types';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<{ branchId: string; roomIndex: number } | null>(null);
  const [editingBranch, setEditingBranch] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState<Room>({ roomNo: '', sharingType: 'Single', bedsAvailable: 1 });
  const [showAddRoom, setShowAddRoom] = useState<string | null>(null);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: '+1 (555) 123-4567',
    email: 'info@comfortstay.com',
    address: 'Multiple Locations'
  });
  const [editingContact, setEditingContact] = useState(false);
  const [newBranch, setNewBranch] = useState<Partial<Branch>>({
    name: '',
    description: '',
    mainImage: '',
    galleryImages: [],
    mapEmbedUrl: '',
    rooms: []
  });
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/');
      } else {
        setUser(user);
      }
    });

    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    fetchBranches();
    fetchContactInfo();
  }, []);

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

  const fetchContactInfo = async () => {
    try {
      const contactCollection = collection(db, 'contact');
      const contactSnapshot = await getDocs(contactCollection);
      if (!contactSnapshot.empty) {
        const contactData = contactSnapshot.docs[0].data();
        setContactInfo(contactData as any);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (file: File, branchId: string, isMainImage: boolean = false) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    const uploadKey = `${branchId}-${isMainImage ? 'main' : 'gallery'}-${Date.now()}`;
    setUploadingImage(uploadKey);

    try {
      const base64Image = await convertToBase64(file);
      
      if (isMainImage) {
        await updateBranch(branchId, { mainImage: base64Image });
      } else {
        await addImageToBranch(branchId, base64Image);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleNewBranchImageUpload = async (file: File, isMainImage: boolean = false) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    const uploadKey = `new-branch-${isMainImage ? 'main' : 'gallery'}-${Date.now()}`;
    setUploadingImage(uploadKey);

    try {
      const base64Image = await convertToBase64(file);
      
      if (isMainImage) {
        setNewBranch(prev => ({ ...prev, mainImage: base64Image }));
      } else {
        setNewBranch(prev => ({ 
          ...prev, 
          galleryImages: [...(prev.galleryImages || []), base64Image] 
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  const addBranch = async () => {
    if (!newBranch.name || !newBranch.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const branchData = {
        ...newBranch,
        galleryImages: newBranch.galleryImages || [],
        rooms: newBranch.rooms || []
      };
      
      const branchesCollection = collection(db, 'branches');
      const docRef = await addDoc(branchesCollection, branchData);
      
      const addedBranch = { id: docRef.id, ...branchData } as Branch;
      
      setBranches(prev => [...prev, addedBranch]);
      setNewBranch({
        name: '',
        description: '',
        mainImage: '',
        galleryImages: [],
        mapEmbedUrl: '',
        rooms: []
      });
      setShowAddBranch(false);
    } catch (error) {
      console.error('Error adding branch:', error);
      alert('Error adding branch. Please try again.');
    }
  };

  const deleteBranch = async (branchId: string) => {
    if (!confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'branches', branchId));
      setBranches(prev => prev.filter(branch => branch.id !== branchId));
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Error deleting branch. Please try again.');
    }
  };

  const updateBranch = async (branchId: string, updatedData: Partial<Branch>) => {
    try {
      const branchRef = doc(db, 'branches', branchId);
      await updateDoc(branchRef, updatedData);
      
      setBranches(prev => prev.map(branch => 
        branch.id === branchId ? { ...branch, ...updatedData } : branch
      ));
    } catch (error) {
      console.error('Error updating branch:', error);
      alert('Error updating branch. Please try again.');
    }
  };

  const updateRoom = async (branchId: string, roomIndex: number, updatedRoom: Room) => {
    const branch = branches.find(b => b.id === branchId);
    if (!branch) return;

    const updatedRooms = [...branch.rooms];
    updatedRooms[roomIndex] = updatedRoom;

    await updateBranch(branchId, { rooms: updatedRooms });
    setEditingRoom(null);
  };

  const deleteRoom = async (branchId: string, roomIndex: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    const branch = branches.find(b => b.id === branchId);
    if (!branch) return;

    const updatedRooms = branch.rooms.filter((_, index) => index !== roomIndex);
    await updateBranch(branchId, { rooms: updatedRooms });
  };

  const addRoom = async (branchId: string) => {
    if (!newRoom.roomNo) {
      alert('Please enter a room number');
      return;
    }

    const branch = branches.find(b => b.id === branchId);
    if (!branch) return;

    const updatedRooms = [...branch.rooms, newRoom];
    await updateBranch(branchId, { rooms: updatedRooms });
    
    setNewRoom({ roomNo: '', sharingType: 'Single', bedsAvailable: 1 });
    setShowAddRoom(null);
  };

  const addImageToBranch = async (branchId: string, base64Image: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (!branch) return;

    const updatedImages = [...branch.galleryImages, base64Image];
    await updateBranch(branchId, { galleryImages: updatedImages });
  };

  const removeImageFromBranch = async (branchId: string, imageIndex: number) => {
    const branch = branches.find(b => b.id === branchId);
    if (!branch) return;

    const updatedImages = branch.galleryImages.filter((_, index) => index !== imageIndex);
    await updateBranch(branchId, { galleryImages: updatedImages });
  };

  const updateBranchDescription = async (branchId: string, description: string) => {
    await updateBranch(branchId, { description });
    setEditingBranch(null);
  };

  const saveContactInfo = async () => {
    try {
      await setDoc(doc(db, 'contact', 'main'), contactInfo);
      setEditingContact(false);
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Error saving contact information. Please try again.');
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const totalRooms = branches.reduce((total, branch) => total + branch.rooms.length, 0);
  const totalBeds = branches.reduce((total, branch) => 
    total + branch.rooms.reduce((branchTotal, room) => branchTotal + room.bedsAvailable, 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-scroll py-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Settings },
              { id: 'branches', label: 'Branch Management', icon: Building },
              { id: 'rooms', label: 'Room Management', icon: Calendar },
              { id: 'gallery', label: 'Gallery Management', icon: ImageIcon },
              { id: 'contact', label: 'Contact Info', icon: Phone }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Branches</p>
                    <p className="text-2xl font-semibold text-gray-900">{branches.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Calendar className="text-teal-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalRooms}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="text-orange-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Beds</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalBeds}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Branch Management</h3>
              <button
                onClick={() => setShowAddBranch(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                <span>Add New Branch</span>
              </button>
            </div>

            {/* Add Branch Modal */}
            {showAddBranch && (
              <div className="bg-white rounded-lg shadow-lg p-6 border">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Add New Branch</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name *</label>
                    <input
                      type="text"
                      value={newBranch.name || ''}
                      onChange={(e) => setNewBranch(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter branch name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleNewBranchImageUpload(file, true);
                          }
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {uploadingImage?.includes('new-branch-main') && (
                        <span className="text-sm text-blue-600">Uploading...</span>
                      )}
                      {newBranch.mainImage && (
                        <div className="mt-2">
                          <img
                            src={newBranch.mainImage}
                            alt="Main preview"
                            className="w-20 h-16 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={newBranch.description || ''}
                      onChange={(e) => setNewBranch(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      placeholder="Enter branch description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
                    <input
                      type="url"
                      value={newBranch.mapEmbedUrl || ''}
                      onChange={(e) => setNewBranch(prev => ({ ...prev, mapEmbedUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter Google Maps embed URL"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => {
                            handleNewBranchImageUpload(file, false);
                          });
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {newBranch.galleryImages && newBranch.galleryImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {newBranch.galleryImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-16 object-cover rounded"
                              />
                              <button
                                onClick={() => setNewBranch(prev => ({
                                  ...prev,
                                  galleryImages: prev.galleryImages?.filter((_, i) => i !== index)
                                }))}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 mt-6">
                  <button
                    onClick={addBranch}
                    className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save size={16} />
                    <span>Add Branch</span>
                  </button>
                  <button
                    onClick={() => setShowAddBranch(false)}
                    className="flex items-center space-x-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Branch List */}
            <div className="grid gap-6">
              {branches.map((branch) => (
                <div key={branch.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{branch.name}</h4>
                        {editingBranch === branch.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={branch.description}
                              onChange={(e) => setBranches(prev => prev.map(b => 
                                b.id === branch.id ? { ...b, description: e.target.value } : b
                              ))}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateBranchDescription(branch.id, branch.description)}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                <Save size={14} />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={() => setEditingBranch(null)}
                                className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                              >
                                <X size={14} />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-600 mb-2">{branch.description}</p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingBranch(branch.id)}
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                              >
                                <Edit size={14} />
                                <span>Edit</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteBranch(branch.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        <span>Delete Branch</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Total Rooms:</span>
                        <span className="ml-2 text-gray-900">{branch.rooms.length}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Available Beds:</span>
                        <span className="ml-2 text-gray-900">
                          {branch.rooms.reduce((total, room) => total + room.bedsAvailable, 0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Gallery Images:</span>
                        <span className="ml-2 text-gray-900">{branch.galleryImages.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-8">
            {branches.map((branch) => (
              <div key={branch.id} className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{branch.name}</h3>
                      <p className="text-gray-600">{branch.description}</p>
                    </div>
                    <button
                      onClick={() => setShowAddRoom(showAddRoom === branch.id ? null : branch.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      <span>Add Room</span>
                    </button>
                  </div>
                </div>

                {showAddRoom === branch.id && (
                  <div className="p-6 bg-gray-50 border-b">
                    <h4 className="font-semibold text-gray-900 mb-4">Add New Room</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <p className="p-2">Room Number</p>
                        <input
                        type="text"
                        placeholder="Room Number"
                        value={newRoom.roomNo}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, roomNo: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                     </div>
                     <div>
                      <p className='p-2'>Room Sharing Type</p>
                      <select
                        value={newRoom.sharingType}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, sharingType: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Triple">Triple</option>
                        <option value="Quad">Quad</option>
                      </select>
                      </div>
                      <div>
                        <p className='p-2'>Beds in room</p>
                      <input
                        type="number"
                        placeholder="Beds Available"
                        min="0"
                        value={newRoom.bedsAvailable}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, bedsAvailable: parseInt(e.target.value) || 0 }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => addRoom(branch.id)}
                        disabled={!newRoom.roomNo}
                        className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <Save size={16} />
                        <span>Add Room</span>
                      </button>
                      <button
                        onClick={() => setShowAddRoom(null)}
                        className="flex items-center space-x-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room No.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sharing Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Beds Available</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {branch.rooms.map((room, roomIndex) => (
                        <tr key={roomIndex}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingRoom?.branchId === branch.id && editingRoom?.roomIndex === roomIndex ? (
                              <input
                                type="text"
                                value={room.roomNo}
                                onChange={(e) => setBranches(prev => prev.map(b => 
                                  b.id === branch.id 
                                    ? { 
                                        ...b, 
                                        rooms: b.rooms.map((r, i) => 
                                          i === roomIndex ? { ...r, roomNo: e.target.value } : r
                                        )
                                      }
                                    : b
                                ))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-900">{room.roomNo}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingRoom?.branchId === branch.id && editingRoom?.roomIndex === roomIndex ? (
                              <select
                                value={room.sharingType}
                                onChange={(e) => setBranches(prev => prev.map(b => 
                                  b.id === branch.id 
                                    ? { 
                                        ...b, 
                                        rooms: b.rooms.map((r, i) => 
                                          i === roomIndex ? { ...r, sharingType: e.target.value } : r
                                        )
                                      }
                                    : b
                                ))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Triple">Triple</option>
                                <option value="Quad">Quad</option>
                              </select>
                            ) : (
                              <span className="text-sm text-gray-700">{room.sharingType}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingRoom?.branchId === branch.id && editingRoom?.roomIndex === roomIndex ? (
                              <input
                                type="number"
                                min="0"
                                value={room.bedsAvailable}
                                onChange={(e) => setBranches(prev => prev.map(b => 
                                  b.id === branch.id 
                                    ? { 
                                        ...b, 
                                        rooms: b.rooms.map((r, i) => 
                                          i === roomIndex ? { ...r, bedsAvailable: parseInt(e.target.value) || 0 } : r
                                        )
                                      }
                                    : b
                                ))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                              />
                            ) : (
                              <span className="text-sm text-gray-700">{room.bedsAvailable}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {editingRoom?.branchId === branch.id && editingRoom?.roomIndex === roomIndex ? (
                                <>
                                  <button
                                    onClick={() => updateRoom(branch.id, roomIndex, room)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Save size={16} />
                                  </button>
                                  <button
                                    onClick={() => setEditingRoom(null)}
                                    className="text-gray-600 hover:text-gray-700"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setEditingRoom({ branchId: branch.id, roomIndex })}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => deleteRoom(branch.id, roomIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-8">
            {branches.map((branch) => (
              <div key={branch.id} className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold text-gray-900">{branch.name} Gallery</h3>
                  <p className="text-gray-600">Manage photos for this branch</p>
                </div>
                
                <div className="p-6">
                  {/* Main Image Section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Main Branch Image</h4>
                    <div className="flex items-start space-x-4">
                      {branch.mainImage && (
                        <div className="relative">
                          <img
                            src={branch.mainImage}
                            alt={`${branch.name} - Main`}
                            className="w-52 h-40 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, branch.id, true);
                            }
                          }}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        />
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Gallery Images</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branch.galleryImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`${branch.name} - ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => removeImageFromBranch(branch.id, index)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                   <div className="mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach(file => {
                              handleImageUpload(file, branch.id, false);
                            });
                          }}
                          className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {uploadingImage?.includes(branch.id) && (
                          <span className="text-sm text-green-600">Uploading...</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                  <p className="text-gray-600">Manage contact details displayed on the website</p>
                </div>
                <button
                  onClick={() => setEditingContact(!editingContact)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit size={16} />
                  <span>{editingContact ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  {editingContact ? (
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{contactInfo.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address
                  </label>
                  {editingContact ? (
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{contactInfo.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Address
                  </label>
                  {editingContact ? (
                    <input
                      type="text"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{contactInfo.address}</p>
                  )}
                </div>
              </div>

              {editingContact && (
                <div className="flex space-x-2">
                  <button
                    onClick={saveContactInfo}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => setEditingContact(false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;