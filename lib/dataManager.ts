// Data management utilities for the admin system
// In a production environment, this would integrate with a real database

interface Registration {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  organization: string
  title: string
  country: string
  industry?: string
  attendeeType?: string
  ticketType: string
  referralSource?: string
  linkedinProfile?: string
  dietaryRequirements?: string
  accommodationNeeds?: string
  emergencyContact?: string
  emergencyPhone?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  organization?: string
  subject: string
  message: string
  status: 'new' | 'replied' | 'resolved' | 'archived'
  createdAt: string
  updatedAt: string
}

interface SpeakerApplication {
  id: string
  name: string
  email: string
  title: string
  organization: string
  bio: string
  expertise: string[]
  sessionProposal?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

class DataManager {
  private static instance: DataManager
  private registrations: Registration[] = []
  private contacts: ContactSubmission[] = []
  private speakers: SpeakerApplication[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage()
    }
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  private loadFromStorage() {
    try {
      const registrations = localStorage.getItem('conference_registrations')
      const contacts = localStorage.getItem('conference_contacts')
      const speakers = localStorage.getItem('conference_speakers')

      if (registrations) this.registrations = JSON.parse(registrations)
      if (contacts) this.contacts = JSON.parse(contacts)
      if (speakers) this.speakers = JSON.parse(speakers)
    } catch (error) {
      console.error('Error loading data from storage:', error)
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('conference_registrations', JSON.stringify(this.registrations))
      localStorage.setItem('conference_contacts', JSON.stringify(this.contacts))
      localStorage.setItem('conference_speakers', JSON.stringify(this.speakers))
    } catch (error) {
      console.error('Error saving data to storage:', error)
    }
  }

