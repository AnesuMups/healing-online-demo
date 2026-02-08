// ==========================================
// Global Healer Online - Simulated API Layer
// Replace these functions with real API calls
// when connecting to a backend.
// ==========================================

import type { UserRole } from "@/contexts/auth-context"

// ---- Types ----
export interface MembershipPlan {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  recommended?: boolean
}

export interface PatientRecord {
  id: string
  patientId: string
  patientName: string
  email: string
  gender: string
  age: number
  membershipPlan: string
  membershipStatus: string
  submittedAt: string
  consultationStatus: "pending" | "in-progress" | "completed"
  medicalHistory: string
  chronicCondition: boolean
  causeOfInfection: string
  currentCondition: string
  otherTreatments: string
  ailments: string[]
}

export interface AdminStats {
  totalPatients: number
  activeSubscriptions: number
  monthlySales: number
  pendingConsultations: number
}

export interface Message {
  id: string
  patientId: string
  patientName: string
  channel: "whatsapp" | "email"
  content: string
  sentAt: string
  direction: "inbound" | "outbound"
}

export interface SalesReport {
  month: string
  revenue: number
  subscriptions: number
}

export interface HealthCategory {
  id: string
  name: string
  description: string
  icon: string
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
}

// ---- Helpers ----
function delay(ms: number = 800): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

// ---- Mock Data ----
const mockPlans: MembershipPlan[] = [
  {
    id: "individual",
    name: "Individual",
    price: 10,
    period: "month",
    features: [
      "Personal health dashboard",
      "Medical intake form",
      "1 consultation per month",
      "Basic health reports",
      "Email support",
    ],
  },
  {
    id: "family",
    name: "Family Kit",
    price: 30,
    period: "month",
    recommended: true,
    features: [
      "Up to 5 family members",
      "Shared health dashboard",
      "Unlimited consultations",
      "Comprehensive health reports",
      "Priority WhatsApp & email support",
      "Medical records storage",
    ],
  },
]

const mockPatients: PatientRecord[] = [
  {
    id: "rec-001",
    patientId: "patient-001",
    patientName: "John Doe",
    email: "john@example.com",
    gender: "Male",
    age: 34,
    membershipPlan: "Individual",
    membershipStatus: "active",
    submittedAt: "2025-12-01",
    consultationStatus: "in-progress",
    medicalHistory: "Mild asthma diagnosed in 2021. Regular medication.",
    chronicCondition: true,
    causeOfInfection: "N/A",
    currentCondition: "Stable, managed with inhalers",
    otherTreatments: "None",
    ailments: ["Respiratory / pulmonary issues", "Headache"],
  },
  {
    id: "rec-002",
    patientId: "patient-002",
    patientName: "Jane Smith",
    email: "jane@example.com",
    gender: "Female",
    age: 28,
    membershipPlan: "Family Kit",
    membershipStatus: "active",
    submittedAt: "2025-11-15",
    consultationStatus: "completed",
    medicalHistory: "Seasonal allergies. Minor surgery in 2022.",
    chronicCondition: false,
    causeOfInfection: "Pollen exposure",
    currentCondition: "Good, managed seasonally",
    otherTreatments: "Antihistamines",
    ailments: ["Skin disorders, eczema, ulcers", "Flu, COVID-19"],
  },
  {
    id: "rec-003",
    patientId: "patient-003",
    patientName: "Michael Johnson",
    email: "michael@example.com",
    gender: "Male",
    age: 52,
    membershipPlan: "Individual",
    membershipStatus: "active",
    submittedAt: "2025-10-20",
    consultationStatus: "pending",
    medicalHistory: "Type 2 Diabetes since 2019. Hypertension.",
    chronicCondition: true,
    causeOfInfection: "N/A",
    currentCondition: "Managed with medication and diet",
    otherTreatments: "Metformin, Lisinopril",
    ailments: ["Diabetes", "Hypertension"],
  },
  {
    id: "rec-004",
    patientId: "patient-004",
    patientName: "Sarah Williams",
    email: "sarah@example.com",
    gender: "Female",
    age: 41,
    membershipPlan: "Family Kit",
    membershipStatus: "inactive",
    submittedAt: "2025-09-05",
    consultationStatus: "completed",
    medicalHistory: "Post-natal complications in 2023.",
    chronicCondition: false,
    causeOfInfection: "N/A",
    currentCondition: "Recovered",
    otherTreatments: "Physical therapy",
    ailments: ["Post-natal care", "Back ache"],
  },
  {
    id: "rec-005",
    patientId: "patient-005",
    patientName: "David Brown",
    email: "david@example.com",
    gender: "Male",
    age: 67,
    membershipPlan: "Individual",
    membershipStatus: "active",
    submittedAt: "2025-08-12",
    consultationStatus: "in-progress",
    medicalHistory: "Prostate issues since 2020. Kidney concerns.",
    chronicCondition: true,
    causeOfInfection: "N/A",
    currentCondition: "Under monitoring",
    otherTreatments: "Tamsulosin",
    ailments: ["Kidney / renal problems", "Prostate cancer"],
  },
]

