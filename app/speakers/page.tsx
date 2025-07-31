import React from 'react'
import { Award, Users, Globe } from 'lucide-react'

export const metadata = {
  title: 'Speakers - The Communicable and Non-Communicable Diseases Conference 2025',
  description: 'Meet our distinguished speakers at The Communicable and Non-Communicable Diseases Conference 2025',
}

export default function SpeakersPage() {
  const speakers = [
    {
      id: 1,
      name: 'Dr Jane Ruth Aceng',
      title: 'Minister For Health',
      company: 'Republic of Uganda',
      bio: 'Leading Uganda\'s health sector with extensive experience in public health policy and healthcare system strengthening.',
      image: '/images/ruth.jpeg',
      expertise: ['Healthcare Policy', 'Public Health', 'Digital Health Systems'],
      country: 'Uganda'
    },
    {
      id: 2,
      name: 'Dr. Charles Olaro',
      title: 'Director General Health Services',
      company: 'Ministry of Health Uganda',
      bio: 'Overseeing health service delivery across Uganda with focus on health system strengthening and quality improvement.',
      image: '/images/charles.jpeg',
      expertise: ['Health Services', 'Public Health', 'Health Administration'],
      country: 'Uganda'
    },
    {
      id: 3,
      name: 'Dr. Diana Atwiine',
      title: 'Permanent Secretary',
      company: 'Ministry of Health Uganda',
      bio: 'Driving innovation and efficiency in Uganda\'s health sector as Permanent Secretary.',
      image: '/images/diana.jpeg',
      expertise: ['Health Administration', 'Policy', 'Innovation'],
      country: 'Uganda'
    }
  ]

  const speakerStats = [
    { number: '2', label: 'Confirmed Speakers', icon: Users },
    { number: '5+', label: 'Ministry Departments', icon: Globe },
    { number: 'More', label: 'Speakers Coming', icon: Award }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Speakers
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Hear from Uganda's top health leaders including the Minister for Health 
              and Director General of Health Services.
            </p>
          </div>
        </div>
      </section>

      {/* Speaker Stats */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {speakerStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="text-primary-600" size={32} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Speakers */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Speakers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our confirmed speakers bring decades of experience in Uganda's health sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow transition-all duration-200 hover:scale-[1.01] focus-within:scale-[1.01] focus-within:ring-2 focus-within:ring-primary-400">
                {/* Speaker Image Placeholder */}
                <div className="h-64 flex items-center justify-center bg-gray-100">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{speaker.name}</h3>
                  <p className="text-primary-600 font-semibold mb-1">{speaker.title}</p>
                  <p className="text-gray-600 text-sm mb-3">{speaker.company}</p>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {speaker.bio}
                  </p>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {speaker.expertise.slice(0, 2).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {speaker.expertise.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{speaker.expertise.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Globe size={14} />
                      <span>{speaker.country}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call for Speakers */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Interested in Speaking?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              We welcome health professionals who can share valuable insights 
              about communicable and non-communicable diseases at our national conference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                Apply to Speak
              </a>
              <a href="/agenda" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                View Full Agenda
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Speaker Benefits */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Speak at Our Conference?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a prestigious platform that addresses Uganda's most critical health challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reach Key Audience</h3>
              <p className="text-gray-600">
                Connect with 10+ health professionals and ministry officials
                from across Uganda's health system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Build Your Brand</h3>
              <p className="text-gray-600">
                Establish thought leadership and increase visibility in Uganda's 
                health sector and disease prevention initiatives.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Drive Impact</h3>
              <p className="text-gray-600">
                Share your expertise and help shape Uganda's approach to addressing
                both communicable and non-communicable diseases.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
