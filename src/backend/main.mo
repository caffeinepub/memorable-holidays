import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

import Analytics "analytics";

import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Final actor implementation with persistent state
actor {
  ////////////////
  // Mixins     //
  ////////////////
  include MixinStorage();

  /////////////
  // Authorization (Strict admin-only access) //
  /////////////
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  /////////////
  // Types   //
  /////////////
  public type UserProfile = {
    name : Text;
    role : Text;
    email : Text;
  };

  public type CompanySettings = {
    companyName : Text;
    logo : Text;
    address : Text;
    phone : Text;
    email : Text;
    website : Text;
    whatsapp : Text;
    instagram : Text;
    facebook : Text;
    twitter : Text;
    tagline : Text;
    gstNumber : Text;
  };

  public type RateOption = {
    name : Text;
    price : Nat;
  };

  public type HotelRate = {
    hotelName : Text;
    roomType : Text;
    rate : Nat;
  };

  public type PackageTemplate = {
    id : Nat;
    category : Text;
    design : Text;
    layout : Text;
    colorScheme : Text;
    sections : Text;
  };

  public type GuestDetails = {
    name : Text;
    contactNumber : Text;
    email : Text;
    whatsapp : Text;
    adults : Nat;
    children : Nat;
    travelDates : Text;
    notes : Text;
  };

  public type Package = {
    id : Nat;
    category : Text;
    templateId : Nat;
    guest : GuestDetails;
    hotel : Text;
    roomType : Text;
    foodPackage : Text;
    travelOption : Text;
    activities : [Text];
    boating : Text;
    addOns : [Text];
    totalCost : Nat;
    createdBy : Principal;
    createdAt : Time.Time;
    lastModified : Time.Time;
  };

  public type InteractionLog = {
    date : Time.Time;
    interactionType : Text;
    channel : Text;
    notes : Text;
    createdBy : Principal;
  };

  public type CustomerRecord = {
    guest : GuestDetails;
    interactionLog : List.List<InteractionLog>;
  };

  public type Lead = {
    id : Nat;
    guestName : Text;
    phone : Text;
    email : Text;
    destination : Text;
    travelDates : Text;
    budget : Nat;
    source : Text;
    stage : Text;
    assignedTo : Text;
    followUpDate : Time.Time;
    notes : Text;
    createdAt : Time.Time;
    lastModified : Time.Time;
    linkedPackageId : Nat;
  };

  public type LeadActivity = {
    id : Nat;
    leadId : Nat;
    date : Time.Time;
    action : Text;
    notes : Text;
    createdBy : Principal;
  };

  public type Booking = {
    id : Nat;
    packageId : Nat;
    bookingType : Text;
    vendorName : Text;
    bookingRef : Text;
    status : Text;
    checkIn : Text;
    checkOut : Text;
    amount : Nat;
    notes : Text;
    createdAt : Time.Time;
  };

  public type Vendor = {
    id : Nat;
    name : Text;
    vendorType : Text;
    contactName : Text;
    phone : Text;
    email : Text;
    commissionRate : Nat;
    notes : Text;
    createdAt : Time.Time;
  };

  public type Reminder = {
    id : Nat;
    entityId : Nat;
    entityType : Text;
    reminderDate : Time.Time;
    reminderType : Text;
    message : Text;
    status : Text;
    createdBy : Principal;
  };

  public type Promotion = {
    id : Nat;
    name : Text;
    discountPercent : Nat;
    validFrom : Time.Time;
    validTo : Time.Time;
    categories : [Text];
    description : Text;
    isActive : Bool;
    createdAt : Time.Time;
  };

  public type InvoiceLineItem = {
    description : Text;
    qty : Nat;
    unitPrice : Nat;
    total : Nat;
  };

  public type Invoice = {
    id : Nat;
    invoiceNumber : Text;
    packageId : Nat;
    guestName : Text;
    lineItems : [InvoiceLineItem];
    subtotal : Nat;
    taxPercent : Nat;
    taxAmount : Nat;
    grandTotal : Nat;
    status : Text;
    issuedDate : Time.Time;
    dueDate : Time.Time;
    notes : Text;
  };

  public type ItineraryDay = {
    id : Nat;
    packageId : Nat;
    dayNumber : Nat;
    date : Text;
    title : Text;
    description : Text;
    activities : [Text];
    hotel : Text;
    meals : Text;
    notes : Text;
  };

  public type Review = {
    id : Nat;
    guestName : Text;
    rating : Nat;
    comment : Text;
    destination : Text;
    travelDate : Text;
    createdAt : Time.Time;
    isPublished : Bool;
  };

  public type AnalyticsSummary = Analytics.AnalyticsSummary;
  public type StageCount = Analytics.StageCount;
  public type DestinationCount = Analytics.DestinationCount;

  public type CredentialAccount = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    displayName : Text;
    role : Text;
    isActive : Bool;
    createdAt : Time.Time;
  };

  public type UserPrivileges = {
    accountId : Nat;
    dashboard : Bool;
    newPackage : Bool;
    packagesLibrary : Bool;
    leads : Bool;
    customers : Bool;
    bookings : Bool;
    vendors : Bool;
    reminders : Bool;
    invoices : Bool;
    promotions : Bool;
    analytics : Bool;
    reviews : Bool;
    companySettings : Bool;
    rateManagement : Bool;
  };

  public type LoginResult = {
    success : Bool;
    accountId : Nat;
    displayName : Text;
    role : Text;
    message : Text;
  };

  /////////////
  // Stores  //
  /////////////
  let userProfiles = Map.empty<Principal, UserProfile>();
  let hotelRates = Map.empty<Text, HotelRate>();
  let foodRates = Map.empty<Text, RateOption>();
  let travelRates = Map.empty<Text, RateOption>();
  let activityRates = Map.empty<Text, RateOption>();
  let boatingRates = Map.empty<Text, RateOption>();
  let addOnRates = Map.empty<Text, RateOption>();
  let packageTemplates = Map.empty<Nat, PackageTemplate>();
  let customers = Map.empty<Text, CustomerRecord>();
  let packages = Map.empty<Principal, List.List<Package>>();

  var companySettings : ?CompanySettings = null;
  let leads = Map.empty<Nat, Lead>();
  var nextLeadId : Nat = 1;
  let leadActivities = Map.empty<Nat, List.List<LeadActivity>>();
  var nextLeadActivityId : Nat = 1;
  let bookings = Map.empty<Nat, Booking>();
  var nextBookingId : Nat = 1;
  let vendors = Map.empty<Nat, Vendor>();
  var nextVendorId : Nat = 1;
  let reminders = Map.empty<Nat, Reminder>();
  var nextReminderId : Nat = 1;
  let promotions = Map.empty<Nat, Promotion>();
  var nextPromotionId : Nat = 1;
  let invoices = Map.empty<Nat, Invoice>();
  var nextInvoiceId : Nat = 1;
  let itineraryDays = Map.empty<Nat, ItineraryDay>();
  var nextItineraryDayId : Nat = 1;
  let reviews = Map.empty<Nat, Review>();
  var nextReviewId : Nat = 1;

  // New credential stores
  let credentialAccounts = Map.empty<Nat, CredentialAccount>();
  let userPrivileges = Map.empty<Nat, UserPrivileges>();
  var nextCredentialAccountId : Nat = 1;

  ////////////
  // Helper //
  ////////////

  let packageCategories = [
    "Beach",
    "Adventure",
    "Cultural",
    "Honeymoon",
    "Family",
    "Corporate",
    "Wildlife",
    "Religious",
    "Cruise",
  ];

  func adminOnly(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func userOrAdminOnly(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  ////////////////////
  // User Profiles  //
  ////////////////////
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their own profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  ///////////////////////
  // Company Settings  //
  ///////////////////////
  public shared ({ caller }) func saveCompanySettings(settings : CompanySettings) : async () {
    adminOnly(caller);
    companySettings := ?settings;
  };

  public query ({ caller }) func getCompanySettings() : async ?CompanySettings {
    userOrAdminOnly(caller);
    companySettings;
  };

  ///////////////////
  // Hotel Rates   //
  ///////////////////
  public shared ({ caller }) func addHotelRate(hotelName : Text, roomType : Text, rate : Nat) : async () {
    adminOnly(caller);
    let hotelRate : HotelRate = {
      hotelName;
      roomType;
      rate;
    };
    hotelRates.add(hotelName, hotelRate);
  };

  public shared ({ caller }) func updateHotelRate(hotelName : Text, roomType : Text, rate : Nat) : async () {
    adminOnly(caller);
    switch (hotelRates.get(hotelName)) {
      case (null) { Runtime.trap("Hotel rate not found") };
      case (?_existing) {
        let updated : HotelRate = { hotelName; roomType; rate };
        hotelRates.add(hotelName, updated);
      };
    };
  };

  public shared ({ caller }) func deleteHotelRate(hotelName : Text) : async () {
    adminOnly(caller);
    hotelRates.remove(hotelName);
  };

  public query ({ caller }) func getHotelRates() : async [HotelRate] {
    userOrAdminOnly(caller);
    hotelRates.values().toArray();
  };

  //////////////////////
  // Rate Calculator  //
  //////////////////////

  public query ({ caller }) func calculateTotalCost(
    hotel : Text,
    foodRate : Nat,
    travelRate : Nat,
    activities : [Nat],
    boatingRate : Nat,
    addOnRatesList : [Nat],
    adults : Nat,
    children : Nat,
  ) : async Nat {
    userOrAdminOnly(caller);
    let hotelRate = switch (hotelRates.get(hotel)) {
      case (?rate) { rate.rate };
      case (null) { Runtime.trap("Hotel not found") };
    };

    var activityCost = 0;
    for (rate in activities.vals()) {
      activityCost += rate;
    };

    var addOnCost = 0;
    for (rate in addOnRatesList.vals()) {
      addOnCost += rate;
    };

    let baseRate = hotelRate + foodRate + travelRate + activityCost + boatingRate + addOnCost;
    let totalCost = baseRate * adults + (baseRate * children) / 2;

    totalCost;
  };

  /////////////////////
  // Food Rates      //
  /////////////////////
  public shared ({ caller }) func addOrUpdateFoodRate(name : Text, price : Nat) : async () {
    adminOnly(caller);
    foodRates.add(name, { name; price });
  };

  public shared ({ caller }) func deleteFoodRate(name : Text) : async () {
    adminOnly(caller);
    foodRates.remove(name);
  };

  public query ({ caller }) func getAllFoodRates() : async [RateOption] {
    userOrAdminOnly(caller);
    foodRates.values().toArray();
  };

  /////////////////////
  // Travel Rates    //
  /////////////////////
  public shared ({ caller }) func addOrUpdateTravelRate(name : Text, price : Nat) : async () {
    adminOnly(caller);
    travelRates.add(name, { name; price });
  };

  public shared ({ caller }) func deleteTravelRate(name : Text) : async () {
    adminOnly(caller);
    travelRates.remove(name);
  };

  public query ({ caller }) func getAllTravelRates() : async [RateOption] {
    userOrAdminOnly(caller);
    travelRates.values().toArray();
  };

  /////////////////////
  // Activity Rates  //
  /////////////////////
  public shared ({ caller }) func addOrUpdateActivityRate(name : Text, price : Nat) : async () {
    adminOnly(caller);
    activityRates.add(name, { name; price });
  };

  public shared ({ caller }) func deleteActivityRate(name : Text) : async () {
    adminOnly(caller);
    activityRates.remove(name);
  };

  public query ({ caller }) func getAllActivityRates() : async [RateOption] {
    userOrAdminOnly(caller);
    activityRates.values().toArray();
  };

  /////////////////////
  // Boating Rates   //
  /////////////////////
  public shared ({ caller }) func addOrUpdateBoatingRate(name : Text, price : Nat) : async () {
    adminOnly(caller);
    boatingRates.add(name, { name; price });
  };

  public shared ({ caller }) func deleteBoatingRate(name : Text) : async () {
    adminOnly(caller);
    boatingRates.remove(name);
  };

  public query ({ caller }) func getAllBoatingRates() : async [RateOption] {
    userOrAdminOnly(caller);
    boatingRates.values().toArray();
  };

  /////////////////////
  // Add-On Rates    //
  /////////////////////
  public shared ({ caller }) func addOrUpdateAddOnRate(name : Text, price : Nat) : async () {
    adminOnly(caller);
    addOnRates.add(name, { name; price });
  };

  public shared ({ caller }) func deleteAddOnRate(name : Text) : async () {
    adminOnly(caller);
    addOnRates.remove(name);
  };

  public query ({ caller }) func getAllAddOnRates() : async [RateOption] {
    userOrAdminOnly(caller);
    addOnRates.values().toArray();
  };

  ///////////////////////////////
  // Handle Hotel Rates        //
  // and Convenience Deletion  //
  ///////////////////////////////
  public shared ({ caller }) func deleteRateOption(category : Text, name : Text) : async () {
    adminOnly(caller);
    switch (category) {
      case ("food") { foodRates.remove(name) };
      case ("travel") { travelRates.remove(name) };
      case ("activity") { activityRates.remove(name) };
      case ("boating") { boatingRates.remove(name) };
      case ("addon") { addOnRates.remove(name) };
      case ("hotel") { hotelRates.remove(name) };
      case (_) { Runtime.trap("Unknown rate category") };
    };
  };

  ///////////////
  // Packages  //
  ///////////////
  public shared ({ caller }) func savePackage(pkg : Package) : async () {
    userOrAdminOnly(caller);
    switch (packages.get(caller)) {
      case (null) {
        let newList = List.empty<Package>();
        newList.add(pkg);
        packages.add(caller, newList);
      };
      case (?existingList) {
        existingList.add(pkg);
      };
    };
  };

  public query ({ caller }) func getPackages() : async [Package] {
    userOrAdminOnly(caller);
    switch (packages.get(caller)) {
      case (null) { [] };
      case (?userPackages) { userPackages.toArray() };
    };
  };

  public query ({ caller }) func getAllPackages() : async [Package] {
    adminOnly(caller);
    let allPackagesList = List.empty<Package>();

    for (userPackages in packages.values()) {
      for (p in userPackages.values()) {
        allPackagesList.add(p);
      };
    };

    allPackagesList.toArray();
  };

  public shared ({ caller }) func deletePackage(packageId : Nat) : async () {
    userOrAdminOnly(caller);
    switch (packages.get(caller)) {
      case (null) { Runtime.trap("No packages found for caller.") };
      case (?userPackages) {
        let filteredPackages = userPackages.filter(
          func(p) { p.id != packageId }
        );
        packages.add(caller, filteredPackages);
      };
    };
  };

  ///////////
  // Guests//
  ///////////
  public query ({ caller }) func getGuestRecords() : async [GuestDetails] {
    userOrAdminOnly(caller);
    let guestsList = List.empty<GuestDetails>();
    for (record in customers.values()) {
      guestsList.add(record.guest);
    };
    guestsList.toArray();
  };

  public shared ({ caller }) func addOrUpdateCustomer(guest : GuestDetails) : async () {
    userOrAdminOnly(caller);
    switch (customers.get(guest.name)) {
      case (?existing) {
        let updated : CustomerRecord = {
          guest = guest;
          interactionLog = existing.interactionLog;
        };
        customers.add(guest.name, updated);
      };
      case (null) {
        let newRecord : CustomerRecord = {
          guest = guest;
          interactionLog = List.empty<InteractionLog>();
        };
        customers.add(guest.name, newRecord);
      };
    };
  };

  ////////////////////////
  // Interaction Log    //
  ////////////////////////
  public shared ({ caller }) func addInteractionLog(customerName : Text, log : InteractionLog) : async () {
    userOrAdminOnly(caller);
    switch (customers.get(customerName)) {
      case (?record) {
        record.interactionLog.add(log);
        customers.add(customerName, record);
      };
      case (null) { Runtime.trap("Customer record not found") };
    };
  };

  public query ({ caller }) func getInteractionLog(customerName : Text) : async [InteractionLog] {
    userOrAdminOnly(caller);
    switch (customers.get(customerName)) {
      case (?record) { record.interactionLog.toArray() };
      case (null) { Runtime.trap("Customer record not found") };
    };
  };

  /////////////
  // Categories
  /////////////
  public query func getCategories() : async [Text] {
    packageCategories;
  };

  /////////////////////
  // Package Templates
  /////////////////////
  public shared ({ caller }) func addTemplate(template : PackageTemplate) : async () {
    adminOnly(caller);
    packageTemplates.add(template.id, template);
  };

  public shared ({ caller }) func updateTemplate(template : PackageTemplate) : async () {
    adminOnly(caller);
    switch (packageTemplates.get(template.id)) {
      case (null) { Runtime.trap("Template not found") };
      case (?_existing) {
        packageTemplates.add(template.id, template);
      };
    };
  };

  public shared ({ caller }) func deleteTemplate(templateId : Nat) : async () {
    adminOnly(caller);
    packageTemplates.remove(templateId);
  };

  public query ({ caller }) func getTemplates() : async [PackageTemplate] {
    userOrAdminOnly(caller);
    packageTemplates.values().toArray();
  };

  public query ({ caller }) func getTemplatesByCategory(category : Text) : async [PackageTemplate] {
    userOrAdminOnly(caller);
    let filtered = packageTemplates.toArray().filter(func((_, t)) { t.category == category });
    filtered.map(func((_, t)) { t });
  };

  ///////////
  // Leads //
  ///////////
  public shared ({ caller }) func createLead(
    guestName : Text,
    phone : Text,
    email : Text,
    destination : Text,
    travelDates : Text,
    budget : Nat,
    source : Text,
    notes : Text,
  ) : async Nat {
    userOrAdminOnly(caller);
    let leadId = nextLeadId;
    nextLeadId += 1;
    let now = Time.now();
    let lead : Lead = {
      id = leadId;
      guestName;
      phone;
      email;
      destination;
      travelDates;
      budget;
      source;
      stage = "New";
      assignedTo = "";
      followUpDate = now;
      notes;
      createdAt = now;
      lastModified = now;
      linkedPackageId = 0;
    };
    leads.add(leadId, lead);
    leadId;
  };

  public shared ({ caller }) func updateLead(lead : Lead) : async () {
    userOrAdminOnly(caller);
    switch (leads.get(lead.id)) {
      case (null) { Runtime.trap("Lead not found") };
      case (?_existing) {
        leads.add(lead.id, lead);
      };
    };
  };

  public shared ({ caller }) func updateLeadStage(leadId : Nat, stage : Text) : async () {
    userOrAdminOnly(caller);
    switch (leads.get(leadId)) {
      case (null) { Runtime.trap("Lead not found") };
      case (?existing) {
        let updated : Lead = {
          id = existing.id;
          guestName = existing.guestName;
          phone = existing.phone;
          email = existing.email;
          destination = existing.destination;
          travelDates = existing.travelDates;
          budget = existing.budget;
          source = existing.source;
          stage = stage;
          assignedTo = existing.assignedTo;
          followUpDate = existing.followUpDate;
          notes = existing.notes;
          createdAt = existing.createdAt;
          lastModified = Time.now();
          linkedPackageId = existing.linkedPackageId;
        };
        leads.add(leadId, updated);
      };
    };
  };

  public shared ({ caller }) func deleteLead(leadId : Nat) : async () {
    userOrAdminOnly(caller);
    leads.remove(leadId);
  };

  public query ({ caller }) func getLeads() : async [Lead] {
    userOrAdminOnly(caller);
    leads.values().toArray();
  };

  public query ({ caller }) func getLeadById(leadId : Nat) : async ?Lead {
    userOrAdminOnly(caller);
    leads.get(leadId);
  };

  public shared ({ caller }) func addLeadActivity(leadId : Nat, action : Text, notes : Text) : async () {
    userOrAdminOnly(caller);
    switch (leads.get(leadId)) {
      case (null) { Runtime.trap("Lead not found") };
      case (?_lead) {
        let activityId = nextLeadActivityId;
        nextLeadActivityId += 1;
        let activity : LeadActivity = {
          id = activityId;
          leadId;
          date = Time.now();
          action;
          notes;
          createdBy = caller;
        };
        switch (leadActivities.get(leadId)) {
          case (null) {
            let newList = List.empty<LeadActivity>();
            newList.add(activity);
            leadActivities.add(leadId, newList);
          };
          case (?existingList) {
            existingList.add(activity);
          };
        };
      };
    };
  };

  public query ({ caller }) func getLeadActivities(leadId : Nat) : async [LeadActivity] {
    userOrAdminOnly(caller);
    switch (leadActivities.get(leadId)) {
      case (null) { [] };
      case (?activities) { activities.toArray() };
    };
  };

  //////////////
  // Bookings //
  //////////////
  public shared ({ caller }) func createBooking(
    packageId : Nat,
    bookingType : Text,
    vendorName : Text,
    bookingRef : Text,
    checkIn : Text,
    checkOut : Text,
    amount : Nat,
    notes : Text,
  ) : async Nat {
    userOrAdminOnly(caller);
    let bookingId = nextBookingId;
    nextBookingId += 1;
    let booking : Booking = {
      id = bookingId;
      packageId;
      bookingType;
      vendorName;
      bookingRef;
      status = "Pending";
      checkIn;
      checkOut;
      amount;
      notes;
      createdAt = Time.now();
    };
    bookings.add(bookingId, booking);
    bookingId;
  };

  public shared ({ caller }) func updateBooking(booking : Booking) : async () {
    userOrAdminOnly(caller);
    switch (bookings.get(booking.id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?_existing) {
        bookings.add(booking.id, booking);
      };
    };
  };

  public shared ({ caller }) func deleteBooking(bookingId : Nat) : async () {
    userOrAdminOnly(caller);
    bookings.remove(bookingId);
  };

  public query ({ caller }) func getBookings() : async [Booking] {
    userOrAdminOnly(caller);
    bookings.values().toArray();
  };

  public query ({ caller }) func getBookingsByPackage(packageId : Nat) : async [Booking] {
    userOrAdminOnly(caller);
    let filtered = bookings.values().toArray().filter(func(b) { b.packageId == packageId });
    filtered;
  };

  /////////////
  // Vendors //
  /////////////
  public shared ({ caller }) func createVendor(
    name : Text,
    vendorType : Text,
    contactName : Text,
    phone : Text,
    email : Text,
    commissionRate : Nat,
    notes : Text,
  ) : async Nat {
    userOrAdminOnly(caller);
    let vendorId = nextVendorId;
    nextVendorId += 1;
    let vendor : Vendor = {
      id = vendorId;
      name;
      vendorType;
      contactName;
      phone;
      email;
      commissionRate;
      notes;
      createdAt = Time.now();
    };
    vendors.add(vendorId, vendor);
    vendorId;
  };

  public shared ({ caller }) func updateVendor(vendor : Vendor) : async () {
    userOrAdminOnly(caller);
    switch (vendors.get(vendor.id)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?_existing) {
        vendors.add(vendor.id, vendor);
      };
    };
  };

  public shared ({ caller }) func deleteVendor(vendorId : Nat) : async () {
    userOrAdminOnly(caller);
    vendors.remove(vendorId);
  };

  public query ({ caller }) func getVendors() : async [Vendor] {
    userOrAdminOnly(caller);
    vendors.values().toArray();
  };

  public query ({ caller }) func getVendorById(vendorId : Nat) : async ?Vendor {
    userOrAdminOnly(caller);
    vendors.get(vendorId);
  };

  ///////////////
  // Reminders //
  ///////////////
  public shared ({ caller }) func createReminder(
    entityId : Nat,
    entityType : Text,
    reminderDate : Time.Time,
    reminderType : Text,
    message : Text,
  ) : async Nat {
    userOrAdminOnly(caller);
    let reminderId = nextReminderId;
    nextReminderId += 1;
    let reminder : Reminder = {
      id = reminderId;
      entityId;
      entityType;
      reminderDate;
      reminderType;
      message;
      status = "Pending";
      createdBy = caller;
    };
    reminders.add(reminderId, reminder);
    reminderId;
  };

  public shared ({ caller }) func updateReminder(reminder : Reminder) : async () {
    userOrAdminOnly(caller);
    switch (reminders.get(reminder.id)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?_existing) {
        reminders.add(reminder.id, reminder);
      };
    };
  };

  public shared ({ caller }) func markReminderDone(reminderId : Nat) : async () {
    userOrAdminOnly(caller);
    switch (reminders.get(reminderId)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?existing) {
        let updated : Reminder = {
          id = existing.id;
          entityId = existing.entityId;
          entityType = existing.entityType;
          reminderDate = existing.reminderDate;
          reminderType = existing.reminderType;
          message = existing.message;
          status = "Done";
          createdBy = existing.createdBy;
        };
        reminders.add(reminderId, updated);
      };
    };
  };

  public shared ({ caller }) func deleteReminder(reminderId : Nat) : async () {
    userOrAdminOnly(caller);
    reminders.remove(reminderId);
  };

  public query ({ caller }) func getReminders() : async [Reminder] {
    userOrAdminOnly(caller);
    reminders.values().toArray();
  };

  public query ({ caller }) func getRemindersByEntity(entityId : Nat, entityType : Text) : async [Reminder] {
    userOrAdminOnly(caller);
    let filtered = reminders.values().toArray().filter(
      func(r) { r.entityId == entityId and r.entityType == entityType }
    );
    filtered;
  };

  ////////////////
  // Promotions //
  ////////////////
  public shared ({ caller }) func createPromotion(
    name : Text,
    discountPercent : Nat,
    validFrom : Time.Time,
    validTo : Time.Time,
    categories : [Text],
    description : Text,
  ) : async Nat {
    adminOnly(caller);
    let promotionId = nextPromotionId;
    nextPromotionId += 1;
    let promotion : Promotion = {
      id = promotionId;
      name;
      discountPercent;
      validFrom;
      validTo;
      categories;
      description;
      isActive = true;
      createdAt = Time.now();
    };
    promotions.add(promotionId, promotion);
    promotionId;
  };

  public shared ({ caller }) func updatePromotion(promotion : Promotion) : async () {
    adminOnly(caller);
    switch (promotions.get(promotion.id)) {
      case (null) { Runtime.trap("Promotion not found") };
      case (?_existing) {
        promotions.add(promotion.id, promotion);
      };
    };
  };

  public shared ({ caller }) func deletePromotion(promotionId : Nat) : async () {
    adminOnly(caller);
    promotions.remove(promotionId);
  };

  public query ({ caller }) func getPromotions() : async [Promotion] {
    userOrAdminOnly(caller);
    promotions.values().toArray();
  };

  public query ({ caller }) func getActivePromotions() : async [Promotion] {
    userOrAdminOnly(caller);
    let now = Time.now();
    let filtered = promotions.values().toArray().filter(
      func(p) { p.isActive and p.validFrom <= now and p.validTo >= now }
    );
    filtered;
  };

  //////////////
  // Invoices //
  //////////////
  public shared ({ caller }) func createInvoice(
    packageId : Nat,
    guestName : Text,
    lineItems : [InvoiceLineItem],
    subtotal : Nat,
    taxPercent : Nat,
    notes : Text,
    dueDate : Time.Time,
  ) : async Nat {
    userOrAdminOnly(caller);
    let invoiceId = nextInvoiceId;
    nextInvoiceId += 1;
    let taxAmount = (subtotal * taxPercent) / 100;
    let grandTotal = subtotal + taxAmount;
    let invoice : Invoice = {
      id = invoiceId;
      invoiceNumber = "INV-" # invoiceId.toText();
      packageId;
      guestName;
      lineItems;
      subtotal;
      taxPercent;
      taxAmount;
      grandTotal;
      status = "Pending";
      issuedDate = Time.now();
      dueDate;
      notes;
    };
    invoices.add(invoiceId, invoice);
    invoiceId;
  };

  public shared ({ caller }) func updateInvoice(invoice : Invoice) : async () {
    userOrAdminOnly(caller);
    switch (invoices.get(invoice.id)) {
      case (null) { Runtime.trap("Invoice not found") };
      case (?_existing) {
        invoices.add(invoice.id, invoice);
      };
    };
  };

  public shared ({ caller }) func markInvoicePaid(invoiceId : Nat) : async () {
    userOrAdminOnly(caller);
    switch (invoices.get(invoiceId)) {
      case (null) { Runtime.trap("Invoice not found") };
      case (?existing) {
        let updated : Invoice = {
          id = existing.id;
          invoiceNumber = existing.invoiceNumber;
          packageId = existing.packageId;
          guestName = existing.guestName;
          lineItems = existing.lineItems;
          subtotal = existing.subtotal;
          taxPercent = existing.taxPercent;
          taxAmount = existing.taxAmount;
          grandTotal = existing.grandTotal;
          status = "Paid";
          issuedDate = existing.issuedDate;
          dueDate = existing.dueDate;
          notes = existing.notes;
        };
        invoices.add(invoiceId, updated);
      };
    };
  };

  public query ({ caller }) func getInvoice(invoiceId : Nat) : async ?Invoice {
    userOrAdminOnly(caller);
    invoices.get(invoiceId);
  };

  public query ({ caller }) func getInvoicesByPackage(packageId : Nat) : async [Invoice] {
    userOrAdminOnly(caller);
    let filtered = invoices.values().toArray().filter(func(i) { i.packageId == packageId });
    filtered;
  };

  public query ({ caller }) func getAllInvoices() : async [Invoice] {
    userOrAdminOnly(caller);
    invoices.values().toArray();
  };

  ////////////////////
  // Itinerary Days //
  ////////////////////
  public shared ({ caller }) func addItineraryDay(
    packageId : Nat,
    dayNumber : Nat,
    date : Text,
    title : Text,
    description : Text,
    activities : [Text],
    hotel : Text,
    meals : Text,
    notes : Text,
  ) : async Nat {
    userOrAdminOnly(caller);
    let dayId = nextItineraryDayId;
    nextItineraryDayId += 1;
    let day : ItineraryDay = {
      id = dayId;
      packageId;
      dayNumber;
      date;
      title;
      description;
      activities;
      hotel;
      meals;
      notes;
    };
    itineraryDays.add(dayId, day);
    dayId;
  };

  public shared ({ caller }) func updateItineraryDay(day : ItineraryDay) : async () {
    userOrAdminOnly(caller);
    switch (itineraryDays.get(day.id)) {
      case (null) { Runtime.trap("Itinerary day not found") };
      case (?_existing) {
        itineraryDays.add(day.id, day);
      };
    };
  };

  public shared ({ caller }) func deleteItineraryDay(dayId : Nat) : async () {
    userOrAdminOnly(caller);
    itineraryDays.remove(dayId);
  };

  public query ({ caller }) func getItineraryByPackage(packageId : Nat) : async [ItineraryDay] {
    userOrAdminOnly(caller);
    let filtered = itineraryDays.values().toArray().filter(func(d) { d.packageId == packageId });
    filtered;
  };

  /////////////
  // Reviews //
  /////////////
  public shared ({ caller }) func addReview(
    guestName : Text,
    rating : Nat,
    comment : Text,
    destination : Text,
    travelDate : Text,
  ) : async Nat {
    userOrAdminOnly(caller);
    let reviewId = nextReviewId;
    nextReviewId += 1;
    let review : Review = {
      id = reviewId;
      guestName;
      rating;
      comment;
      destination;
      travelDate;
      createdAt = Time.now();
      isPublished = false;
    };
    reviews.add(reviewId, review);
    reviewId;
  };

  public shared ({ caller }) func updateReview(review : Review) : async () {
    userOrAdminOnly(caller);
    switch (reviews.get(review.id)) {
      case (null) { Runtime.trap("Review not found") };
      case (?_existing) {
        reviews.add(review.id, review);
      };
    };
  };

  public shared ({ caller }) func deleteReview(reviewId : Nat) : async () {
    userOrAdminOnly(caller);
    reviews.remove(reviewId);
  };

  public query ({ caller }) func getReviews() : async [Review] {
    userOrAdminOnly(caller);
    reviews.values().toArray();
  };

  // Public query - no auth required
  public query func getPublishedReviews() : async [Review] {
    let filtered = reviews.values().toArray().filter(func(r) { r.isPublished });
    filtered;
  };

  ///////////////
  // Analytics //
  ///////////////
  public query ({ caller }) func getAnalyticsSummary() : async AnalyticsSummary {
    userOrAdminOnly(caller);

    var totalRevenue : Nat = 0;
    for (userPackages in packages.values()) {
      for (pkg in userPackages.values()) {
        totalRevenue += pkg.totalCost;
      };
    };

    let totalLeads = leads.size();

    var totalPackagesCount : Nat = 0;
    for (userPackages in packages.values()) {
      totalPackagesCount += userPackages.size();
    };

    let totalBookings = bookings.size();

    var bookingConfirmedCount : Nat = 0;
    for (lead in leads.values()) {
      if (lead.stage == "BookingConfirmed") {
        bookingConfirmedCount += 1;
      };
    };

    let conversionRate = if (totalLeads > 0) {
      (bookingConfirmedCount * 100) / totalLeads;
    } else {
      0;
    };

    let totalCustomers = customers.size();

    {
      totalRevenue;
      totalLeads;
      totalPackages = totalPackagesCount;
      totalBookings;
      conversionRate;
      totalCustomers;
    };
  };

  public query ({ caller }) func getLeadsByStage() : async [StageCount] {
    userOrAdminOnly(caller);

    let stageMap = Map.empty<Text, Nat>();

    for (lead in leads.values()) {
      switch (stageMap.get(lead.stage)) {
        case (null) { stageMap.add(lead.stage, 1) };
        case (?count) { stageMap.add(lead.stage, count + 1) };
      };
    };

    let result = List.empty<StageCount>();
    for ((stage, count) in stageMap.entries()) {
      result.add({ stage; count });
    };
    result.toArray();
  };

  public query ({ caller }) func getTopDestinations() : async [DestinationCount] {
    userOrAdminOnly(caller);

    let destMap = Map.empty<Text, Nat>();

    for (lead in leads.values()) {
      switch (destMap.get(lead.destination)) {
        case (null) { destMap.add(lead.destination, 1) };
        case (?count) { destMap.add(lead.destination, count + 1) };
      };
    };

    let result = List.empty<DestinationCount>();
    for ((destination, count) in destMap.entries()) {
      result.add({ destination; count });
    };
    result.toArray();
  };

  ///////////////
  // Credential Account Management
  ///////////////
  public shared ({ caller }) func createCredentialUser(
    username : Text,
    passwordHash : Text,
    displayName : Text,
    role : Text,
  ) : async Nat {
    adminOnly(caller);

    for (access in credentialAccounts.values()) {
      if (access.username == username) {
        Runtime.trap("Username already exists");
      };
    };

    let userId = nextCredentialAccountId;
    nextCredentialAccountId += 1;

    let credentialAccount : CredentialAccount = {
      id = userId;
      username;
      passwordHash;
      displayName;
      role;
      isActive = true;
      createdAt = Time.now();
    };
    credentialAccounts.add(userId, credentialAccount);

    let defaultPrivileges : UserPrivileges = {
      accountId = userId;
      dashboard = false;
      newPackage = false;
      packagesLibrary = false;
      leads = false;
      customers = false;
      bookings = false;
      vendors = false;
      reminders = false;
      invoices = false;
      promotions = false;
      analytics = false;
      reviews = false;
      companySettings = false;
      rateManagement = false;
    };
    userPrivileges.add(userId, defaultPrivileges);

    userId;
  };

  public shared ({ caller }) func updateCredentialUser(
    id : Nat,
    displayName : Text,
    role : Text,
    isActive : Bool,
  ) : async () {
    adminOnly(caller);

    switch (credentialAccounts.get(id)) {
      case (null) { Runtime.trap("Credential account not found") };
      case (?existing) {
        let updated : CredentialAccount = {
          id = existing.id;
          username = existing.username;
          passwordHash = existing.passwordHash;
          displayName;
          role;
          isActive;
          createdAt = existing.createdAt;
        };
        credentialAccounts.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func resetCredentialPassword(id : Nat, newPasswordHash : Text) : async () {
    adminOnly(caller);

    switch (credentialAccounts.get(id)) {
      case (null) { Runtime.trap("Credential account not found") };
      case (?existing) {
        let updated : CredentialAccount = {
          id = existing.id;
          username = existing.username;
          passwordHash = newPasswordHash;
          displayName = existing.displayName;
          role = existing.role;
          isActive = existing.isActive;
          createdAt = existing.createdAt;
        };
        credentialAccounts.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteCredentialUser(id : Nat) : async () {
    adminOnly(caller);
    credentialAccounts.remove(id);
    userPrivileges.remove(id);
  };

  public query ({ caller }) func listCredentialUsers() : async [CredentialAccount] {
    adminOnly(caller);
    credentialAccounts.values().toArray();
  };

  ///////////////
  // Privileges
  ///////////////
  public shared ({ caller }) func setUserPrivileges(privileges : UserPrivileges) : async () {
    adminOnly(caller);

    switch (credentialAccounts.get(privileges.accountId)) {
      case (null) { Runtime.trap("Credential account not found") };
      case (?_existing) {
        userPrivileges.add(privileges.accountId, privileges);
      };
    };
  };

  public query ({ caller }) func getUserPrivileges(accountId : Nat) : async ?UserPrivileges {
    adminOnly(caller);
    userPrivileges.get(accountId);
  };

  public query ({ caller }) func getPublicPrivileges(accountId : Nat) : async ?UserPrivileges {
    userOrAdminOnly(caller);
    userPrivileges.get(accountId);
  };

  ///////////////
  // Login
  ///////////////
  public query func loginWithCredentials(username : Text, passwordHash : Text) : async LoginResult {
    var foundAccount : ?CredentialAccount = null;

    for (access in credentialAccounts.values()) {
      if (access.username == username) {
        foundAccount := ?access;
      };
    };

    switch (foundAccount) {
      case (null) {
        {
          success = false;
          accountId = 0;
          displayName = "";
          role = "";
          message = "Invalid username or password";
        };
      };
      case (?account) {
        if (not account.isActive) {
          return {
            success = false;
            accountId = 0;
            displayName = "";
            role = "";
            message = "Account is disabled";
          };
        };

        if (account.passwordHash != passwordHash) {
          return {
            success = false;
            accountId = 0;
            displayName = "";
            role = "";
            message = "Invalid username or password";
          };
        };

        {
          success = true;
          accountId = account.id;
          displayName = account.displayName;
          role = account.role;
          message = "Login successful";
        };
      };
    };
  };
};
