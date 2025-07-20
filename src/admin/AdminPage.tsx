import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
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
  Upload,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import { branches as initialBranches } from '../data/mockData';
import { Branch, Room } from '../types';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [editingRoom, setEditingRoom] = useState<{ branchId: string; roomIndex: number } | null>(null);
  const [editingBranch, setEditingBranch] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState<Room>({ roomNo: '', sharingType: 'Single', bedsAvailable: 1 });
  const [showAddRoom, setShowAddRoom] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({
    phone: '+1 (555) 123-4567',
    email: 'info@comfortstay.com',
    address: 'Multiple Locations'
  });
  const [editingContact, setEditingContact] = useState(false);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateRoom = (branchId: string, roomIndex: number, updatedRoom: Room) => {
    setBranches(prev => prev.map(branch => 
      branch.id === branchId 
        ? { 
            ...branch, 
            rooms: branch.rooms.map((room, index) => 
              index === roomIndex ? updatedRoom : room
            )
          }
        : branch
    ));
    setEditingRoom(null);
  };

  const deleteRoom = (branchId: string, roomIndex: number) => {
    setBranches(prev => prev.map(branch => 
      branch.id === branchId 
        ? { 
            ...branch, 
            rooms: branch.rooms.filter((_, index) => index !== roomIndex)
          }
        : branch
    ));
  };

  const addRoom = (branchId: string) => {
    setBranches(prev => prev.map(branch => 
      branch.id === branchId 
        ? { 
            ...branch, 
            rooms: [...branch.rooms, newRoom]
          }
        : branch
    ));
    setNewRoom({ roomNo: '', sharingType: 'Single', bedsAvailable: 1 });
    setShowAddRoom(null);
  };

  const addImageToBranch = (branchId: string, imageUrl: string) => {
    setBranches(prev => prev.map(branch => 
      branch.id === branchId 
        ? { 
            ...branch, 
            galleryImages: [...branch.galleryImages, imageUrl]
          }
        : branch
    ));
  };

  const removeImageFromBranch = (branchId: string, imageIndex: number) => {
    setBranches(prev => prev.map(branch => 
      branch.id === branchId 
        ? { 
            ...branch, 
            galleryImages: branch.galleryImages.filter((_, index) => index !== imageIndex)
          }
        : branch
    ));
  };

  const updateBranchDescription = (branchId: string, description: string) => {
    setBranches(prev => prev.map(branch => 
      branch.id === branchId 
        ? { ...branch, description }
        : branch
    ));
    setEditingBranch(null);
  };

  if (!user) {
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
  const availableRooms = branches.reduce((total, branch) => 
    total + branch.rooms.filter(room => room.bedsAvailable > 0).length, 0
  );
  const totalBeds = branches.reduce((total, branch) => 
    total + branch.rooms.reduce((branchTotal, room) => branchTotal + room.bedsAvailable, 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Settings },
              { id: 'rooms', label: 'Room Management', icon: Building },
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalRooms}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Users className="text-teal-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Rooms</p>
                    <p className="text-2xl font-semibold text-gray-900">{availableRooms}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="text-orange-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Beds</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalBeds}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Settings className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {Math.round(((totalRooms - availableRooms) / totalRooms) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Room availability updated</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Gallery images updated</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Contact information updated</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
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
                          <button
                            onClick={() => setEditingBranch(branch.id)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Edit size={14} />
                            <span>Edit Description</span>
                          </button>
                        </div>
                      )}
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
                      <input
                        type="text"
                        placeholder="Room Number"
                        value={newRoom.roomNo}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, roomNo: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
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
                      <input
                        type="number"
                        placeholder="Beds Available"
                        min="0"
                        value={newRoom.bedsAvailable}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, bedsAvailable: parseInt(e.target.value) || 0 }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
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
                  <div className="mb-4">
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        placeholder="Enter image URL"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value) {
                              addImageToBranch(branch.id, input.value);
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                          if (input?.value) {
                            addImageToBranch(branch.id, input.value);
                            input.value = '';
                          }
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Upload size={16} />
                        <span>Add Image</span>
                      </button>
                    </div>
                  </div>

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
                    onClick={() => setEditingContact(false)}
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