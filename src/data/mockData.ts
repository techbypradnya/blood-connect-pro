export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  city: string;
  lastDonation: string;
  available: boolean;
}

export const mockDonors: Donor[] = [
  { id: "1", name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 98765 43210", bloodGroup: "O+", city: "Mumbai", lastDonation: "2025-11-15", available: true },
  { id: "2", name: "Priya Patel", email: "priya@example.com", phone: "+91 87654 32109", bloodGroup: "A+", city: "Delhi", lastDonation: "2025-12-01", available: true },
  { id: "3", name: "Rahul Verma", email: "rahul@example.com", phone: "+91 76543 21098", bloodGroup: "B+", city: "Mumbai", lastDonation: "2025-10-20", available: false },
  { id: "4", name: "Sneha Gupta", email: "sneha@example.com", phone: "+91 65432 10987", bloodGroup: "AB-", city: "Bangalore", lastDonation: "2026-01-05", available: true },
  { id: "5", name: "Vikram Singh", email: "vikram@example.com", phone: "+91 54321 09876", bloodGroup: "O-", city: "Delhi", lastDonation: "2025-09-10", available: true },
  { id: "6", name: "Ananya Iyer", email: "ananya@example.com", phone: "+91 43210 98765", bloodGroup: "A-", city: "Chennai", lastDonation: "2026-02-01", available: false },
];
