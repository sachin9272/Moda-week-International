import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    requestParticipation: {
        type: String
    },
    additionalInfo: {
        type: String
    },
    // Press & Media Accreditation Fields
    companyName: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    fax: { type: String },
    website: { type: String },
    currentEvent: { type: String },
    jobTitle: { type: String },
    date: { type: String },
    signature: { type: String },
    mediaReleaseNames: [{ type: String }],
    mediaName: { type: String },
    photo: {
        url: { type: String },
        publicId: { type: String }
    },

    // Volunteer & Internship Fields
    educationMajor: { type: String },
    schoolAddress: { type: String },
    volunteeringInterests: [{ type: String }],

    // Booth / Table Exhibition Fields
    businessType: { type: String },
    exhibitItems: { type: String },
    preferredEventLocation: { type: String },
    boothTablePreference: { type: String },
    samplesDemonstrations: { type: String },
    specialRequirements: { type: String },
    brandLogo: {
        url: { type: String },
        publicId: { type: String }
    },

    // Consulting Services Fields
    consultationTypes: [{ type: String }],
    projectDescription: { type: String },
    assistanceNeeded: { type: String },
    desiredStartDate: { type: String },
    estimatedBudget: { type: String },

    // Digital Marketing & Media Promotion Fields
    promoteDescription: { type: String },
    servicesInterested: [{ type: String }],
    targetAudience: { type: String },
    targetMarket: { type: String },
    campaignStartDate: { type: String },
    campaignDuration: { type: String },
    mediaKit: {
        url: { type: String },
        publicId: { type: String }
    },

    // Fashion Show Production Fields
    brandName: { type: String },
    contactName: { type: String },
    collectionType: { type: String },
    numberOfLooks: { type: String },
    targetCategory: { type: String },
    productionTypes: [{ type: String }],
    modelsRequired: { type: String },
    hairMakeupRequired: { type: String },
    photoVideoRequired: { type: String },
    preferredCityCountry: { type: String },
    preferredEventDate: { type: String },
    lookbook: {
        url: { type: String },
        publicId: { type: String }
    },

    // Membership Programs Fields
    membershipProgram: { type: String },
    membershipType: { type: String },
    membershipGoals: { type: String },
    areasOfInterest: [{ type: String }],
    professionalBio: { type: String },
    membershipLogo: {
        url: { type: String },
        publicId: { type: String }
    },

    // Performances & Live Entertainment Fields
    performanceTypes: [{ type: String }],
    numberOfPerformers: { type: String },
    performanceDuration: { type: String },
    stageRequirements: { type: String },
    eventInterestedIn: { type: String },
    performanceVideoLink: { type: String },
    artistBio: { type: String },
    pressKit: {
        url: { type: String },
        publicId: { type: String }
    },

    // Top Models & Casting Opportunities Fields
    age: { type: Number },
    gender: { type: String },
    instagram: { type: String },
    height: { type: String },
    bustChest: { type: String },
    waist: { type: String },
    hips: { type: String },
    dressSuitSize: { type: String },
    shoeSize: { type: String },
    eyeColor: { type: String },
    hairColor: { type: String },
    modelingExperience: { type: String },
    agencyRepresented: { type: String },
    runwayExperience: { type: String },
    eventCastingInterest: { type: String },
    compCard: {
        url: { type: String },
        publicId: { type: String }
    },
    digitals: {
        url: { type: String },
        publicId: { type: String }
    },
    runwayVideoLink: { type: String },
    availability: { type: String },
    parentGuardianContact: { type: String },

    // Application Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
