import mongoose, { Schema, Document } from 'mongoose';

// Interface definitions
export interface IRegistration extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  district: string;
  registrationType: 'early-bird' | 'regular' | 'student';
  isVerified: boolean;
  registrationDate: Date;
  paymentStatus: 'pending' | 'completed' | 'failed';
  specialRequirements?: string;
}

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  submittedAt: Date;
  respondedAt?: Date;
}

export interface ISpeaker extends Document {
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
  isKeynote: boolean;
  isConfirmed: boolean;
}

export interface IPartner extends Document {
  name: string;
  type: 'sponsor' | 'partner' | 'media' | 'supporter';
  level: 'platinum' | 'gold' | 'silver' | 'bronze' | 'supporter';
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface IAbstract extends Document {
  title: string;
  presentationType: 'oral' | 'poster';
  category: string;
  primaryAuthor: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    affiliation: string;
    position: string;
    district: string;
  };
  coAuthors?: string;
  abstract: string;
  keywords: string;
  objectives: string;
  methodology: string;
  results: string;
  conclusions: string;
  implications?: string;
  conflictOfInterest: boolean;
  ethicalApproval: boolean;
  consentToPublish: boolean;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewComments?: string;
}

// Mongoose Schemas
// Registration Schema
const RegistrationSchema = new mongoose.Schema<IRegistration>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  district: { type: String, required: true },
  registrationType: { type: String, enum: ['early-bird', 'regular', 'student'], default: 'regular' },
  isVerified: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  specialRequirements: { type: String, default: '' }
})

// Add indexes
RegistrationSchema.index({ email: 1 })
RegistrationSchema.index({ registrationDate: -1 })

// Contact Schema  
const ContactSchema = new mongoose.Schema<IContact>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  organization: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new' },
  submittedAt: { type: Date, default: Date.now },
  respondedAt: { type: Date }
})

// Add indexes
ContactSchema.index({ submittedAt: -1 })
ContactSchema.index({ status: 1 })

const SpeakerSchema = new Schema<ISpeaker>({
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  bio: { type: String, required: true, trim: true },
  expertise: [{ type: String, trim: true }],
  imageUrl: { type: String, trim: true },
  contactEmail: { type: String, required: true, lowercase: true },
  linkedinUrl: { type: String, trim: true },
  twitterUrl: { type: String, trim: true },
  sessionTitle: { type: String, trim: true },
  sessionDescription: { type: String, trim: true },
  isKeynote: { type: Boolean, default: false },
  isConfirmed: { type: Boolean, default: false }
}, {
  timestamps: true
});

const PartnerSchema = new Schema<IPartner>({
  name: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    enum: ['sponsor', 'partner', 'media', 'supporter'], 
    required: true 
  },
  level: { 
    type: String, 
    enum: ['platinum', 'gold', 'silver', 'bronze', 'supporter'], 
    required: true 
  },
  logoUrl: { type: String, required: true, trim: true },
  websiteUrl: { type: String, trim: true },
  description: { type: String, trim: true },
  isVisible: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, {
  timestamps: true
});

const AbstractSchema = new Schema<IAbstract>({
  title: { type: String, required: true, trim: true },
  presentationType: { 
    type: String, 
    enum: ['oral', 'poster'], 
    required: true 
  },
  category: { type: String, required: true, trim: true },
  primaryAuthor: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    affiliation: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true }
  },
  coAuthors: { type: String, trim: true },
  abstract: { type: String, required: true, trim: true },
  keywords: { type: String, required: true, trim: true },
  objectives: { type: String, required: true, trim: true },
  methodology: { type: String, required: true, trim: true },
  results: { type: String, required: true, trim: true },
  conclusions: { type: String, required: true, trim: true },
  implications: { type: String, trim: true },
  conflictOfInterest: { type: Boolean, default: false },
  ethicalApproval: { type: Boolean, default: false },
  consentToPublish: { type: Boolean, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  reviewComments: { type: String, trim: true }
}, {
  timestamps: true
});

// Create indexes for better performance
RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ registrationDate: -1 });
ContactSchema.index({ submittedAt: -1 });
ContactSchema.index({ status: 1 });
SpeakerSchema.index({ isKeynote: -1, isConfirmed: -1 });
PartnerSchema.index({ type: 1, level: 1, displayOrder: 1 });
AbstractSchema.index({ 'primaryAuthor.email': 1 });
AbstractSchema.index({ submittedAt: -1 });
AbstractSchema.index({ status: 1, category: 1 });

// Export models
export const Registration = mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);
export const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
export const Speaker = mongoose.models.Speaker || mongoose.model<ISpeaker>('Speaker', SpeakerSchema);
export const Partner = mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);
export const Abstract = mongoose.models.Abstract || mongoose.model<IAbstract>('Abstract', AbstractSchema);

export default {
  Registration,
  Contact,
  Speaker,
  Partner,
  Abstract
};
