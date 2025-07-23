// Enhanced data manager with MongoDB integration
import { connectToMongoose } from './mongodb';
import { Registration, Contact, Speaker, Partner } from './models';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  district: string;
  registrationType: 'early-bird' | 'regular' | 'student';
  specialRequirements?: string;
}

export interface ContactData {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
}

export interface SpeakerData {
  name: string;
  title: string;
  organization: string;
  bio: string;
  expertise: string[];
  imageUrl?: string;
  contactEmail: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  sessionTitle?: string;
  sessionDescription?: string;
  isKeynote?: boolean;
}

export interface PartnerData {
  name: string;
  type: 'sponsor' | 'partner' | 'media' | 'supporter';
  level: 'platinum' | 'gold' | 'silver' | 'bronze' | 'supporter';
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  displayOrder?: number;
}

class DatabaseManager {
  private static instance: DatabaseManager;

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  // Registration methods
  async createRegistration(data: RegistrationData) {
    try {
      await connectToMongoose();
      
      // Check if email already exists
      const existing = await Registration.findOne({ email: data.email });
      if (existing) {
        throw new Error('Email already registered');
      }

      const registration = new Registration(data);
      return await registration.save();
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error;
    }
  }

  async getRegistrations(page = 1, limit = 50, filters: any = {}) {
    try {
      await connectToMongoose();
      
      const query: any = {};
      
      if (filters.status) {
        query.paymentStatus = filters.status;
      }
      
      if (filters.registrationType) {
        query.registrationType = filters.registrationType;
      }
      
      if (filters.search) {
        query.$or = [
          { firstName: { $regex: filters.search, $options: 'i' } },
          { lastName: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { organization: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      
      const [registrations, total] = await Promise.all([
        Registration.find(query)
          .sort({ registrationDate: -1 })
          .skip(skip)
          .limit(limit),
        Registration.countDocuments(query)
      ]);

      return {
        data: registrations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
  }

  async updateRegistrationStatus(id: string, status: 'pending' | 'completed' | 'failed') {
    try {
      await connectToMongoose();
      return await Registration.findByIdAndUpdate(
        id,
        { paymentStatus: status },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating registration status:', error);
      throw error;
    }
  }

  async verifyRegistration(id: string) {
    try {
      await connectToMongoose();
      return await Registration.findByIdAndUpdate(
        id,
        { isVerified: true },
        { new: true }
      );
    } catch (error) {
      console.error('Error verifying registration:', error);
      throw error;
    }
  }

  // Contact methods
  async createContact(data: ContactData) {
    try {
      await connectToMongoose();
      const contact = new Contact(data);
      return await contact.save();
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async getContacts(page = 1, limit = 50, filters: any = {}) {
    try {
      await connectToMongoose();
      
      const query: any = {};
      
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { subject: { $regex: filters.search, $options: 'i' } },
          { organization: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      
      const [contacts, total] = await Promise.all([
        Contact.find(query)
          .sort({ submittedAt: -1 })
          .skip(skip)
          .limit(limit),
        Contact.countDocuments(query)
      ]);

      return {
        data: contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async updateContactStatus(id: string, status: 'new' | 'in-progress' | 'resolved') {
    try {
      await connectToMongoose();
      const updateData: any = { status };
      
      if (status === 'resolved') {
        updateData.respondedAt = new Date();
      }
      
      return await Contact.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      console.error('Error updating contact status:', error);
      throw error;
    }
  }

  // Speaker methods
  async createSpeaker(data: SpeakerData) {
    try {
      await connectToMongoose();
      const speaker = new Speaker(data);
      return await speaker.save();
    } catch (error) {
      console.error('Error creating speaker:', error);
      throw error;
    }
  }

  async getSpeakers(confirmed = true) {
    try {
      await connectToMongoose();
      const query = confirmed ? { isConfirmed: true } : {};
      return await Speaker.find(query).sort({ isKeynote: -1, name: 1 });
    } catch (error) {
      console.error('Error fetching speakers:', error);
      throw error;
    }
  }

  async confirmSpeaker(id: string) {
    try {
      await connectToMongoose();
      return await Speaker.findByIdAndUpdate(
        id,
        { isConfirmed: true },
        { new: true }
      );
    } catch (error) {
      console.error('Error confirming speaker:', error);
      throw error;
    }
  }

  // Partner methods
  async createPartner(data: PartnerData) {
    try {
      await connectToMongoose();
      const partner = new Partner(data);
      return await partner.save();
    } catch (error) {
      console.error('Error creating partner:', error);
      throw error;
    }
  }

  async getPartners(visible = true) {
    try {
      await connectToMongoose();
      const query = visible ? { isVisible: true } : {};
      return await Partner.find(query).sort({ type: 1, level: 1, displayOrder: 1 });
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw error;
    }
  }

  // Statistics methods
  async getStatistics() {
    try {
      await connectToMongoose();
      
      const [
        totalRegistrations,
        verifiedRegistrations,
        pendingPayments,
        completedPayments,
        totalContacts,
        newContacts,
        totalSpeakers,
        confirmedSpeakers,
        totalPartners
      ] = await Promise.all([
        Registration.countDocuments(),
        Registration.countDocuments({ isVerified: true }),
        Registration.countDocuments({ paymentStatus: 'pending' }),
        Registration.countDocuments({ paymentStatus: 'completed' }),
        Contact.countDocuments(),
        Contact.countDocuments({ status: 'new' }),
        Speaker.countDocuments(),
        Speaker.countDocuments({ isConfirmed: true }),
        Partner.countDocuments({ isVisible: true })
      ]);

      return {
        registrations: {
          total: totalRegistrations,
          verified: verifiedRegistrations,
          pendingPayments,
          completedPayments
        },
        contacts: {
          total: totalContacts,
          new: newContacts
        },
        speakers: {
          total: totalSpeakers,
          confirmed: confirmedSpeakers
        },
        partners: {
          total: totalPartners
        }
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
}

export default DatabaseManager;
