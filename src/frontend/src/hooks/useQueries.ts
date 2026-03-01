import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CredentialAccount,
  GuestDetails,
  HotelRate,
  InteractionLog,
  Package,
  PackageTemplate,
  RateOption,
  UserPrivileges,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// ─── Hotel Rates ─────────────────────────────────────────────────────────────

export function useGetHotelRates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HotelRate[]>({
    queryKey: ["hotelRates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHotelRates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddHotelRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hotelName,
      roomType,
      rate,
    }: { hotelName: string; roomType: string; rate: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addHotelRate(hotelName, roomType, rate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotelRates"] });
    },
  });
}

export function useUpdateHotelRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hotelName,
      roomType,
      rate,
    }: { hotelName: string; roomType: string; rate: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateHotelRate(hotelName, roomType, rate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotelRates"] });
    },
  });
}

export function useDeleteHotelRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hotelName: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteHotelRate(hotelName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotelRates"] });
    },
  });
}

// ─── Food Rates ───────────────────────────────────────────────────────────────

export function useGetAllFoodRates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RateOption[]>({
    queryKey: ["foodRates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFoodRates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOrUpdateFoodRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, price }: { name: string; price: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addOrUpdateFoodRate(name, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodRates"] });
    },
  });
}

export function useDeleteFoodRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteFoodRate(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodRates"] });
    },
  });
}

// ─── Travel Rates ─────────────────────────────────────────────────────────────

export function useGetAllTravelRates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RateOption[]>({
    queryKey: ["travelRates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTravelRates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOrUpdateTravelRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, price }: { name: string; price: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addOrUpdateTravelRate(name, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travelRates"] });
    },
  });
}

export function useDeleteTravelRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteTravelRate(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travelRates"] });
    },
  });
}

// ─── Activity Rates ───────────────────────────────────────────────────────────

export function useGetAllActivityRates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RateOption[]>({
    queryKey: ["activityRates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllActivityRates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOrUpdateActivityRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, price }: { name: string; price: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addOrUpdateActivityRate(name, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activityRates"] });
    },
  });
}

export function useDeleteActivityRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteActivityRate(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activityRates"] });
    },
  });
}

// ─── Boating Rates ────────────────────────────────────────────────────────────

export function useGetAllBoatingRates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RateOption[]>({
    queryKey: ["boatingRates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBoatingRates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOrUpdateBoatingRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, price }: { name: string; price: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addOrUpdateBoatingRate(name, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boatingRates"] });
    },
  });
}

export function useDeleteBoatingRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteBoatingRate(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boatingRates"] });
    },
  });
}

// ─── Add-On Rates ─────────────────────────────────────────────────────────────

export function useGetAllAddOnRates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RateOption[]>({
    queryKey: ["addOnRates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAddOnRates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOrUpdateAddOnRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, price }: { name: string; price: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addOrUpdateAddOnRate(name, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addOnRates"] });
    },
  });
}

export function useDeleteAddOnRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAddOnRate(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addOnRates"] });
    },
  });
}

// ─── Templates ───────────────────────────────────────────────────────────────

export function useGetTemplates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PackageTemplate[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTemplatesByCategory(category: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PackageTemplate[]>({
    queryKey: ["templates", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplatesByCategory(category);
    },
    enabled: !!actor && !actorFetching && !!category,
  });
}

export function useAddTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: PackageTemplate) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addTemplate(template);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

// ─── Packages ─────────────────────────────────────────────────────────────────

export function useGetPackages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Package[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPackages();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllPackages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Package[]>({
    queryKey: ["allPackages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPackages();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSavePackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pkg: Package) => {
      if (!actor) throw new Error("Actor not available");
      return actor.savePackage(pkg);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["allPackages"] });
    },
  });
}

export function useDeletePackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePackage(packageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["allPackages"] });
    },
  });
}

// ─── Customers ────────────────────────────────────────────────────────────────

export function useGetGuestRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GuestDetails[]>({
    queryKey: ["guestRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGuestRecords();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOrUpdateCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guest: GuestDetails) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addOrUpdateCustomer(guest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestRecords"] });
    },
  });
}

// ─── Interaction Log ──────────────────────────────────────────────────────────

export function useGetInteractionLog(customerName: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InteractionLog[]>({
    queryKey: ["interactionLog", customerName],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInteractionLog(customerName);
    },
    enabled: !!actor && !actorFetching && !!customerName,
  });
}

export function useAddInteractionLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerName,
      log,
    }: { customerName: string; log: InteractionLog }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addInteractionLog(customerName, log);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["interactionLog", variables.customerName],
      });
    },
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useGetCategories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Leads ───────────────────────────────────────────────────────────────────

