import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { User } from '../App';
import { api, Research as BackendResearch } from '../services/api';

interface ResearchProject {
  id: number;
  title: string;
  principal: string;
  lab: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'completed';
  teamSize: number;
  budget: string;
}

interface AdvancedEquipment {
  id: number;
  name: string;
  model: string;
  lab: string;
  status: 'operational' | 'maintenance' | 'reserved';
  nextMaintenance: string;
  cost: string;
}

interface ResearchLabProps {
  user: User;
}

export function ResearchLab({ user }: ResearchLabProps) {
  const [activeSection, setActiveSection] = useState<'projects' | 'equipment' | 'requests'>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [advancedEquipment, setAdvancedEquipment] = useState<AdvancedEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch research projects from backend
  useEffect(() => {
    const fetchResearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const backendResearch: BackendResearch[] = await api.get('/research');
        
        // Filter research for current doctor only
        const myResearch = backendResearch.filter(r => r.doctorEmail === user.email);
        
        // Map backend research to frontend format
        const mappedProjects: ResearchProject[] = myResearch.map((research) => {
          // Determine status based on dates
          const today = new Date();
          const startDate = research.startDate ? new Date(research.startDate) : null;
          const endDate = research.endDate ? new Date(research.endDate) : null;
          
          let status: 'active' | 'pending' | 'completed' = 'active';
          if (startDate && today < startDate) status = 'pending';
          else if (endDate && today > endDate) status = 'completed';

          return {
            id: research.researchId,
            title: research.title || 'Untitled Research',
            principal: research.doctorEmail || 'Unknown',
            lab: research.lab?.labName || 'Unknown Lab',
            startDate: research.startDate || '',
            endDate: research.endDate || '',
            status,
            teamSize: 1, // Backend doesn't track team size
            budget: 'N/A', // Backend doesn't track budget
          };
        });

        setProjects(mappedProjects);
      } catch (err: any) {
        setError(err.message || 'Failed to load research projects');
        console.error('Error fetching research:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is a doctor
    if (user.role === 'doctor') {
      fetchResearch();
    } else {
      setLoading(false);
    }
  }, [user.role]);

  // Fetch advanced equipment (using regular equipment API filtered by status)
  useEffect(() => {
    const fetchAdvancedEquipment = async () => {
      try {
        const allEquipment = await api.get('/equipment');
        // Filter for advanced/research equipment (simplified - in real app would have category)
        const advanced = allEquipment
          .filter((eq: any) => eq.status === 'AVAILABLE' || eq.status === 'MAINTENANCE')
          .slice(0, 10) // Limit to 10 items
          .map((eq: any, index: number) => ({
            id: index + 1,
            name: eq.equipmentName,
            model: 'Standard Model', // Backend doesn't have model
            lab: eq.lab?.labName || 'Unknown',
            status: eq.status === 'AVAILABLE' ? 'operational' : 'maintenance',
            nextMaintenance: 'N/A', // Backend doesn't track maintenance
            cost: 'Contact Lab', // Backend doesn't track cost
          }));

        setAdvancedEquipment(advanced);
      } catch (err: any) {
        console.error('Error fetching advanced equipment:', err);
      }
    };

    if (user.role === 'doctor' && activeSection === 'equipment') {
      fetchAdvancedEquipment();
    }
  }, [user.role, activeSection]);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.lab.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'operational':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending':
      case 'reserved':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
      case 'maintenance':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (user.role !== 'doctor') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg">
          Research Lab access is restricted to faculty members only.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[#5B9BD5] dark:text-[#9BB0C1]">Research Laboratory</h1>
          <p className="text-gray-600 dark:text-[#B0B0B0] mt-1">Manage research projects and advanced equipment</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F6995C] to-[#5B9BD5] text-white rounded-lg hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          New Research Project
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Section Tabs */}
      <div className="bg-white dark:bg-[#252932] rounded-lg shadow p-4 border-2 border-[#EADFB4] dark:border-[#3A4150]">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSection('projects')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'projects'
                ? 'bg-gradient-to-r from-[#F6995C] to-[#5B9BD5] text-white'
                : 'bg-gray-100 dark:bg-[#2F3541] text-gray-700 dark:text-[#B0B0B0] hover:bg-gray-200 dark:hover:bg-[#3A4150]'
            }`}
          >
            Research Projects
          </button>
          <button
            onClick={() => setActiveSection('equipment')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'equipment'
                ? 'bg-gradient-to-r from-[#F6995C] to-[#5B9BD5] text-white'
                : 'bg-gray-100 dark:bg-[#2F3541] text-gray-700 dark:text-[#B0B0B0] hover:bg-gray-200 dark:hover:bg-[#3A4150]'
            }`}
          >
            Advanced Equipment
          </button>
          <button
            onClick={() => setActiveSection('requests')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'requests'
                ? 'bg-gradient-to-r from-[#F6995C] to-[#5B9BD5] text-white'
                : 'bg-gray-100 dark:bg-[#2F3541] text-gray-700 dark:text-[#B0B0B0] hover:bg-gray-200 dark:hover:bg-[#3A4150]'
            }`}
          >
            Access Requests
          </button>
        </div>
      </div>

      {/* Research Projects Section */}
      {activeSection === 'projects' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#252932] rounded-lg shadow p-4 border-2 border-[#EADFB4] dark:border-[#3A4150]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-[#B0B0B0] w-5 h-5" />
              <input
                type="text"
                placeholder="Search research projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-[#EADFB4] dark:border-[#3A4150] bg-white dark:bg-[#2F3541] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] dark:focus:ring-[#9BB0C1]"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#5B9BD5] dark:text-[#9BB0C1] animate-spin" />
              <span className="ml-3 text-gray-600 dark:text-[#B0B0B0]">Loading research projects...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white dark:bg-[#252932] rounded-lg shadow p-12 text-center text-gray-500 dark:text-[#B0B0B0] border-2 border-[#EADFB4] dark:border-[#3A4150]">
              {searchTerm ? 'No research projects found matching your search.' : 'No research projects available.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-[#252932] rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-[#EADFB4] dark:border-[#3A4150]">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="flex-1 text-[#5B9BD5] dark:text-[#9BB0C1]">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-[#B0B0B0]">
                        <Users className="w-4 h-4 text-gray-400 dark:text-[#6B6B6B]" />
                        <span className="text-sm">{project.principal}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-[#B0B0B0]">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-[#6B6B6B]" />
                        <span className="text-sm">{project.startDate} to {project.endDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#EADFB4] dark:border-[#3A4150]">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-[#B0B0B0]">Lab</p>
                        <p className="text-sm text-gray-900 dark:text-white">{project.lab}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-[#B0B0B0]">Team Size</p>
                        <p className="text-sm text-gray-900 dark:text-white">{project.teamSize} members</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-[#B0B0B0]">Budget</p>
                        <p className="text-sm text-gray-900 dark:text-white">{project.budget}</p>
                      </div>
                    </div>

                    <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-[#F6995C] to-[#5B9BD5] text-white rounded-lg hover:shadow-lg transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Advanced Equipment Section */}
      {activeSection === 'equipment' && (
        <div className="space-y-6">
          <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-400 dark:border-orange-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div>
                <p className="text-orange-900 dark:text-orange-300">
                  {advancedEquipment.filter(eq => eq.status === 'maintenance').length} equipment item(s) currently under maintenance
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#252932] rounded-lg shadow overflow-hidden border-2 border-[#EADFB4] dark:border-[#3A4150]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#2F3541]">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-600 dark:text-[#B0B0B0]">Equipment</th>
                    <th className="px-6 py-3 text-left text-gray-600 dark:text-[#B0B0B0]">Model</th>
                    <th className="px-6 py-3 text-left text-gray-600 dark:text-[#B0B0B0]">Lab</th>
                    <th className="px-6 py-3 text-left text-gray-600 dark:text-[#B0B0B0]">Status</th>
                    <th className="px-6 py-3 text-left text-gray-600 dark:text-[#B0B0B0]">Next Maintenance</th>
                    <th className="px-6 py-3 text-left text-gray-600 dark:text-[#B0B0B0]">Cost</th>
                    <th className="px-6 py-3 text-left text-gray-600 dark:text-[#B0B0B0]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADFB4] dark:divide-[#3A4150]">
                  {advancedEquipment.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-[#B0B0B0]">
                        No advanced equipment available.
                      </td>
                    </tr>
                  ) : (
                    advancedEquipment.map((equipment) => (
                      <tr key={equipment.id} className="hover:bg-gray-50 dark:hover:bg-[#2F3541]">
                        <td className="px-6 py-4 text-gray-900 dark:text-white">{equipment.name}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#B0B0B0]">{equipment.model}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#B0B0B0]">{equipment.lab}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(equipment.status)}`}>
                            {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#B0B0B0]">{equipment.nextMaintenance}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-[#B0B0B0]">{equipment.cost}</td>
                        <td className="px-6 py-4">
                          <button
                            disabled={equipment.status !== 'operational'}
                            className={`px-3 py-1 rounded text-sm ${
                              equipment.status === 'operational'
                                ? 'bg-gradient-to-r from-[#F6995C] to-[#5B9BD5] text-white hover:shadow-lg'
                                : 'bg-gray-200 dark:bg-[#2F3541] text-gray-500 dark:text-[#6B6B6B] cursor-not-allowed'
                            }`}
                          >
                            Book
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Access Requests Section */}
      {activeSection === 'requests' && (
        <div className="bg-white dark:bg-[#252932] rounded-lg shadow p-8 border-2 border-[#EADFB4] dark:border-[#3A4150]">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-300 dark:text-[#6B6B6B] mx-auto mb-4" />
            <h2 className="mb-2 text-[#5B9BD5] dark:text-[#9BB0C1]">Access Requests</h2>
            <p className="text-gray-600 dark:text-[#B0B0B0] mb-6">
              Review and approve student requests for research lab access
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-[#F6995C] to-[#5B9BD5] text-white rounded-lg hover:shadow-lg transition-all">
              View Pending Requests
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