const mockMessages: Message[] = [
  { id: "msg-001", patientId: "patient-001", patientName: "John Doe", channel: "email", content: "Your lab results are ready. Please check your dashboard.", sentAt: "2025-12-10T10:30:00", direction: "outbound" },
  { id: "msg-002", patientId: "patient-001", patientName: "John Doe", channel: "whatsapp", content: "Thank you doctor, I will review them.", sentAt: "2025-12-10T11:15:00", direction: "inbound" },
  { id: "msg-003", patientId: "patient-002", patientName: "Jane Smith", channel: "email", content: "Your next appointment is scheduled for Jan 5th.", sentAt: "2025-12-08T09:00:00", direction: "outbound" },
  { id: "msg-004", patientId: "patient-003", patientName: "Michael Johnson", channel: "whatsapp", content: "Please remember to take your medication.", sentAt: "2025-12-05T14:20:00", direction: "outbound" },
]

const mockSalesReports: SalesReport[] = [
  { month: "Jul 2025", revenue: 2400, subscriptions: 34 },
  { month: "Aug 2025", revenue: 3100, subscriptions: 41 },
  { month: "Sep 2025", revenue: 2800, subscriptions: 38 },
  { month: "Oct 2025", revenue: 3500, subscriptions: 46 },
  { month: "Nov 2025", revenue: 4200, subscriptions: 55 },
  { month: "Dec 2025", revenue: 4800, subscriptions: 62 },
]

const mockCategories: HealthCategory[] = [
  { id: "1", name: "General Consultation", description: "Primary care and general health assessments for all ages.", icon: "stethoscope" },
  { id: "2", name: "Chronic Disease Management", description: "Ongoing care for diabetes, hypertension, and other chronic conditions.", icon: "heart-pulse" },
  { id: "3", name: "Respiratory Care", description: "Treatment for asthma, COPD, COVID-19, and other pulmonary issues.", icon: "wind" },
  { id: "4", name: "Dermatology", description: "Skin conditions, eczema, ulcers, and wound care.", icon: "shield" },
  { id: "5", name: "Pain Management", description: "Back pain, migraines, muscle pain, and chronic pain solutions.", icon: "zap" },
  { id: "6", name: "Reproductive Health", description: "Reproductive disorders, post-natal care, and family planning.", icon: "baby" },
  { id: "7", name: "Oncology Support", description: "Support for renal, prostate, throat cancers, and brain tumors.", icon: "activity" },
  { id: "8", name: "Emergency & Bites", description: "Snake bites, dog bites, burns, stings, and emergency response.", icon: "alert-triangle" },
]

const mockTestimonials: Testimonial[] = [
  { id: "1", name: "Mary K.", text: "Global Healer Online has completely changed how I manage my diabetes. The consultations are thorough and the doctors genuinely care.", rating: 5 },
  { id: "2", name: "Peter O.", text: "Quick, professional, and affordable. I got the care I needed from the comfort of my home.", rating: 5 },
  { id: "3", name: "Grace N.", text: "The family plan is incredible value. All five of us are covered and the support is amazing.", rating: 4 },
]

// ---- API Functions ----

// Auth
export async function apiLogin(email: string, password: string, role: UserRole) {
  await delay(1000)
  if (!email || !password) throw new Error("Email and password required")
  return { success: true, role }
}

