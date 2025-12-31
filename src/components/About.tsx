import { Beaker, CheckCircle, Users, Package, Share2, FlaskConical, Calendar } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: Package,
      title: 'Equipment Reservation',
      description: 'Students can reserve laboratory equipment for their experiments and projects in advance.',
    },
    {
      icon: Share2,
      title: 'Equipment Sharing',
      description: 'Share equipment and resources with fellow students, fostering collaboration and efficient resource use.',
    },
    {
      icon: Beaker,
      title: 'Lab Room Management',
      description: 'View available lab rooms, their capacities, and current status in real-time.',
    },
    {
      icon: FlaskConical,
      title: 'Research Lab Access',
      description: 'Doctors and faculty members have exclusive access to research lab management and advanced equipment.',
    },
    {
      icon: Calendar,
      title: 'Session Tracking',
      description: 'Track all lab sessions, including scheduled, ongoing, and completed activities.',
    },
    {
      icon: Users,
      title: 'User Roles',
      description: 'Role-based access for students, instructors, technicians, and doctors, ensuring appropriate permissions and features.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] dark:from-[#2F3541] dark:to-[#252932] text-white rounded-lg p-8 md:p-12 shadow-lg border-2 border-[#FF9F66]">
        <div className="flex items-center gap-4 mb-4">
          <Beaker className="w-12 h-12 text-white" />
          <h1 className="text-white">About Our System</h1>
        </div>
        <p className="text-white/90 dark:text-[#2C5282] text-lg max-w-3xl">
          The Badya University Laboratory Tracking System is a comprehensive platform designed to streamline 
          laboratory management, equipment reservations, and resource sharing across all departments.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-lg p-8 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
        <h2 className="mb-4 text-[#1E3A5F] dark:text-[#2C5282]">Our Mission</h2>
        <p className="text-[#1A202C] dark:text-[#B0B0B0] leading-relaxed">
          We aim to provide an efficient, user-friendly system that enhances the laboratory experience for both 
          students and faculty members. By digitizing lab management and equipment tracking, we reduce conflicts, 
          improve resource utilization, and support academic excellence at Badya University.
        </p>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="mb-6 text-[#1E3A5F] dark:text-[#2C5282]">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-2 border-[#E2E8F0] dark:border-[#3A4150]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-[#1E3A5F] to-[#2C5282] text-white rounded-lg">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-[#1E3A5F] dark:text-[#2C5282]">{feature.title}</h3>
                  <p className="text-[#2D3748] dark:text-[#B0B0B0] text-sm">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-lg p-8 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
        <h2 className="mb-6 text-[#1E3A5F] dark:text-[#2C5282]">How It Works</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#1E3A5F] to-[#2C5282] text-white rounded-full flex items-center justify-center">
              1
            </div>
            <div>
              <h3 className="mb-1 text-[#1E3A5F] dark:text-[#2C5282]">Login to Your Account</h3>
              <p className="text-[#2D3748] dark:text-[#B0B0B0]">
                Sign in using your university credentials as either a student, instructor, technician, or doctor to access role-specific features.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#1E3A5F] to-[#2C5282] text-white rounded-full flex items-center justify-center">
              2
            </div>
            <div>
              <h3 className="mb-1 text-[#1E3A5F] dark:text-[#2C5282]">Browse Available Resources</h3>
              <p className="text-[#2D3748] dark:text-[#B0B0B0]">
                Explore lab rooms, equipment inventory, and check availability in real-time through the dashboard.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#1E3A5F] to-[#2C5282] text-white rounded-full flex items-center justify-center">
              3
            </div>
            <div>
              <h3 className="mb-1 text-[#1E3A5F] dark:text-[#2C5282]">Reserve Equipment</h3>
              <p className="text-[#2D3748] dark:text-[#B0B0B0]">
                Select the equipment you need, choose your preferred date and time (respecting lab schedules), and submit your reservation request.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#1E3A5F] to-[#2C5282] text-white rounded-full flex items-center justify-center">
              4
            </div>
            <div>
              <h3 className="mb-1 text-[#1E3A5F] dark:text-[#2C5282]">Share with Peers</h3>
              <p className="text-[#2D3748] dark:text-[#B0B0B0]">
                Post equipment you're willing to share or browse items offered by other students for collaborative work.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-[#F8F9FA] dark:bg-[#252932] rounded-lg shadow-lg p-8 border-2 border-[#E2E8F0] dark:border-[#3A4150]">
        <h2 className="mb-6 text-[#1E3A5F] dark:text-[#2C5282]">Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-[#1A202C] dark:text-[#B0B0B0]">Reduce conflicts over equipment availability</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-[#1A202C] dark:text-[#B0B0B0]">Improve laboratory resource utilization</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-[#1A202C] dark:text-[#B0B0B0]">Foster collaboration among students</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-[#1A202C] dark:text-[#B0B0B0]">Streamline lab management for faculty</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-[#1A202C] dark:text-[#B0B0B0]">Track equipment maintenance schedules</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-[#1A202C] dark:text-[#B0B0B0]">Generate usage reports and analytics</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-[#EDF2F7] to-[#2C5282] dark:from-[#3A4150] dark:to-[#252932] border-2 border-[#1E3A5F] dark:border-[#2C5282] rounded-lg p-8">
        <h2 className="mb-4 text-[#1E3A5F] dark:text-[#2C5282]">Need Help?</h2>
        <p className="text-[#1A202C] dark:text-[#B0B0B0] mb-4">
          Our support team is here to assist you with any questions or technical issues.
        </p>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-sm text-[#2D3748] dark:text-[#6B6B6B]">Email Support</p>
            <p className="text-[#1E3A5F] dark:text-[#2C5282]">labsupport@badya.edu</p>
          </div>
          <div>
            <p className="text-sm text-[#2D3748] dark:text-[#6B6B6B]">Phone</p>
            <p className="text-[#1E3A5F] dark:text-[#2C5282]">+20 123 456 7890</p>
          </div>
          <div>
            <p className="text-sm text-[#2D3748] dark:text-[#6B6B6B]">Office Hours</p>
            <p className="text-[#1E3A5F] dark:text-[#2C5282]">Sun - Thu, 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
