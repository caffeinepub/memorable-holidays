module {
  public type AnalyticsSummary = {
    totalRevenue : Nat;
    totalLeads : Nat;
    totalPackages : Nat;
    totalBookings : Nat;
    conversionRate : Nat;
    totalCustomers : Nat;
  };

  public type StageCount = {
    stage : Text;
    count : Nat;
  };

  public type DestinationCount = {
    destination : Text;
    count : Nat;
  };
};