export function useGetLeads() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeads();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetLeadById(leadId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Lead | null>({
    queryKey: ["lead", String(leadId)],
    queryFn: async () => {
      if (!actor || leadId === null) return null;
      return actor.getLeadById(leadId);
    },
    enabled: !!actor && !actorFetching && leadId !== null,
  });
}

export function useCreateLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      guestName: string;
      phone: string;
      email: string;
      destination: string;
      travelDates: string;
      budget: bigint;
      source: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createLead(
        params.guestName,
        params.phone,
        params.email,
        params.destination,
        params.travelDates,
        params.budget,
        params.source,
        params.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useUpdateLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lead: import("../backend.d.ts").Lead) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateLead(lead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useUpdateLeadStage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      leadId,
      stage,
    }: { leadId: bigint; stage: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateLeadStage(leadId, stage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useDeleteLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (leadId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteLead(leadId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useGetLeadActivities(leadId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").LeadActivity[]>({
    queryKey: ["leadActivities", String(leadId)],
    queryFn: async () => {
      if (!actor || leadId === null) return [];
      return actor.getLeadActivities(leadId);
    },
    enabled: !!actor && !actorFetching && leadId !== null,
  });
}

export function useAddLeadActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      leadId,
      action,
      notes,
    }: { leadId: bigint; action: string; notes: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addLeadActivity(leadId, action, notes);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["leadActivities", String(variables.leadId)],
      });
    },
  });
}

export function useGetLeadsByStage() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").StageCount[]>({
    queryKey: ["leadsByStage"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeadsByStage();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export function useGetBookings() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetBookingsByPackage(packageId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Booking[]>({
    queryKey: ["bookings", "package", String(packageId)],
    queryFn: async () => {
      if (!actor || packageId === null) return [];
      return actor.getBookingsByPackage(packageId);
    },
    enabled: !!actor && !actorFetching && packageId !== null,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      packageId: bigint;
      bookingType: string;
      vendorName: string;
      bookingRef: string;
      checkIn: string;
      checkOut: string;
      amount: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBooking(
        params.packageId,
        params.bookingType,
        params.vendorName,
        params.bookingRef,
        params.checkIn,
        params.checkOut,
        params.amount,
        params.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpdateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (booking: import("../backend.d.ts").Booking) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateBooking(booking);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useDeleteBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// ─── Vendors ──────────────────────────────────────────────────────────────────

export function useGetVendors() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Vendor[]>({
    queryKey: ["vendors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVendors();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      vendorType: string;
      contactName: string;
      phone: string;
      email: string;
      commissionRate: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createVendor(
        params.name,
        params.vendorType,
        params.contactName,
        params.phone,
        params.email,
        params.commissionRate,
        params.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useUpdateVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vendor: import("../backend.d.ts").Vendor) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateVendor(vendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useDeleteVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vendorId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteVendor(vendorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

// ─── Reminders ────────────────────────────────────────────────────────────────

export function useGetReminders() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Reminder[]>({
    queryKey: ["reminders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReminders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      entityId: bigint;
      entityType: string;
      reminderDate: bigint;
      reminderType: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createReminder(
        params.entityId,
        params.entityType,
        params.reminderDate,
        params.reminderType,
        params.message,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useMarkReminderDone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reminderId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markReminderDone(reminderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useDeleteReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reminderId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteReminder(reminderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

// ─── Promotions ───────────────────────────────────────────────────────────────

export function useGetPromotions() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Promotion[]>({
    queryKey: ["promotions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPromotions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetActivePromotions() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Promotion[]>({
    queryKey: ["activePromotions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivePromotions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreatePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      discountPercent: bigint;
      validFrom: bigint;
      validTo: bigint;
      categories: string[];
      description: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPromotion(
        params.name,
        params.discountPercent,
        params.validFrom,
        params.validTo,
        params.categories,
        params.description,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["activePromotions"] });
    },
  });
}

export function useUpdatePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (promotion: import("../backend.d.ts").Promotion) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePromotion(promotion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["activePromotions"] });
    },
  });
}

export function useDeletePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (promotionId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePromotion(promotionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["activePromotions"] });
    },
  });
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export function useGetAllInvoices() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Invoice[]>({
    queryKey: ["allInvoices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInvoices();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetInvoice(invoiceId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Invoice | null>({
    queryKey: ["invoice", String(invoiceId)],
    queryFn: async () => {
      if (!actor || invoiceId === null) return null;
      return actor.getInvoice(invoiceId);
    },
    enabled: !!actor && !actorFetching && invoiceId !== null,
  });
}

export function useCreateInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      packageId: bigint;
      guestName: string;
      lineItems: import("../backend.d.ts").InvoiceLineItem[];
      subtotal: bigint;
      taxPercent: bigint;
      notes: string;
      dueDate: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createInvoice(
        params.packageId,
        params.guestName,
        params.lineItems,
        params.subtotal,
        params.taxPercent,
        params.notes,
        params.dueDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allInvoices"] });
    },
  });
}

export function useMarkInvoicePaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markInvoicePaid(invoiceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allInvoices"] });
    },
  });
}

// ─── Itinerary ────────────────────────────────────────────────────────────────

export function useGetItineraryByPackage(packageId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").ItineraryDay[]>({
    queryKey: ["itinerary", String(packageId)],
    queryFn: async () => {
      if (!actor || packageId === null) return [];
      return actor.getItineraryByPackage(packageId);
    },
    enabled: !!actor && !actorFetching && packageId !== null,
  });
}

