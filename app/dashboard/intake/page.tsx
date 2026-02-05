"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { submitMedicalIntake, getAilmentsList } from "@/lib/api"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Search,
  X,
  User,
  FileText,
  Stethoscope,
  ClipboardCheck,
} from "lucide-react"

const stepIcons = [User, FileText, Stethoscope, ClipboardCheck]
const stepLabels = ["Personal Info", "Medical History", "Ailments", "Review"]

interface FormData {
  gender: string
  ageConfirm: boolean
  age: string
  medicalHistory: string
  chronicCondition: string
  causeOfInfection: string
  currentCondition: string
  otherTreatments: string
  ailments: string[]
}

export default function IntakePage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [ailmentSearch, setAilmentSearch] = useState("")
  const allAilments = getAilmentsList()

  const [form, setForm] = useState<FormData>({
    gender: "",
    ageConfirm: false,
    age: "",
    medicalHistory: "",
    chronicCondition: "",
    causeOfInfection: "",
    currentCondition: "",
    otherTreatments: "",
    ailments: [],
  })

  function updateForm(key: keyof FormData, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function toggleAilment(ailment: string) {
    setForm((prev) => ({
      ...prev,
      ailments: prev.ailments.includes(ailment)
        ? prev.ailments.filter((a) => a !== ailment)
        : [...prev.ailments, ailment],
    }))
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {}
    if (step === 0) {
      if (!form.gender) newErrors.gender = "Please select your gender"
      if (!form.ageConfirm) newErrors.ageConfirm = "You must confirm you are 18 or older"
      if (!form.age) newErrors.age = "Please enter your age"
      else if (Number(form.age) < 18 || Number(form.age) > 80) newErrors.age = "Age must be between 18 and 80"
    }
    if (step === 1) {
      if (!form.medicalHistory.trim()) newErrors.medicalHistory = "Please describe your medical history"
      if (!form.chronicCondition) newErrors.chronicCondition = "Please select yes or no"
      if (!form.currentCondition.trim()) newErrors.currentCondition = "Please describe your current condition"
    }
    if (step === 2) {
      if (form.ailments.length === 0) newErrors.ailments = "Please select at least one ailment"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3))
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      await submitMedicalIntake(form as unknown as Record<string, unknown>)
      setSubmitted(true)
    } catch {
      // error handling
    } finally {
      setLoading(false)
    }
  }

  const filteredAilments = allAilments.filter((a) =>
    a.toLowerCase().includes(ailmentSearch.toLowerCase())
  )

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border border-border bg-background">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Form Submitted Successfully!</h2>
            <p className="mt-2 text-muted-foreground">
              Your medical intake form has been submitted. Our team will review your information and reach out to schedule your consultation.
            </p>
            <Button className="mt-6" onClick={() => { setSubmitted(false); setStep(0); setForm({ gender: "", ageConfirm: false, age: "", medicalHistory: "", chronicCondition: "", causeOfInfection: "", currentCondition: "", otherTreatments: "", ailments: [] }) }}>
              Submit Another Form
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Medical Intake Form</h1>
        <p className="mt-1 text-muted-foreground">
          Complete all steps to submit your medical information
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-between">
        {stepLabels.map((label, i) => {
          const Icon = stepIcons[i]
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    step === i
                      ? "bg-primary text-primary-foreground"
                      : step > i
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > i ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="hidden text-xs text-muted-foreground sm:block">{label}</span>
              </div>
              {i < 3 && (
                <div className={`mx-2 h-px flex-1 ${step > i ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          )
        })}
      </div>

      <Card className="border border-border bg-background">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            {step === 0 && "Step 1 - Personal Information"}
            {step === 1 && "Step 2 - Medical History"}
            {step === 2 && "Step 3 - Ailments & Complaints"}
            {step === 3 && "Step 4 - Review & Submit"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step 1: Personal Info */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <Label className="text-sm font-medium">Gender</Label>
                <RadioGroup value={form.gender} onValueChange={(v) => updateForm("gender", v)} className="mt-2 flex flex-col gap-2">
                  {["Male", "Female", "Would rather not say"].map((opt) => (
                    <label key={opt} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${form.gender === opt ? "border-primary bg-secondary" : "border-border"}`}>
                      <RadioGroupItem value={opt} />
                      <span className="text-sm text-foreground">{opt}</span>
                    </label>
                  ))}
                </RadioGroup>
                {errors.gender && <p className="mt-1 text-sm text-destructive">{errors.gender}</p>}
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="age-confirm"
                  checked={form.ageConfirm}
                  onCheckedChange={(v) => updateForm("ageConfirm", v)}
                />
                <div>
                  <Label htmlFor="age-confirm" className="text-sm">I confirm that I am 18 years of age or older</Label>
                  {errors.ageConfirm && <p className="text-sm text-destructive">{errors.ageConfirm}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="age">Age (18-80)</Label>
                <Input
                  id="age"
                  type="number"
                  min={18}
                  max={80}
                  value={form.age}
                  onChange={(e) => updateForm("age", e.target.value)}
                  placeholder="Enter your age"
                  className="mt-1.5 max-w-[200px]"
                />
                {errors.age && <p className="mt-1 text-sm text-destructive">{errors.age}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Medical History */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <Label htmlFor="med-history">Medical history for the last 5 years</Label>
                <Textarea
                  id="med-history"
                  value={form.medicalHistory}
                  onChange={(e) => updateForm("medicalHistory", e.target.value)}
                  placeholder="Describe any medical conditions, surgeries, or treatments in the last 5 years..."
                  rows={4}
                  className="mt-1.5"
                />
                {errors.medicalHistory && <p className="mt-1 text-sm text-destructive">{errors.medicalHistory}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium">Was the condition chronic?</Label>
                <RadioGroup value={form.chronicCondition} onValueChange={(v) => updateForm("chronicCondition", v)} className="mt-2 flex gap-4">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 transition-colors ${form.chronicCondition === opt ? "border-primary bg-secondary" : "border-border"}`}>
                      <RadioGroupItem value={opt} />
                      <span className="text-sm text-foreground">{opt}</span>
                    </label>
                  ))}
                </RadioGroup>
                {errors.chronicCondition && <p className="mt-1 text-sm text-destructive">{errors.chronicCondition}</p>}
              </div>

              <div>
                <Label htmlFor="cause">Cause of infection (if applicable)</Label>
                <Input
                  id="cause"
                  value={form.causeOfInfection}
                  onChange={(e) => updateForm("causeOfInfection", e.target.value)}
                  placeholder="Describe cause of infection, or N/A"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="current">Current condition or stage</Label>
                <Textarea
                  id="current"
                  value={form.currentCondition}
                  onChange={(e) => updateForm("currentCondition", e.target.value)}
                  placeholder="Describe your current health condition..."
                  rows={3}
                  className="mt-1.5"
                />
                {errors.currentCondition && <p className="mt-1 text-sm text-destructive">{errors.currentCondition}</p>}
              </div>

              <div>
                <Label htmlFor="other-treatments">Disclosure of other treatments</Label>
                <Textarea
                  id="other-treatments"
                  value={form.otherTreatments}
                  onChange={(e) => updateForm("otherTreatments", e.target.value)}
                  placeholder="List any other treatments or medications you are currently using..."
                  rows={3}
                  className="mt-1.5"
                />
              </div>
            </div>
          )}

          {/* Step 3: Ailments */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={ailmentSearch}
                  onChange={(e) => setAilmentSearch(e.target.value)}
                  placeholder="Search ailments..."
                  className="pl-9"
                />
              </div>

              {form.ailments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.ailments.map((a) => (
                    <Badge key={a} variant="secondary" className="gap-1 py-1">
                      {a}
                      <button type="button" onClick={() => toggleAilment(a)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
                {filteredAilments.map((ailment) => (
                  <label
                    key={ailment}
                    className="flex cursor-pointer items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-accent/50"
                  >
                    <Checkbox
                      checked={form.ailments.includes(ailment)}
                      onCheckedChange={() => toggleAilment(ailment)}
                    />
                    <span className="text-sm text-foreground">{ailment}</span>
                  </label>
                ))}
                {filteredAilments.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">No ailments match your search</p>
                )}
              </div>
              {errors.ailments && <p className="text-sm text-destructive">{errors.ailments}</p>}
            </div>
          )}

          {/* Step 4: Review */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-3 font-semibold text-foreground">Personal Information</h3>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div><span className="text-muted-foreground">Gender:</span> <span className="ml-1 text-foreground">{form.gender}</span></div>
                  <div><span className="text-muted-foreground">Age:</span> <span className="ml-1 text-foreground">{form.age}</span></div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-3 font-semibold text-foreground">Medical History</h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div><span className="text-muted-foreground">History:</span> <span className="ml-1 text-foreground">{form.medicalHistory}</span></div>
                  <div><span className="text-muted-foreground">Chronic:</span> <span className="ml-1 text-foreground">{form.chronicCondition}</span></div>
                  <div><span className="text-muted-foreground">Cause:</span> <span className="ml-1 text-foreground">{form.causeOfInfection || "N/A"}</span></div>
                  <div><span className="text-muted-foreground">Current condition:</span> <span className="ml-1 text-foreground">{form.currentCondition}</span></div>
                  <div><span className="text-muted-foreground">Other treatments:</span> <span className="ml-1 text-foreground">{form.otherTreatments || "None"}</span></div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-3 font-semibold text-foreground">Ailments & Complaints</h3>
                <div className="flex flex-wrap gap-2">
                  {form.ailments.map((a) => (
                    <Badge key={a} variant="outline">{a}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" onClick={handleBack} disabled={step === 0} className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="gap-2">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <>Submit Form <Check className="h-4 w-4" /></>}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
