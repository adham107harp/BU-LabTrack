import { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { User } from '../App';
import { api, Lab as BackendLab, Equipment as BackendEquipment } from '../services/api';

interface Lab {
  id: number;
  name: string;
  capacity: number;
  building: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance';
  equipment: Equipment[];
}

interface Equipment {
  id: number;
  name: string;
  quantity: number;
  available: number;
}

interface LabRoomsProps {
  user: User;
  onNavigateToReservation: () => void;
}

export function LabRooms({ user, onNavigateToReservation }: LabRoomsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipmentLoading, setEquipmentLoading] = useState<number | null>(null);

  // Fetch labs from backend
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        setError(null);
        const backendLabs: BackendLab[] = await api.get('/labs');
        
        // Map backend labs to frontend format
        const mappedLabs: Lab[] = await Promise.all(
          backendLabs.map(async (lab) => {
            // Determine status based on availability (simplified logic)
            let status: 'available' | 'occupied' | 'maintenance' = 'available';
            if (lab.equipmentList && lab.equipmentList.length > 0) {
              const hasMaintenance = lab.equipmentList.some(eq => eq.status === 'MAINTENANCE');
              const hasAvailable = lab.equipmentList.some(eq => eq.status === 'AVAILABLE');
              if (hasMaintenance) status = 'maintenance';
              else if (!hasAvailable) status = 'occupied';
            }

            // Parse location to extract building and floor
            const locationParts = lab.location?.split(',') || [];
            const building = locationParts[0]?.trim() || 'Unknown Building';
            const floor = parseInt(locationParts[1]?.trim() || '0') || 0;

            return {
              id: lab.labId,
              name: lab.labName,
              capacity: lab.capacity || 0,
              building,
              floor,
              status,
              equipment: [], // Will be loaded when lab is selected
            };
          })
        );

        setLabs(mappedLabs);
      } catch (err: any) {
        setError(err.message || 'Failed to load labs');
        console.error('Error fetching labs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  // Fetch equipment when a lab is selected
  useEffect(() => {
    if (!selectedLab) return;

    const fetchEquipment = async () => {
      try {
        setEquipmentLoading(selectedLab.id);
        const equipment: BackendEquipment[] = await api.get(`/equipment/lab/${selectedLab.id}`);
        
        // Map equipment to frontend format
        // Note: Backend doesn't have quantity/available, so we'll use status
        const mappedEquipment: Equipment[] = equipment.map((eq, index) => {
          // For now, we'll estimate based on status
          // In a real system, you'd have quantity fields
          const isAvailable = eq.status === 'AVAILABLE';
          return {
            id: index + 1,
            name: eq.equipmentName,
            quantity: 1, // Default, should come from backend
            available: isAvailable ? 1 : 0,
          };
        });

        setSelectedLab({
          ...selectedLab,
          equipment: mappedEquipment,
        });
      } catch (err: any) {
        console.error('Error fetching equipment:', err);
        // Set empty equipment on error
        setSelectedLab({
          ...selectedLab,
          equipment: [],
        });
      } finally {
        setEquipmentLoading(null);
      }
    };

    fetchEquipment();
  }, [selectedLab?.id]);

  const filteredLabs = labs.filter((lab) =>
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Lab['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700';
      case 'occupied':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700';
      case 'maintenance':
        return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700';
    }
  };

  const handleMakeReservation = (equipment: Equipment) => {
    localStorage.setItem('selectedEquipment', JSON.stringify({
      ...equipment,
      labName: selectedLab?.name,
      labId: selectedLab?.id,
    }));
    setSelectedLab(null);
    onNavigateToReservation();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-[#1E3A5F] dark:text-[#2C5282]">Lab Rooms</h1>
        <p className="text-[#2D3748] dark:text-[#B0B0B0] mt-1">Browse and access laboratory facilities</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow p-4 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-[#B0B0B0] w-5 h-5" />
          <input
            type="text"
            placeholder="Search labs by name or building..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-[#E2E8F0] dark:border-[#3A4150] bg-[#F8F9FA] dark:bg-[#2F3541] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282]"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#1E3A5F] dark:text-[#2C5282] animate-spin" />
          <span className="ml-3 text-[#2D3748] dark:text-[#B0B0B0]">Loading labs...</span>
        </div>
      )}

      {/* Labs Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLabs.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#2D3748] dark:text-[#B0B0B0]">
              {searchTerm ? 'No labs found matching your search.' : 'No labs available.'}
            </div>
          ) : (
            filteredLabs.map((lab, index) => (
              <div
                key={lab.id}
                className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer animate-scaleIn border-2 border-[#E2E8F0] dark:border-[#3A4150]"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedLab(lab)}
              >
                <div className="p-6">
                  <h3 className="mb-3 text-[#1E3A5F] dark:text-[#2C5282]">{lab.name}</h3>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#2D3748] dark:text-[#B0B0B0]">Building:</span>
                      <span className="text-[#1A202C] dark:text-white">{lab.building}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2D3748] dark:text-[#B0B0B0]">Floor:</span>
                      <span className="text-[#1A202C] dark:text-white">{lab.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2D3748] dark:text-[#B0B0B0]">Capacity:</span>
                      <span className="text-[#1A202C] dark:text-white">{lab.capacity} students</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2D3748] dark:text-[#B0B0B0]">Equipment:</span>
                      <span className="text-[#1A202C] dark:text-white">
                        {selectedLab?.id === lab.id ? lab.equipment.length : 'Click to view'}
                      </span>
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs border-2 text-center ${getStatusColor(lab.status)}`}>
                    {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                  </div>

                  <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E53E3E] to-[#1E3A5F] text-white rounded-lg hover:shadow-lg transition-all">
                    View Equipment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lab Equipment Modal */}
      {selectedLab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn border-2 border-[#E53E3E]">
            <div className="sticky top-0 bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-white mb-2">{selectedLab.name}</h2>
                  <p className="text-[#E2E8F0] text-sm">{selectedLab.building} - Floor {selectedLab.floor}</p>
                </div>
                <button
                  onClick={() => setSelectedLab(null)}
                  className="text-white hover:bg-[#F8F9FA]/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="mb-4 text-[#1E3A5F] dark:text-[#2C5282]">Available Equipment</h3>
              
              {equipmentLoading === selectedLab.id ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#1E3A5F] dark:text-[#2C5282] animate-spin" />
                  <span className="ml-3 text-[#2D3748] dark:text-[#B0B0B0]">Loading equipment...</span>
                </div>
              ) : selectedLab.equipment.length === 0 ? (
                <div className="text-center py-8 text-[#2D3748] dark:text-[#B0B0B0]">
                  No equipment available in this lab.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedLab.equipment.map((equipment) => (
                    <div
                      key={equipment.id}
                      className="flex items-center justify-between p-4 bg-[#FFFFFF] dark:bg-[#2F3541] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#3A4150] transition-colors border-2 border-[#E2E8F0] dark:border-[#3A4150]"
                    >
                      <div className="flex-1">
                        <p className="text-[#1A202C] dark:text-white">{equipment.name}</p>
                        <p className="text-sm text-[#2D3748] dark:text-[#B0B0B0] mt-1">
                          Available: <span className={equipment.available > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {equipment.available} / {equipment.quantity}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleMakeReservation(equipment)}
                        disabled={equipment.available === 0}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          equipment.available === 0
                            ? 'bg-gray-200 dark:bg-[#2F3541] text-gray-500 dark:text-[#6B6B6B] cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#E53E3E] to-[#1E3A5F] text-white hover:shadow-lg transform hover:scale-105'
                        }`}
                      >
                        {equipment.available === 0 ? 'Not Available' : 'Make Reservation'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
