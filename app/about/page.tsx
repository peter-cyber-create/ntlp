import React from 'react'
import { Target, Globe, Users, Lightbulb } from 'lucide-react'

export const metadata = {
  title: 'About - The Communicable and Non-Communicable Diseases Conference 2025',
  description: 'Learn about The Communicable and Non-Communicable Diseases Conference, Uganda premier health conference organized by Ministry of Health Uganda.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About the Conference
            </h1>
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-primary-500/20 border border-primary-300/30 rounded-full text-primary-100 text-sm font-medium">
                🏛️ Organized by Ministry of Health, Republic of Uganda
              </div>
            </div>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              The Communicable and Non-Communicable Diseases Conference 2025 is Uganda's premier gathering for healthcare advancement, 
              organized by the Ministry of Health Uganda, focusing on United Action Against Communicable 
              and Non-Communicable Diseases, bringing together national healthcare leaders, experts, 
              and stakeholders to strengthen Uganda's health systems.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-primary-500/20 border border-primary-300/30 rounded-full text-primary-600 text-sm font-medium mb-4">
                🏨 Hosted at Speke Resort Munyonyo, Kampala
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                The Ministry of Health Uganda is committed to strengthening our national health systems 
                through coordinated action and collaboration among healthcare providers, policymakers, 
                and communities in the fight against both communicable and non-communicable diseases.
              </p>
              <p className="text-lg text-gray-600">
                As organizers of this national conference, we believe that unified action and strategic 
                partnerships have the power to solve Uganda's most pressing health challenges, from 
                combating infectious diseases to managing chronic conditions and improving healthcare 
                access for all Ugandans.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-primary-50 p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">Driving breakthrough solutions</p>
              </div>
              <div className="bg-primary-50 p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Impact</h3>
                <p className="text-sm text-gray-600">Creating lasting change</p>
              </div>
              <div className="bg-primary-50 p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Collaboration</h3>
                <p className="text-sm text-gray-600">Building strong partnerships</p>
              </div>
              <div className="bg-primary-50 p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Vision</h3>
                <p className="text-sm text-gray-600">Shaping the future</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What to Expect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three days of intensive learning, networking, and collaboration with Uganda's 
              most influential healthcare leaders and experts, hosted by the Ministry of Health Uganda 
              at the prestigious Speke Resort Munyonyo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Day 1: Innovation Showcase</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Keynote presentations from industry leaders</li>
                <li>• Startup pitch competitions</li>
                <li>• Technology demonstrations</li>
                <li>• Investment opportunities panel</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Day 2: Deep Dive Sessions</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Regulatory landscape discussions</li>
                <li>• Technical workshops</li>
                <li>• Case study presentations</li>
                <li>• Breakout networking sessions</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Day 3: Future Planning</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Strategic partnership meetings</li>
                <li>• Investment matching sessions</li>
                <li>• Action planning workshops</li>
                <li>• Closing ceremonies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Focus Areas */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Focus Areas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're addressing the most critical challenges in African healthcare through technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Telemedicine</h3>
              <p className="text-gray-600 text-sm">Expanding access to healthcare in remote areas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Mobile Health</h3>
              <p className="text-gray-600 text-sm">Leveraging mobile technology for health delivery</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI & Machine Learning</h3>
              <p className="text-gray-600 text-sm">Intelligent systems for diagnosis and treatment</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Digital Therapeutics</h3>
              <p className="text-gray-600 text-sm">Evidence-based therapeutic interventions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
