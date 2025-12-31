import { useState, useEffect } from 'react';
import { Plus, Search, MessageCircle, User as UserIcon, Loader2, X, Trash2 } from 'lucide-react';
import { User } from '../App';
import { api, SharedTool, CreateSharedToolRequest } from '../services/api';

interface SharedItem {
  id: number;
  equipmentName: string;
  category: string;
  ownerName: string;
  ownerEmail: string;
  ownerId: number;
  description: string;
  imageUrl?: string;
  postedDate: string;
}

interface EquipmentSharingProps {
  user: User;
}

export function EquipmentSharing({ user }: EquipmentSharingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'my-items'>('all');
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [toolName, setToolName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Fetch shared tools from backend
  useEffect(() => {
    const fetchSharedTools = async () => {
      try {
        setLoading(true);
        setError(null);
        const backendTools: SharedTool[] = await api.get('/shared-tools');
        
        // Map backend tools to frontend format
        const mappedItems: SharedItem[] = backendTools.map((tool) => ({
          id: tool.toolId,
          equipmentName: tool.toolName,
          category: 'Shared Equipment', // Backend doesn't have category
          ownerName: tool.owner.name,
          ownerEmail: tool.contactEmail || tool.owner.email,
          ownerId: tool.owner.studentId,
          description: tool.description || 'No description provided',
          imageUrl: tool.imageUrl,
          postedDate: new Date().toISOString().split('T')[0], // Backend doesn't have postedDate
        }));

        setSharedItems(mappedItems);
      } catch (err: any) {
        setError(err.message || 'Failed to load shared tools');
        console.error('Error fetching shared tools:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedTools();
  }, []);

  const myItems = sharedItems.filter(item => item.ownerId === parseInt(user.id));
  const displayItems = filter === 'my-items' ? myItems : sharedItems;

  const filteredItems = displayItems.filter(item =>
    item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContact = (item: SharedItem) => {
    window.location.href = `mailto:${item.ownerEmail}?subject=Equipment Sharing Inquiry: ${item.equipmentName}`;
  };

  const handleDelete = async (itemId: number, ownerId: number) => {
    if (!confirm('Are you sure you want to delete this shared item?')) return;

    try {
      await api.delete(`/shared-tools/${itemId}?ownerStudentId=${ownerId}`);
      setSharedItems(sharedItems.filter(item => item.id !== itemId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
      console.error('Error deleting shared tool:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const request: CreateSharedToolRequest = {
        toolName,
        description,
        imageUrl: imageUrl || undefined,
        ownerStudentId: parseInt(user.id),
      };

      await api.post('/shared-tools', request);

      // Reset form
      setToolName('');
      setDescription('');
      setImageUrl('');
      setShowAddForm(false);

      // Refresh shared tools
      const backendTools: SharedTool[] = await api.get('/shared-tools');
      const mappedItems: SharedItem[] = backendTools.map((tool) => ({
        id: tool.toolId,
        equipmentName: tool.toolName,
        category: 'Shared Equipment',
        ownerName: tool.owner.name,
        ownerEmail: tool.contactEmail || tool.owner.email,
        ownerId: tool.owner.studentId,
        description: tool.description || 'No description provided',
        imageUrl: tool.imageUrl,
        postedDate: new Date().toISOString().split('T')[0],
      }));
      setSharedItems(mappedItems);

      alert('Equipment shared successfully!');
    } catch (err: any) {
      setFormError(err.message || 'Failed to share equipment. Please try again.');
      console.error('Error sharing equipment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[#1E3A5F] dark:text-[#2C5282]">Equipment Sharing</h1>
          <p className="text-[#2D3748] dark:text-[#B8B8B8] mt-1">Share and borrow equipment with fellow students</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setFormError(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] dark:from-[#2C5282] dark:to-[#2C5282] text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Share Equipment
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] dark:from-[#2C5282] dark:to-[#2C5282] text-white'
              : 'bg-[#F8F9FA] dark:bg-[#2D2D2D] text-[#1A202C] dark:text-[#B8B8B8] border border-[#E2E8F0] dark:border-[#4A4A4A] hover:bg-[#EDF2F7] dark:hover:bg-[#3D3D3D]'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setFilter('my-items')}
          className={`px-4 py-2 rounded-lg transition-all ${
            filter === 'my-items'
              ? 'bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] dark:from-[#2C5282] dark:to-[#2C5282] text-white'
              : 'bg-[#F8F9FA] dark:bg-[#2D2D2D] text-[#1A202C] dark:text-[#B8B8B8] border border-[#E2E8F0] dark:border-[#4A4A4A] hover:bg-[#EDF2F7] dark:hover:bg-[#3D3D3D]'
          }`}
        >
          My Items ({myItems.length})
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#F8F9FA] dark:bg-[#2D2D2D] rounded-lg shadow p-4 border border-[#E2E8F0] dark:border-[#4A4A4A]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D3748] dark:text-[#B8B8B8] w-5 h-5" />
          <input
            type="text"
            placeholder="Search by equipment name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] dark:border-[#4A4A4A] bg-[#F8F9FA] dark:bg-[#3D3D3D] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282]"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#1E3A5F] dark:text-[#2C5282] animate-spin" />
          <span className="ml-3 text-[#2D3748] dark:text-[#B8B8B8]">Loading shared equipment...</span>
        </div>
      )}

      {/* Items Grid */}
      {!loading && (
        <>
          {filteredItems.length === 0 ? (
            <div className="bg-[#F8F9FA] dark:bg-[#2D2D2D] rounded-lg shadow p-12 text-center text-[#2D3748] dark:text-[#B8B8B8] border border-[#E2E8F0] dark:border-[#4A4A4A]">
              {searchTerm ? 'No shared items found matching your search.' : 'No shared items available yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="bg-[#F8F9FA] dark:bg-[#2D2D2D] rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-[#E2E8F0] dark:border-[#4A4A4A] animate-scaleIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="mb-1 text-[#1E3A5F] dark:text-[#2C5282]">{item.equipmentName}</h3>
                        <span className="inline-block px-2 py-1 bg-[#EDF2F7] dark:bg-[#3D3D3D] text-[#1E3A5F] dark:text-[#2C5282] rounded text-xs">
                          {item.category}
                        </span>
                      </div>
                      {item.ownerId === parseInt(user.id) && (
                        <button
                          onClick={() => handleDelete(item.id, item.ownerId)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.equipmentName}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}

                    <p className="text-[#2D3748] dark:text-[#B8B8B8] text-sm mb-4">{item.description}</p>

                    <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#4A4A4A]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-[#EDF2F7] dark:bg-[#3D3D3D] rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-[#1E3A5F] dark:text-[#2C5282]" />
                        </div>
                        <div className="text-sm">
                          <p className="text-[#1A202C] dark:text-white">{item.ownerName}</p>
                          <p className="text-[#2D3748] dark:text-[#B8B8B8] text-xs">{item.postedDate}</p>
                        </div>
                      </div>

                      {item.ownerId !== parseInt(user.id) && (
                        <button
                          onClick={() => handleContact(item)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] dark:from-[#2C5282] dark:to-[#2C5282] text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contact Owner
                        </button>
                      )}
                      {item.ownerId === parseInt(user.id) && (
                        <button 
                          className="w-full px-4 py-2 bg-[#EDF2F7] dark:bg-[#3D3D3D] text-[#1E3A5F] dark:text-[#2C5282] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#4A4A4A] transition-colors"
                          disabled
                        >
                          Your Item
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Equipment Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#F8F9FA] dark:bg-[#2D2D2D] rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-[#E2E8F0] dark:border-[#4A4A4A] animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#1E3A5F] dark:text-[#2C5282]">Share Your Equipment</h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormError(null);
                }}
                className="text-[#2D3748] hover:text-[#1A202C] dark:text-[#2D3748] dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {formError}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[#1A202C] dark:text-[#B8B8B8] mb-2">Equipment Name</label>
                <input
                  type="text"
                  required
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="e.g., Digital Multimeter"
                  className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#4A4A4A] bg-[#F8F9FA] dark:bg-[#3D3D3D] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282]"
                />
              </div>

              <div>
                <label className="block text-[#1A202C] dark:text-[#B8B8B8] mb-2">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the equipment and its condition..."
                  className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#4A4A4A] bg-[#F8F9FA] dark:bg-[#3D3D3D] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282]"
                />
              </div>

              <div>
                <label className="block text-[#1A202C] dark:text-[#B8B8B8] mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-[#E2E8F0] dark:border-[#4A4A4A] bg-[#F8F9FA] dark:bg-[#3D3D3D] text-[#1A202C] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] dark:focus:ring-[#2C5282]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormError(null);
                  }}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[#EDF2F7] dark:bg-[#3D3D3D] text-[#1A202C] dark:text-[#B8B8B8] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#4A4A4A] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] dark:from-[#2C5282] dark:to-[#2C5282] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    'Share Equipment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