  // Registration methods
  addRegistration(registration: Omit<Registration, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Registration {
    const newRegistration: Registration = {
      ...registration,
      id: this.generateId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.registrations.push(newRegistration)
    this.saveToStorage()
    return newRegistration
  }

  getRegistrations(filters?: { status?: string, search?: string }): Registration[] {
    let filtered = [...this.registrations]

    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(reg => reg.status === filters.status)
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(reg => 
        reg.firstName.toLowerCase().includes(search) ||
        reg.lastName.toLowerCase().includes(search) ||
        reg.email.toLowerCase().includes(search) ||
        reg.organization.toLowerCase().includes(search)
      )
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  updateRegistrationStatus(id: string, status: Registration['status']): Registration | null {
    const index = this.registrations.findIndex(reg => reg.id === id)
    if (index === -1) return null

    this.registrations[index] = {
      ...this.registrations[index],
      status,
      updatedAt: new Date().toISOString()
    }
    
    this.saveToStorage()
    return this.registrations[index]
  }

  // Contact submission methods
  addContactSubmission(contact: Omit<ContactSubmission, 'id' | 'createdAt' | 'updatedAt' | 'status'>): ContactSubmission {
    const newContact: ContactSubmission = {
      ...contact,
      id: this.generateId(),
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.contacts.push(newContact)
    this.saveToStorage()
    return newContact
  }

  getContactSubmissions(filters?: { status?: string }): ContactSubmission[] {
    let filtered = [...this.contacts]

    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(contact => contact.status === filters.status)
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  updateContactStatus(id: string, status: ContactSubmission['status']): ContactSubmission | null {
    const index = this.contacts.findIndex(contact => contact.id === id)
    if (index === -1) return null

    this.contacts[index] = {
      ...this.contacts[index],
      status,
      updatedAt: new Date().toISOString()
    }
    
    this.saveToStorage()
    return this.contacts[index]
  }

  // Speaker application methods
  addSpeakerApplication(speaker: Omit<SpeakerApplication, 'id' | 'createdAt' | 'updatedAt' | 'status'>): SpeakerApplication {
    const newSpeaker: SpeakerApplication = {
      ...speaker,
      id: this.generateId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.speakers.push(newSpeaker)
    this.saveToStorage()
    return newSpeaker
  }

  getSpeakerApplications(filters?: { status?: string }): SpeakerApplication[] {
    let filtered = [...this.speakers]

    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(speaker => speaker.status === filters.status)
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  updateSpeakerStatus(id: string, status: SpeakerApplication['status']): SpeakerApplication | null {
    const index = this.speakers.findIndex(speaker => speaker.id === id)
    if (index === -1) return null

    this.speakers[index] = {
      ...this.speakers[index],
      status,
      updatedAt: new Date().toISOString()
    }
    
    this.saveToStorage()
    return this.speakers[index]
  }

  // Analytics methods
  getStats() {
    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const recentRegistrations = this.registrations.filter(
      reg => new Date(reg.createdAt) >= lastWeek
    )

    const recentContacts = this.contacts.filter(
      contact => new Date(contact.createdAt) >= lastWeek
    )

    return {
      totalRegistrations: this.registrations.length,
      pendingRegistrations: this.registrations.filter(reg => reg.status === 'pending').length,
      confirmedRegistrations: this.registrations.filter(reg => reg.status === 'confirmed').length,
      totalContacts: this.contacts.length,
      newContacts: this.contacts.filter(contact => contact.status === 'new').length,
      totalSpeakers: this.speakers.length,
      pendingSpeakers: this.speakers.filter(speaker => speaker.status === 'pending').length,
      approvedSpeakers: this.speakers.filter(speaker => speaker.status === 'approved').length,
      registrationsThisWeek: recentRegistrations.length,
      contactsThisWeek: recentContacts.length,
      conversionRate: this.calculateConversionRate()
    }
  }

  private calculateConversionRate(): number {
    // Simple conversion rate calculation
    // In production, this would factor in actual website visits
    const confirmed = this.registrations.filter(reg => reg.status === 'confirmed').length
    const total = this.registrations.length
    return total > 0 ? Number(((confirmed / total) * 100).toFixed(1)) : 0
  }

  // Export methods
  exportRegistrationsCSV(): string {
    const headers = [
      'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Organization', 
      'Title', 'Country', 'Ticket Type', 'Status', 'Created At'
    ]
    
    const rows = this.registrations.map(reg => [
      reg.id,
      reg.firstName,
      reg.lastName,
      reg.email,
      reg.phone,
      reg.organization,
      reg.title,
      reg.country,
      reg.ticketType,
      reg.status,
      new Date(reg.createdAt).toLocaleDateString()
    ])

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  }

  exportContactsCSV(): string {
    const headers = ['ID', 'Name', 'Email', 'Organization', 'Subject', 'Status', 'Created At']
    
    const rows = this.contacts.map(contact => [
      contact.id,
      contact.name,
      contact.email,
      contact.organization || '',
      contact.subject,
      contact.status,
      new Date(contact.createdAt).toLocaleDateString()
    ])

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Seed some demo data
  seedDemoData() {
    if (this.registrations.length === 0) {
      const demoRegistrations = [
        {
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          email: 'sarah@health.go.ug',
          phone: '+256712345678',
          organization: 'Health Innovations Uganda',
          title: 'CEO',
          country: 'Uganda',
          ticketType: 'Premium',
          dietaryRequirements: 'Vegetarian'
        },
        {
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael@startup.co',
          phone: '+234801234567',
          organization: 'MedTech Startup',
          title: 'CTO',
          country: 'Nigeria',
          ticketType: 'Early Bird'
        },
        {
          firstName: 'Amina',
          lastName: 'Kone',
          email: 'amina@innovations.ng',
          phone: '+233241234567',
          organization: 'African Health Solutions',
          title: 'Innovation Director',
          country: 'Ghana',
          ticketType: 'Standard'
        },
        {
          firstName: 'Dr. James',
          lastName: 'Mwangi',
          email: 'james@hospital.ke',
          phone: '+256722345678',
          organization: 'Mulago National Referral Hospital',
          title: 'Chief Medical Officer',
          country: 'Uganda',
          ticketType: 'VIP'
        },
        {
          firstName: 'Fatima',
          lastName: 'Hassan',
          email: 'fatima@digitalhealth.ma',
          phone: '+212661234567',
          organization: 'Digital Health Morocco',
          title: 'Founder',
          country: 'Morocco',
          ticketType: 'Early Bird'
        },
        {
          firstName: 'Dr. Rachel',
          lastName: 'Okoye',
          email: 'rachel@unicef.org',
          phone: '+234803456789',
          organization: 'UNICEF Nigeria',
          title: 'Health Program Manager',
          country: 'Nigeria',
          ticketType: 'Standard'
        },
        {
          firstName: 'Ahmed',
          lastName: 'Mansour',
          email: 'ahmed@telemedicine.eg',
          phone: '+201012345678',
          organization: 'Cairo Telemedicine Center',
          title: 'Director',
          country: 'Egypt',
          ticketType: 'Premium'
        },
        {
          firstName: 'Dr. Grace',
          lastName: 'Nyong',
          email: 'grace@research.za',
          phone: '+27821234567',
          organization: 'Health Research Institute',
          title: 'Senior Researcher',
          country: 'South Africa',
          ticketType: 'Student'
        }
      ]

      demoRegistrations.forEach(reg => this.addRegistration(reg))
    }

    if (this.contacts.length === 0) {
      const demoContacts = [
        {
          name: 'David Wilson',
          email: 'david@hospital.com',
          organization: 'City Hospital',
          subject: 'Partnership Opportunity',
          message: 'We are interested in exploring partnership opportunities for our digital health initiatives.'
        },
        {
          name: 'Maria Santos',
          email: 'maria@foundation.org',
          organization: 'Health Foundation',
          subject: 'Speaker Application',
          message: 'I would like to apply as a speaker for the conference. I have 10+ years experience in health policy.'
        },
        {
          name: 'Prof. John Smith',
          email: 'john@university.ac.uk',
          organization: 'Oxford University',
          subject: 'Research Collaboration',
          message: 'Interested in discussing research collaboration opportunities in digital health.'
        },
        {
          name: 'Lisa Chen',
          email: 'lisa@venture.com',
          organization: 'Uganda Health Partners',
          subject: 'Partnership Opportunities',
          message: 'Looking to connect with health organizations for potential partnership opportunities.'
        },
        {
          name: 'Dr. Kwame Asante',
          email: 'kwame@ministry.gh',
          organization: 'Ministry of Health Ghana',
          subject: 'Policy Discussion',
          message: 'Would like to discuss health policy initiatives and digital transformation.'
        }
      ]

      demoContacts.forEach(contact => this.addContactSubmission(contact))
    }

    if (this.speakers.length === 0) {
      const demoSpeakers = [
        {
          name: 'DR JANE RUTH ACENG',
          email: 'minister@health.go.ug',
          title: 'MINISTER FOR HEALTH',
          organization: 'Republic of Uganda',
          bio: 'Biography',
          expertise: ['Health Policy', 'Government', 'Public Health', 'Disease Prevention'],
          sessionProposal: 'Integerated Health Systems for a Resilient Future: Harnessing Technology in Combating Diseases'
        },
        {
          name: 'DR. CHARLES OLARO',
          email: 'commissioner@health.go.ug',
          title: 'COMMISSIONER HEALTH SERVICES',
          organization: 'Ministry of Health Uganda',
          bio: 'Biography',
          expertise: ['Health Services', 'Public Health', 'Health Administration'],
          sessionProposal: 'Strengthening Health Systems in Uganda'
        },
        {
          name: 'Speaker 3',
          email: 'speaker3@health.go.ug',
          title: 'Medical Officer',
          organization: 'Ministry of Health Uganda',
          bio: 'Biography',
          expertise: ['Health Policy', 'Legislation', 'Public Health'],
          sessionProposal: 'Legislative Approaches to Disease Prevention'
        },
        {
          name: 'Speaker 1',
          email: 'speaker1@health.go.ug',
          title: 'Health Expert',
          organization: 'Ministry of Health Uganda',
          bio: 'Biography',
          expertise: ['Public Health', 'Disease Prevention'],
          sessionProposal: 'Community Health Strategies for Disease Prevention'
        },
        {
          name: 'Speaker 2',
          email: 'speaker2@health.go.ug',
          title: 'Health Specialist',
          organization: 'Ministry of Health Uganda',
          bio: 'Biography',
          expertise: ['Health Development', 'Partnership'],
          sessionProposal: 'Health Partnership Development in Uganda'
        },
        {
          name: 'Dr. Michael Oduya',
          email: 'michael@hospital.ng',
          title: 'Chief Medical Officer',
          organization: 'Lagos University Teaching Hospital',
          bio: 'Pioneer in implementing electronic health records and telemedicine in Nigeria.',
          expertise: ['Telemedicine', 'Electronic Health Records', 'Hospital Management', 'Clinical Innovation'],
          sessionProposal: 'Telemedicine Implementation: Lessons from Nigeria'
        }
      ]

      demoSpeakers.forEach(speaker => this.addSpeakerApplication(speaker))
      
      // Approve some speakers to show variety in status
      const speakerApps = this.getSpeakerApplications()
      if (speakerApps.length >= 3) {
        this.updateSpeakerStatus(speakerApps[0].id, 'approved')
        this.updateSpeakerStatus(speakerApps[1].id, 'approved')
        this.updateSpeakerStatus(speakerApps[4].id, 'rejected')
      }
    }
  }
}

export default DataManager
export type { Registration, ContactSubmission, SpeakerApplication }
