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
      name: 'DR JANE RUTH ACENG',
      title: 'MINISTER FOR HEALTH',
      company: 'Republic of Uganda',
      bio: 'Biography',
      image: '/placeholder-speaker.jpg',
      expertise: ['Healthcare Policy', 'Public Health', 'Digital Health Systems'],
      country: 'Uganda'
    },
    {
      id: 2,
      name: 'DR. CHARLES OLARO',
      title: 'DIRECTOR GENERAL HEALTH SERVICES',
      company: 'Ministry of Health Uganda',
      bio: 'Biography',
      image: '/placeholder-speaker.jpg',
      expertise: ['Health Services', 'Public Health', 'Health Administration'],
      country: 'Uganda'
    },
    {
      id: 3,
      name: 'Speaker 1',
      title: 'Health Expert',
      company: 'Ministry of Health Uganda',
      bio: 'Biography',
      image: '/placeholder-speaker.jpg',
      expertise: ['Public Health', 'Disease Prevention'],
      country: 'Uganda'
    },
    {
      id: 4,
      name: 'Speaker 2',
      title: 'Health Specialist',
      company: 'Ministry of Health Uganda',
      bio: 'Biography',
      image: '/placeholder-speaker.jpg',
      expertise: ['Health Development', 'Partnership', 'Community Health'],
      country: 'Uganda'
    },
    {
      id: 5,
      name: 'Speaker 3',
      title: 'Medical Officer',
      company: 'Ministry of Health Uganda',
      bio: 'Biography',
      image: '/placeholder-speaker.jpg',
      expertise: ['Health Services', 'Public Health', 'Health Administration'],
      country: 'Uganda'
    },
    {
      id: 6,
      name: 'Speaker 4',
      title: 'Health Administrator',
      company: 'Ministry of Health Uganda',
      bio: 'Biography',
      image: '/placeholder-speaker.jpg',
      expertise: ['Health Education', 'Community Health', 'Public Health'],
      country: 'Uganda'
    },
    {
      id: 7,
      name: 'Speaker 1',
      title: 'Health Expert',
      company: 'Ministry of Health Uganda',
      bio: 'Biography',
      image: '/placeholder-speaker.jpg',
      expertise: ['Public Health', 'Disease Prevention'],
      country: 'Uganda'
    },
    {
      id: 8,
      name: 'Speaker 2',
      title: 'Health Specialist',
      company: 'Ministry of Health Uganda',
      bio: 'Biography',
      image: '/placeholder-speaker.jpg',
      expertise: ['Community Health', 'Health Policy'],
      country: 'Uganda'
    },
    {
      id: 9,
      name: 'Speaker 3',
      title: 'Medical Officer',
      company: 'Ministry of Health Uganda',
      bio: 'Biography',
      image: '/placeholder-speaker.jpg',
      expertise: ['Clinical Medicine', 'Public Health'],
      country: 'Uganda'
    },
    {
      id: 10,
      name: 'Speaker 4',
      title: 'Health Administrator',
      company: 'Ministry of Health Uganda',
      bio: 'Biography',
      image: '/placeholder-speaker.jpg',
      expertise: ['Health Management', 'Health Systems'],
      country: 'Uganda'
    }
  ]

  const speakerStats = [
    { number: '10+', label: 'Expert Speakers', icon: Users },
    { number: '5+', label: 'Ministry Departments', icon: Globe },
    { number: '10+', label: 'Health Leaders', icon: Award }
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
              Learn from Uganda's most influential health leaders and experts 
              at The Communicable and Non-Communicable Diseases Conference.
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
              Meet some of the distinguished experts who will be sharing their insights and experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Speaker Image Placeholder */}
                <div className="h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {speaker.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
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