export function useAddItineraryDay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      packageId: bigint;
      dayNumber: bigint;
      date: string;
      title: string;
      description: string;
      activities: string[];
      hotel: string;
      meals: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addItineraryDay(
        params.packageId,
        params.dayNumber,
        params.date,
        params.title,
        params.description,
        params.activities,
        params.hotel,
        params.meals,
        params.notes,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["itinerary", String(variables.packageId)],
      });
    },
  });
}

export function useUpdateItineraryDay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (day: import("../backend.d.ts").ItineraryDay) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateItineraryDay(day);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["itinerary", String(variables.packageId)],
      });
    },
  });
}

export function useDeleteItineraryDay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ dayId }: { dayId: bigint; packageId: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteItineraryDay(dayId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["itinerary", String(variables.packageId)],
      });
    },
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function useGetReviews() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").Review[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      guestName: string;
      rating: bigint;
      comment: string;
      destination: string;
      travelDate: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addReview(
        params.guestName,
        params.rating,
        params.comment,
        params.destination,
        params.travelDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useUpdateReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: import("../backend.d.ts").Review) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateReview(review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteReview(reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function useGetAnalyticsSummary() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").AnalyticsSummary | null>({
    queryKey: ["analyticsSummary"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAnalyticsSummary();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTopDestinations() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").DestinationCount[]>({
    queryKey: ["topDestinations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopDestinations();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Company Settings ─────────────────────────────────────────────────────────

export function useGetCompanySettings() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<import("../backend.d.ts").CompanySettings | null>({
    queryKey: ["companySettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCompanySettings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveCompanySettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: import("../backend.d.ts").CompanySettings) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCompanySettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companySettings"] });
    },
  });
}

// ─── Credential Users ─────────────────────────────────────────────────────────

export function useListCredentialUsers() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<CredentialAccount[]>({
    queryKey: ["credentialUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCredentialUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateCredentialUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      username: string;
      passwordHash: string;
      displayName: string;
      role: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createCredentialUser(
        params.username,
        params.passwordHash,
        params.displayName,
        params.role,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentialUsers"] });
    },
  });
}

export function useUpdateCredentialUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      displayName: string;
      role: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateCredentialUser(
        params.id,
        params.displayName,
        params.role,
        params.isActive,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentialUsers"] });
    },
  });
}

export function useDeleteCredentialUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteCredentialUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentialUsers"] });
    },
  });
}

export function useResetCredentialPassword() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: { id: bigint; newPasswordHash: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.resetCredentialPassword(params.id, params.newPasswordHash);
    },
  });
}

export function useSetUserPrivileges() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (privileges: UserPrivileges) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setUserPrivileges(privileges);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userPrivileges", String(variables.accountId)],
      });
    },
  });
}

export function useGetUserPrivileges(accountId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<UserPrivileges | null>({
    queryKey: ["userPrivileges", String(accountId)],
    queryFn: async () => {
      if (!actor || accountId === null) return null;
      return actor.getUserPrivileges(accountId);
    },
    enabled: !!actor && !actorFetching && accountId !== null,
  });
}

// ─── Rate Calculation ─────────────────────────────────────────────────────────

export function useCalculateTotalCost() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: {
      hotel: string;
      foodRate: bigint;
      travelRate: bigint;
      activities: bigint[];
      boatingRate: bigint;
      addOnRates: bigint[];
      adults: bigint;
      children: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.calculateTotalCost(
        params.hotel,
        params.foodRate,
        params.travelRate,
        params.activities,
        params.boatingRate,
        params.addOnRates,
        params.adults,
        params.children,
      );
    },
  });
}
