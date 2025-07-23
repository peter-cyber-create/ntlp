import React from 'react'
import { Clock, MapPin, Users } from 'lucide-react'

export const metadata = {
  title: 'Agenda - The Communicable and Non-Communicable Diseases Conference 2025',
  description: 'View the complete agenda for The Communicable and Non-Communicable Diseases Conference 2025 with keynotes, panels, and workshops.',
}

export default function AgendaPage() {
  const agendaData = {
    'Day 1 - August 25': [
      {
        time: '8:00 - 9:00',
        title: 'Registration & Check-in',
        type: 'networking',
        location: 'Main Lobby',
        description: 'Welcome participants and networking breakfast'
      },
      {
        time: '9:00 - 9:30',
        title: 'Opening Ceremony',
        type: 'keynote',
        location: 'Main Auditorium',
        speaker: 'DR JANE RUTH ACENG, Minister for Health',
        description: 'Opening remarks on integrated health systems and technology in combating diseases'
      },
      {
        time: '9:30 - 10:30',
        title: 'Keynote: Uganda Health Challenges and Solutions',
        type: 'keynote',
        location: 'Main Auditorium',
        speaker: 'DR. CHARLES OLARO, Commissioner Health Services',
        description: 'Addressing both communicable and non-communicable diseases in Uganda'
      },
      {
        time: '10:30 - 11:00',
        title: 'Coffee Break & Networking',
        type: 'break',
        location: 'Exhibition Hall',
        description: 'Refreshments and informal networking'
      },
      {
        time: '11:00 - 12:30',
        title: 'Panel: Disease Prevention Strategies',
        type: 'panel',
        location: 'Main Auditorium',
        speakers: ['Speaker 1', 'Speaker 2', 'Speaker 3'],
        description: 'Evidence-based approaches to preventing communicable and non-communicable diseases'
      },
      {
        time: '12:30 - 13:30',
        title: 'Networking Lunch',
        type: 'networking',
        location: 'Grand Ballroom',
        description: 'Lunch and structured networking sessions'
      },
      {
        time: '13:30 - 15:00',
        title: 'Health Education Workshop',
        type: 'workshop',
        location: 'Workshop Room A',
        description: 'Community health education strategies led by Speaker 4'
      },
      {
        time: '15:00 - 15:30',
        title: 'Afternoon Break',
        type: 'break',
        location: 'Exhibition Hall',
        description: 'Refreshments and exhibition viewing'
      },
      {
        time: '15:30 - 17:00',
        title: 'Workshop: Disease Prevention Implementation',
        type: 'workshop',
        location: 'Workshop Room A',
        description: 'Hands-on session on implementing disease prevention strategies'
      },
      {
        time: '17:00 - 18:30',
        title: 'Welcome Reception',
        type: 'networking',
        location: 'Rooftop Terrace',
        description: 'Cocktail reception with panoramic city views'
      }
    ],
    'Day 2 - August 26': [
      {
        time: '8:30 - 9:00',
        title: 'Morning Networking Session',
        type: 'networking',
        location: 'Main Lobby',
        description: 'Start the day with coffee and conversations'
      },
      {
        time: '9:00 - 10:00',
        title: 'Keynote: AI in African Healthcare',
        type: 'keynote',
        location: 'Main Auditorium',
        speaker: 'Dr. Aisha Patel, Chief AI Officer at MedTech Solutions',
        description: 'How artificial intelligence is improving healthcare delivery'
      },
      {
        time: '10:00 - 11:30',
        title: 'Panel: Regulatory Challenges & Solutions',
        type: 'panel',
        location: 'Main Auditorium',
        speakers: ['Dr. James Mwangi (Regulatory Affairs)', 'Lisa Thompson (Legal Expert)', 'Ahmed Hassan (Policy Advisor)'],
        description: 'Navigating the regulatory landscape for health services'
      },
      {
        time: '11:30 - 12:00',
        title: 'Coffee Break',
        type: 'break',
        location: 'Exhibition Hall',
        description: 'Networking break with exhibitors'
      },
      {
        time: '12:00 - 13:30',
        title: 'Breakout Sessions',
        type: 'workshop',
        location: 'Multiple Rooms',
        description: 'Parallel sessions on specialized topics'
      },
      {
        time: '13:30 - 14:30',
        title: 'Lunch & Exhibition Tour',
        type: 'networking',
        location: 'Exhibition Hall',
        description: 'Lunch with guided exhibition tours'
      },
      {
        time: '14:30 - 16:00',
        title: 'Case Studies: Success Stories',
        type: 'presentation',
        location: 'Main Auditorium',
        description: 'Real-world implementations and their impact'
      },
      {
        time: '16:00 - 16:30',
        title: 'Afternoon Break',
        type: 'break',
        location: 'Exhibition Hall',
        description: 'Final networking with exhibitors'
      },
      {
        time: '16:30 - 18:00',
        title: 'Innovation Showcase',
        type: 'showcase',
        location: 'Innovation Hub',
        description: 'Live demonstrations of advanced medical technologies'
      },
      {
        time: '18:00 - 20:00',
        title: 'Gala Dinner',
        type: 'networking',
        location: 'Grand Ballroom',
        description: 'Awards ceremony and gala dinner'
      }
    ],
    'Day 3 - August 27': [
      {
        time: '9:00 - 9:30',
        title: 'Morning Session',
        type: 'networking',
        location: 'Main Lobby',
        description: 'Final day coffee and conversations'
      },
      {
        time: '9:30 - 10:30',
        title: 'Keynote: Health Systems Strengthening',
        type: 'keynote',
        location: 'Main Auditorium',
        speaker: 'Maria Santos, CEO of PanAfrican Health Network',
        description: 'Strategies for continental expansion and impact'
      },
      {
        time: '10:30 - 12:00',
        title: 'Partnership & Collaboration Sessions',
        type: 'workshop',
        location: 'Multiple Rooms',
        description: 'Structured meetings for potential partnerships'
      },
      {
        time: '12:00 - 13:00',
        title: 'Working Lunch: Action Planning',
        type: 'workshop',
        location: 'Conference Rooms',
        description: 'Planning next steps and commitments'
      },
      {
        time: '13:00 - 14:30',
        title: 'Conference Outcomes & Next Steps',
        type: 'presentation',
        location: 'Main Auditorium',
        description: 'Summary of key insights and action items'
      },
      {
        time: '14:30 - 15:00',
        title: 'Closing Ceremony',
        type: 'keynote',
        location: 'Main Auditorium',
        description: 'Final remarks and conference conclusion'
      },
      {
        time: '15:00 - 16:00',
        title: 'Farewell Networking',
        type: 'networking',
        location: 'Main Lobby',
        description: 'Final networking and goodbyes'
      }
    ],
    'Day 4 - August 28': [
      {
        time: '9:00 - 10:00',
        title: 'Final Plenary Session',
        type: 'keynote',
        location: 'Main Auditorium',
        description: 'Conference outcomes and action plans'
      },
      {
        time: '10:00 - 11:00',
        title: 'Conference Wrap-up',
        type: 'presentation',
        location: 'Main Auditorium', 
        description: 'Summary and next steps'
      }
    ]
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'keynote': return 'bg-primary-100 text-primary-800'
      case 'panel': return 'bg-blue-100 text-blue-800'
      case 'workshop': return 'bg-green-100 text-green-800'
      case 'networking': return 'bg-purple-100 text-purple-800'
      case 'break': return 'bg-gray-100 text-gray-800'
      case 'competition': return 'bg-orange-100 text-orange-800'
      case 'showcase': return 'bg-pink-100 text-pink-800'
      case 'presentation': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Conference Agenda
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Four focused days addressing communicable and non-communicable diseases. 
              Join us for keynotes, panels, workshops, and collaborative sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <div className="flex items-center space-x-2 text-primary-100">
                <Clock size={20} />
                <span>August 25-28, 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-100">
                <MapPin size={20} />
                <span>Speke Resort Munyonyo, Kampala</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda Content */}
      <section className="section-padding">
        <div className="container">
          {Object.entries(agendaData).map(([day, sessions]) => (
            <div key={day} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {day}
              </h2>
              
              <div className="space-y-6">
                {sessions.map((session, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 lg:mb-0">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock size={16} />
                          <span className="font-semibold">{session.time}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)} w-fit`}>
                          {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-500">
                        <MapPin size={16} />
                        <span className="text-sm">{session.location}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {session.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {session.description}
                    </p>
                    
                    {'speaker' in session && session.speaker && (
                      <div className="flex items-center space-x-2 text-primary-600">
                        <Users size={16} />
                        <span className="text-sm font-medium">{session.speaker}</span>
                      </div>
                    )}
                    
                    {'speakers' in session && session.speakers && (
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2 text-primary-600 mb-2">
                          <Users size={16} />
                          <span className="text-sm font-medium">Speakers:</span>
                        </div>
                        <div className="ml-6">
                          {session.speakers.map((speaker: string, speakerIndex: number) => (
                            <div key={speakerIndex} className="text-sm text-gray-600">
                              • {speaker}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-50">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Don't Miss Out!
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Secure your spot at The Communicable and Non-Communicable Diseases Conference.
            </p>
            <a href="/register" className="btn-primary">
              Register Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
