import React from 'react'
import { Clock, MapPin, Users } from 'lucide-react'

export const metadata = {
  title: 'Agenda - The Communicable and Non-Communicable Diseases Conference 2025',
  description: 'View the complete agenda for The Communicable and Non-Communicable Diseases Conference 2025 with keynotes, panels, and workshops.',
}

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
      time: '15:30 - 17:00',
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
};

// Helper for session type color
const getTypeColor = (type: string) => {
  switch (type) {
    case 'keynote': return 'bg-primary-100 text-primary-800';
    case 'panel': return 'bg-blue-100 text-blue-800';
    case 'workshop': return 'bg-green-100 text-green-800';
    case 'networking': return 'bg-purple-100 text-purple-800';
    case 'break': return 'bg-gray-100 text-gray-800';
    case 'competition': return 'bg-orange-100 text-orange-800';
    case 'showcase': return 'bg-pink-100 text-pink-800';
    case 'presentation': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function AgendaPage() {
  return (
    <div className="bg-primary-50 min-h-screen pb-10">
      <section className="relative w-full min-h-[420px] flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-800 text-white px-2 sm:px-0 overflow-hidden mt-24">
        {/* Centered content over slideshow/hero */}
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="max-w-3xl w-full mx-auto text-center flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary-100 drop-shadow-lg text-center bg-primary-900/80 rounded-xl px-6 py-4 shadow-xl">
              The Communicable and Non-Communicable Diseases Conference 2025
            </h1>
            {/* Centered, organized writeup (if any) can be added here as needed */}
          </div>
        </div>
        {/* Decorative gradient bar at bottom of hero */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-700 rounded-full opacity-70 z-20" />
      </section>

      <section className="relative w-full py-14 px-2 sm:px-0">
        <div className="flex justify-center mb-10">
          <div className="h-1 w-24 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-700 rounded-full opacity-70" />
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-10">
          {Object.entries(agendaData).map(([day, sessions]) => (
            <div key={day} className="rounded-2xl shadow-xl bg-white/90 p-8 border border-primary-200 flex flex-col gap-6">
              <h2 className="text-2xl font-extrabold text-primary-900 mb-2">{day}</h2>
              <div className="flex flex-col gap-4">
                {sessions.map((session: any, idx: number) => (
                  <div
                    key={idx}
                    tabIndex={0}
                    className="bg-primary-50 p-5 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-primary-100 shadow-md transition-all duration-200 hover:bg-primary-100 hover:border-primary-300 active:scale-98 focus:bg-primary-100 focus:ring-2 focus:ring-primary-400 focus:outline-none cursor-pointer"
                    role="button"
                    aria-label={session.title}
                  >
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <span className="font-semibold text-primary-700 text-base mr-2">{session.time}</span>
                        <span className="text-primary-900 font-bold text-lg">{session.title}</span>
                      </div>
                      <div className="text-sm text-primary-700 mb-1">{session.location}</div>
                      <div className="text-gray-600 text-sm mb-1">{session.description}</div>
                      {typeof session.speaker === 'string' && session.speaker && (
                        <div className="text-xs text-primary-500 font-medium">Speaker: {session.speaker}</div>
                      )}
                      {Array.isArray(session.speakers) && session.speakers?.length > 0 && (
                        <div className="text-xs text-primary-500 font-medium">Panel: {session.speakers?.join(', ')}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

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
  );
}
