import { Beaker, CheckCircle, Package, Share2, FlaskConical, ArrowRight, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../App';

interface AboutLandingProps {
  onGetStarted: () => void;
}

export function AboutLanding({ onGetStarted }: AboutLandingProps) {
  const { darkMode, toggleDarkMode } = useDarkMode();

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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#EBF2F7] to-[#E3EDF5] dark:from-[#1A1D23] dark:via-[#252932] dark:to-[#1A1D23]">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#5B9BD5] to-[#8BB4D9] dark:from-[#2F3541] dark:to-[#252932] text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Beaker className="w-8 h-8" />
              <div>
                <h1 className="text-white">Badya University</h1>
                <p className="text-[#CBD5E0] dark:text-[#8BB4D9] text-sm">Laboratory Tracking System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-[#F6995C] hover:bg-[#f58a42] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6">
        {/* Hero Banner */}
        <section className="py-20 px-6 animate-fadeIn">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#5B9BD5] to-[#8BB4D9] dark:from-[#8BB4D9] dark:to-[#51829B] rounded-full mb-6 animate-scaleIn shadow-lg">
              <Beaker className="w-10 h-10 text-white" />
            </div>
            <h1 className="mb-8 text-[#51829B] dark:text-[#8BB4D9]">
              Welcome to Badya University Laboratory Tracking System
            </h1>
            
            {/* Laboratory Image */}
            <div className="mb-8 rounded-lg overflow-hidden shadow-2xl max-w-3xl mx-auto animate-scaleIn border-4 border-[#F6995C]">
              <img 
                src="https://images.unsplash.com/photo-1606206848010-83949917a080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwZXF1aXBtZW50JTIwc2NpZW5jZXxlbnwxfHx8fDE3NjU3NjUxODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Laboratory Equipment and Science Research"
                className="w-full h-auto object-cover"
              />
            </div>
            
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F6995C] to-[#51829B] text-white rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-center mb-12 text-[#51829B] dark:text-[#8BB4D9]">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-scaleIn border-2 border-[#CBD5E0] dark:border-[#3A4150]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#F6995C] to-[#51829B] rounded-lg mb-4 shadow-md">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-3 text-[#51829B] dark:text-[#8BB4D9]">{feature.title}</h3>
                <p className="text-gray-600 dark:text-[#B0B0B0] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="bg-white dark:bg-[#252932] rounded-lg shadow-lg p-8 border-2 border-[#CBD5E0] dark:border-[#3A4150]">
            <h2 className="text-center mb-8 text-[#51829B] dark:text-[#8BB4D9]">Why Choose Our System?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#F6995C] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2 text-[#51829B] dark:text-[#8BB4D9]">Streamlined Process</h3>
                  <p className="text-gray-600 dark:text-[#B0B0B0] text-sm">
                    Simplify lab management with our intuitive digital platform
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#F6995C] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2 text-[#51829B] dark:text-[#8BB4D9]">Real-Time Updates</h3>
                  <p className="text-gray-600 dark:text-[#B0B0B0] text-sm">
                    Get instant notifications about equipment availability
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#F6995C] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2 text-[#51829B] dark:text-[#8BB4D9]">24/7 Access</h3>
                  <p className="text-gray-600 dark:text-[#B0B0B0] text-sm">
                    Reserve equipment and manage bookings anytime, anywhere
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#5B9BD5] to-[#8BB4D9] dark:from-[#252932] dark:to-[#2F3541] text-white py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Beaker className="w-6 h-6" />
                <h3 className="text-white">Badya University</h3>
              </div>
              <p className="text-[#CBD5E0] dark:text-[#8BB4D9] text-sm">
                Empowering education through innovative laboratory management solutions.
              </p>
            </div>
            <div>
              <h3 className="text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-[#CBD5E0] dark:text-[#8BB4D9]">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-[#CBD5E0] dark:text-[#8BB4D9]">
                <p>Email: labsupport@badya.edu</p>
                <p>Office Hours: Sun - Thu, 9:00 AM - 3:00 PM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-[#8BB4D9] dark:border-[#3A4150] mt-8 pt-8 text-center text-sm text-[#CBD5E0] dark:text-[#8BB4D9]">
            <p>&copy; 2024 Badya University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
