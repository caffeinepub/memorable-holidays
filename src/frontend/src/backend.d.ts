import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InteractionLog {
    interactionType: string;
    date: Time;
    createdBy: Principal;
    notes: string;
    channel: string;
}
export interface UserProfile {
    name: string;
    role: string;
    email: string;
}
export interface AnalyticsSummary {
    totalBookings: bigint;
    totalPackages: bigint;
    totalLeads: bigint;
    conversionRate: bigint;
    totalRevenue: bigint;
    totalCustomers: bigint;
}
export type Time = bigint;
export interface RateOption {
    name: string;
    price: bigint;
}
export interface Lead {
    id: bigint;
    destination: string;
    assignedTo: string;
    source: string;
    createdAt: Time;
    travelDates: string;
    guestName: string;
    email: string;
    lastModified: Time;
    stage: string;
    notes: string;
    linkedPackageId: bigint;
    phone: string;
    budget: bigint;
    followUpDate: Time;
}
export interface ItineraryDay {
    id: bigint;
    meals: string;
    title: string;
    hotel: string;
    date: string;
    activities: Array<string>;
    description: string;
    dayNumber: bigint;
    notes: string;
    packageId: bigint;
}
export interface Reminder {
    id: bigint;
    status: string;
    createdBy: Principal;
    reminderDate: Time;
    entityId: bigint;
    reminderType: string;
    message: string;
    entityType: string;
}
export interface CompanySettings {
    twitter: string;
    tagline: string;
    gstNumber: string;
    instagram: string;
    logo: string;
    whatsapp: string;
    email: string;
    website: string;
    facebook: string;
    address: string;
    companyName: string;
    phone: string;
}
export interface Booking {
    id: bigint;
    status: string;
    checkIn: string;
    createdAt: Time;
    notes: string;
    bookingType: string;
    checkOut: string;
    amount: bigint;
    bookingRef: string;
    vendorName: string;
    packageId: bigint;
}
export interface GuestDetails {
    name: string;
    travelDates: string;
    whatsapp: string;
    email: string;
    children: bigint;
    notes: string;
    adults: bigint;
    contactNumber: string;
}
export interface Vendor {
    id: bigint;
    contactName: string;
    name: string;
    createdAt: Time;
    email: string;
    notes: string;
    commissionRate: bigint;
    phone: string;
    vendorType: string;
}
export interface Review {
    id: bigint;
    destination: string;
    isPublished: boolean;
    createdAt: Time;
    guestName: string;
    comment: string;
    travelDate: string;
    rating: bigint;
}
export interface UserPrivileges {
    promotions: boolean;
    companySettings: boolean;
    dashboard: boolean;
    reviews: boolean;
    vendors: boolean;
    accountId: bigint;
    bookings: boolean;
    analytics: boolean;
    leads: boolean;
    rateManagement: boolean;
    newPackage: boolean;
    packagesLibrary: boolean;
    invoices: boolean;
    reminders: boolean;
    customers: boolean;
}
export interface Promotion {
    id: bigint;
    categories: Array<string>;
    validFrom: Time;
    name: string;
    createdAt: Time;
    description: string;
    discountPercent: bigint;
    validTo: Time;
    isActive: boolean;
}
export interface PackageTemplate {
    id: bigint;
    layout: string;
    design: string;
    category: string;
    sections: string;
    colorScheme: string;
}
export interface CredentialAccount {
    id: bigint;
    username: string;
    displayName: string;
    createdAt: Time;
    role: string;
    isActive: boolean;
    passwordHash: string;
}
export interface LeadActivity {
    id: bigint;
    action: string;
    date: Time;
    createdBy: Principal;
    leadId: bigint;
    notes: string;
}
export interface StageCount {
    count: bigint;
    stage: string;
}
export interface Package {
    id: bigint;
    hotel: string;
    templateId: bigint;
    createdAt: Time;
    createdBy: Principal;
    activities: Array<string>;
    totalCost: bigint;
    boating: string;
    lastModified: Time;
    foodPackage: string;
    guest: GuestDetails;
    addOns: Array<string>;
    category: string;
    travelOption: string;
    roomType: string;
}
export interface Invoice {
    id: bigint;
    status: string;
    lineItems: Array<InvoiceLineItem>;
    taxPercent: bigint;
    dueDate: Time;
    guestName: string;
    issuedDate: Time;
    grandTotal: bigint;
    invoiceNumber: string;
    notes: string;
    taxAmount: bigint;
    packageId: bigint;
    subtotal: bigint;
}
export interface HotelRate {
    hotelName: string;
    rate: bigint;
    roomType: string;
}
export interface DestinationCount {
    destination: string;
    count: bigint;
}
export interface LoginResult {
    accountId: bigint;
    displayName: string;
    role: string;
    message: string;
    success: boolean;
}
export interface InvoiceLineItem {
    qty: bigint;
    total: bigint;
    description: string;
    unitPrice: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addHotelRate(hotelName: string, roomType: string, rate: bigint): Promise<void>;
    addInteractionLog(customerName: string, log: InteractionLog): Promise<void>;
    addItineraryDay(packageId: bigint, dayNumber: bigint, date: string, title: string, description: string, activities: Array<string>, hotel: string, meals: string, notes: string): Promise<bigint>;
    addLeadActivity(leadId: bigint, action: string, notes: string): Promise<void>;
    addOrUpdateActivityRate(name: string, price: bigint): Promise<void>;
    addOrUpdateAddOnRate(name: string, price: bigint): Promise<void>;
    addOrUpdateBoatingRate(name: string, price: bigint): Promise<void>;
    addOrUpdateCustomer(guest: GuestDetails): Promise<void>;
    addOrUpdateFoodRate(name: string, price: bigint): Promise<void>;
    addOrUpdateTravelRate(name: string, price: bigint): Promise<void>;
    addReview(guestName: string, rating: bigint, comment: string, destination: string, travelDate: string): Promise<bigint>;
    addTemplate(template: PackageTemplate): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateTotalCost(hotel: string, foodRate: bigint, travelRate: bigint, activities: Array<bigint>, boatingRate: bigint, addOnRatesList: Array<bigint>, adults: bigint, children: bigint): Promise<bigint>;
    createBooking(packageId: bigint, bookingType: string, vendorName: string, bookingRef: string, checkIn: string, checkOut: string, amount: bigint, notes: string): Promise<bigint>;
    createCredentialUser(username: string, passwordHash: string, displayName: string, role: string): Promise<bigint>;
    createInvoice(packageId: bigint, guestName: string, lineItems: Array<InvoiceLineItem>, subtotal: bigint, taxPercent: bigint, notes: string, dueDate: Time): Promise<bigint>;
    createLead(guestName: string, phone: string, email: string, destination: string, travelDates: string, budget: bigint, source: string, notes: string): Promise<bigint>;
    createPromotion(name: string, discountPercent: bigint, validFrom: Time, validTo: Time, categories: Array<string>, description: string): Promise<bigint>;
    createReminder(entityId: bigint, entityType: string, reminderDate: Time, reminderType: string, message: string): Promise<bigint>;
    createVendor(name: string, vendorType: string, contactName: string, phone: string, email: string, commissionRate: bigint, notes: string): Promise<bigint>;
    deleteActivityRate(name: string): Promise<void>;
    deleteAddOnRate(name: string): Promise<void>;
    deleteBoatingRate(name: string): Promise<void>;
    deleteBooking(bookingId: bigint): Promise<void>;
    deleteCredentialUser(id: bigint): Promise<void>;
    deleteFoodRate(name: string): Promise<void>;
    deleteHotelRate(hotelName: string): Promise<void>;
    deleteItineraryDay(dayId: bigint): Promise<void>;
    deleteLead(leadId: bigint): Promise<void>;
    deletePackage(packageId: bigint): Promise<void>;
    deletePromotion(promotionId: bigint): Promise<void>;
    deleteRateOption(category: string, name: string): Promise<void>;
    deleteReminder(reminderId: bigint): Promise<void>;
    deleteReview(reviewId: bigint): Promise<void>;
    deleteTemplate(templateId: bigint): Promise<void>;
    deleteTravelRate(name: string): Promise<void>;
    deleteVendor(vendorId: bigint): Promise<void>;
    getActivePromotions(): Promise<Array<Promotion>>;
    getAllActivityRates(): Promise<Array<RateOption>>;
    getAllAddOnRates(): Promise<Array<RateOption>>;
    getAllBoatingRates(): Promise<Array<RateOption>>;
    getAllFoodRates(): Promise<Array<RateOption>>;
    getAllInvoices(): Promise<Array<Invoice>>;
    getAllPackages(): Promise<Array<Package>>;
    getAllTravelRates(): Promise<Array<RateOption>>;
    getAnalyticsSummary(): Promise<AnalyticsSummary>;
    getBookings(): Promise<Array<Booking>>;
    getBookingsByPackage(packageId: bigint): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<string>>;
    getCompanySettings(): Promise<CompanySettings | null>;
    getGuestRecords(): Promise<Array<GuestDetails>>;
    getHotelRates(): Promise<Array<HotelRate>>;
    getInteractionLog(customerName: string): Promise<Array<InteractionLog>>;
    getInvoice(invoiceId: bigint): Promise<Invoice | null>;
    getInvoicesByPackage(packageId: bigint): Promise<Array<Invoice>>;
    getItineraryByPackage(packageId: bigint): Promise<Array<ItineraryDay>>;
    getLeadActivities(leadId: bigint): Promise<Array<LeadActivity>>;
    getLeadById(leadId: bigint): Promise<Lead | null>;
    getLeads(): Promise<Array<Lead>>;
    getLeadsByStage(): Promise<Array<StageCount>>;
    getPackages(): Promise<Array<Package>>;
    getPromotions(): Promise<Array<Promotion>>;
    getPublicPrivileges(accountId: bigint): Promise<UserPrivileges | null>;
    getPublishedReviews(): Promise<Array<Review>>;
    getReminders(): Promise<Array<Reminder>>;
    getRemindersByEntity(entityId: bigint, entityType: string): Promise<Array<Reminder>>;
    getReviews(): Promise<Array<Review>>;
    getTemplates(): Promise<Array<PackageTemplate>>;
    getTemplatesByCategory(category: string): Promise<Array<PackageTemplate>>;
    getTopDestinations(): Promise<Array<DestinationCount>>;
    getUserPrivileges(accountId: bigint): Promise<UserPrivileges | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVendorById(vendorId: bigint): Promise<Vendor | null>;
    getVendors(): Promise<Array<Vendor>>;
    isCallerAdmin(): Promise<boolean>;
    listCredentialUsers(): Promise<Array<CredentialAccount>>;
    loginWithCredentials(username: string, passwordHash: string): Promise<LoginResult>;
    markInvoicePaid(invoiceId: bigint): Promise<void>;
    markReminderDone(reminderId: bigint): Promise<void>;
    resetCredentialPassword(id: bigint, newPasswordHash: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCompanySettings(settings: CompanySettings): Promise<void>;
    savePackage(pkg: Package): Promise<void>;
    setUserPrivileges(privileges: UserPrivileges): Promise<void>;
    updateBooking(booking: Booking): Promise<void>;
    updateCredentialUser(id: bigint, displayName: string, role: string, isActive: boolean): Promise<void>;
    updateHotelRate(hotelName: string, roomType: string, rate: bigint): Promise<void>;
    updateInvoice(invoice: Invoice): Promise<void>;
    updateItineraryDay(day: ItineraryDay): Promise<void>;
    updateLead(lead: Lead): Promise<void>;
    updateLeadStage(leadId: bigint, stage: string): Promise<void>;
    updatePromotion(promotion: Promotion): Promise<void>;
    updateReminder(reminder: Reminder): Promise<void>;
    updateReview(review: Review): Promise<void>;
    updateTemplate(template: PackageTemplate): Promise<void>;
    updateVendor(vendor: Vendor): Promise<void>;
}