export async function apiRegister(name: string, email: string, password: string) {
  await delay(1200)
  if (!name || !email || !password) throw new Error("All fields required")
  return { success: true }
}

// Membership
export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  await delay(600)
  return mockPlans
}

export async function processPayment(cardNumber: string, expiry: string, cvv: string, plan: string): Promise<{ success: boolean; transactionId: string }> {
  await delay(2000)
  if (cardNumber.replace(/\s/g, "").length !== 16) throw new Error("Invalid card number")
  if (!expiry || !cvv) throw new Error("All payment fields required")
  const shouldFail = Math.random() < 0.1 // 10% chance of failure for realism
  if (shouldFail) throw new Error("Payment declined. Please try again.")
  return { success: true, transactionId: `TXN-${Date.now()}` }
}

// Patient Dashboard
export async function getPatientOverview(patientId: string) {
  await delay(700)
  const patient = mockPatients.find((p) => p.patientId === patientId) || mockPatients[0]
  return {
    subscriptionStatus: patient.membershipStatus,
    plan: patient.membershipPlan,
    consultationStatus: patient.consultationStatus,
    submittedRecords: 1,
    nextAppointment: "2026-02-15",
  }
}

export async function submitMedicalIntake(data: Record<string, unknown>): Promise<{ success: boolean; recordId: string }> {
  await delay(1500)
  console.log("Medical intake submitted:", data)
  return { success: true, recordId: `rec-${Date.now()}` }
}

export async function getPatientRecords(patientId: string): Promise<PatientRecord[]> {
  await delay(700)
  return mockPatients.filter((p) => p.patientId === patientId)
}

// Admin Dashboard
export async function getAdminStats(): Promise<AdminStats> {
  await delay(800)
  return {
    totalPatients: mockPatients.length,
    activeSubscriptions: mockPatients.filter((p) => p.membershipStatus === "active").length,
    monthlySales: 4800,
    pendingConsultations: mockPatients.filter((p) => p.consultationStatus === "pending").length,
  }
}

export async function getAllPatients(): Promise<PatientRecord[]> {
  await delay(700)
  return mockPatients
}

export async function getPatientById(id: string): Promise<PatientRecord | undefined> {
  await delay(500)
  return mockPatients.find((p) => p.id === id || p.patientId === id)
}

export async function getSalesReports(): Promise<SalesReport[]> {
  await delay(600)
  return mockSalesReports
}

// Messages
export async function getMessages(patientId?: string): Promise<Message[]> {
  await delay(600)
  if (patientId) return mockMessages.filter((m) => m.patientId === patientId)
  return mockMessages
}

export async function sendMessage(patientId: string, channel: "whatsapp" | "email", content: string): Promise<{ success: boolean }> {
  await delay(1000)
  if (!content.trim()) throw new Error("Message cannot be empty")
  return { success: true }
}

// Health Categories
export async function getHealthCategories(): Promise<HealthCategory[]> {
  await delay(500)
  return mockCategories
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  await delay(400)
  return mockTestimonials
}

// Contact
export async function submitContactForm(data: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean }> {
  await delay(1000)
  if (!data.name || !data.email || !data.message) throw new Error("All fields required")
  return { success: true }
}

// Ailments list for the intake form
export function getAilmentsList(): string[] {
  return [
    "Headache (with Migraine)",
    "Stomach ache",
    "Tooth ache",
    "Back ache",
    "Muscle pain",
    "Pain all over the body",
    "Respiratory / pulmonary issues",
    "Kidney / renal problems",
    "Hypertension",
    "Diabetes",
    "Skin disorders, eczema, ulcers",
    "Chronic diabetes wounds",
    "STIs, HIV-related complications & AIDS",
    "Flu, COVID-19 (all variants), Monkeypox, Smallpox",
    "Snake bite, dog bite, mosquito bite, bee sting, scorpion sting",
    "Burns (steam burns, fire burns)",
    "Renal cancer, prostate cancer, throat cancer",
    "Brain tumors, Parkinson's disease",
    "Reproductive disorders",
    "Post-natal care",
    "Weight loss",
    "Weight gain",
    "Infant problems (stunted growth, pellagra)",
    "Rare diseases",
  ]
}
