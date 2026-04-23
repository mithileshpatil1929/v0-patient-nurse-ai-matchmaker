"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Types
export interface Patient {
  id: string
  name: string
  age: number
  phone: string
  address: string
  location: string
}

export interface Nurse {
  id: string
  name: string
  specialization: string
  experience: string
  rating: number
  completedJobs: number
  verified: boolean
  isOnline: boolean
  skills: string[]
  location: string
}

export interface CareRequest {
  id: string
  patientId: string
  patient: Patient
  symptoms: string[]
  description: string
  priority: "high" | "medium" | "low"
  serviceType: "immediate" | "longterm"
  duration: string
  status: "pending" | "shortlisting" | "interview" | "matched" | "completed" | "cancelled"
  createdAt: Date
  matchedNurses: NurseMatch[]
  assignedNurse: Nurse | null
  assignedAt: Date | null
}

export interface NurseMatch {
  nurse: Nurse
  matchScore: number
  interviewStatus: "pending" | "scheduled" | "completed" | "accepted" | "rejected"
  respondedAt: Date | null
}

export interface Notification {
  id: string
  type: "request" | "match" | "assignment" | "sos" | "info"
  title: string
  message: string
  forRole: "patient" | "nurse" | "admin"
  forUserId: string
  read: boolean
  createdAt: Date
}

// Mock data
const mockNurses: Nurse[] = [
  {
    id: "nurse-1",
    name: "Priya Sharma",
    specialization: "General Care & Elderly Care",
    experience: "5 years",
    rating: 4.8,
    completedJobs: 156,
    verified: true,
    isOnline: true,
    skills: ["General Care", "Elderly Care", "First Aid", "Medication Management"],
    location: "Andheri, Mumbai"
  },
  {
    id: "nurse-2",
    name: "Anjali Verma",
    specialization: "Post-Surgical Care",
    experience: "7 years",
    rating: 4.9,
    completedJobs: 203,
    verified: true,
    isOnline: true,
    skills: ["Surgical Care", "Wound Dressing", "ICU Care", "Pain Management"],
    location: "Bandra, Mumbai"
  },
  {
    id: "nurse-3",
    name: "Sunita Roy",
    specialization: "Diabetes & Chronic Care",
    experience: "4 years",
    rating: 4.7,
    completedJobs: 98,
    verified: true,
    isOnline: false,
    skills: ["Diabetes Care", "Insulin Administration", "Chronic Care", "Diet Planning"],
    location: "Juhu, Mumbai"
  },
  {
    id: "nurse-4",
    name: "Meera Patel",
    specialization: "Pediatric & Newborn Care",
    experience: "6 years",
    rating: 4.9,
    completedJobs: 178,
    verified: true,
    isOnline: true,
    skills: ["Pediatric Care", "Newborn Care", "Vaccination", "Child Development"],
    location: "Powai, Mumbai"
  },
  {
    id: "nurse-5",
    name: "Kavita Singh",
    specialization: "Home ICU Setup",
    experience: "8 years",
    rating: 4.8,
    completedJobs: 245,
    verified: true,
    isOnline: true,
    skills: ["ICU Care", "Ventilator Care", "Critical Care", "Emergency Response"],
    location: "Worli, Mumbai"
  }
]

const mockPatient: Patient = {
  id: "patient-1",
  name: "Ramesh Kumar",
  age: 65,
  phone: "+91 98765 43210",
  address: "123, Shanti Nagar, Andheri West",
  location: "Andheri West, Mumbai"
}

// Context
interface StoreContextType {
  // Current user
  currentPatient: Patient
  currentNurse: Nurse | null
  setCurrentNurse: (nurse: Nurse | null) => void
  
  // Nurses
  nurses: Nurse[]
  updateNurseOnlineStatus: (nurseId: string, isOnline: boolean) => void
  
  // Care Requests
  careRequests: CareRequest[]
  createCareRequest: (request: Omit<CareRequest, "id" | "createdAt" | "matchedNurses" | "assignedNurse" | "assignedAt">) => CareRequest
  updateCareRequestStatus: (requestId: string, status: CareRequest["status"]) => void
  
  // Nurse Actions
  acceptRequest: (requestId: string, nurseId: string) => void
  rejectRequest: (requestId: string, nurseId: string) => void
  
  // Admin Actions
  assignNurseToRequest: (requestId: string, nurseId: string) => void
  
  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void
  markNotificationRead: (notificationId: string) => void
  getUnreadCount: (role: "patient" | "nurse" | "admin", userId: string) => number
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [nurses, setNurses] = useState<Nurse[]>(mockNurses)
  const [currentNurse, setCurrentNurse] = useState<Nurse | null>(mockNurses[0])
  const [careRequests, setCareRequests] = useState<CareRequest[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Calculate match score based on symptoms and nurse skills
  const calculateMatchScore = useCallback((symptoms: string[], nurse: Nurse): number => {
    const symptomKeywords: Record<string, string[]> = {
      "fever": ["General Care", "First Aid"],
      "headache": ["General Care", "Pain Management"],
      "diabetes": ["Diabetes Care", "Chronic Care", "Insulin Administration"],
      "surgery": ["Surgical Care", "Wound Dressing", "ICU Care"],
      "elderly": ["Elderly Care", "General Care"],
      "child": ["Pediatric Care", "Newborn Care"],
      "wound": ["Wound Dressing", "Surgical Care"],
      "critical": ["ICU Care", "Critical Care", "Emergency Response"]
    }
    
    let matchPoints = 50 // Base score
    
    symptoms.forEach(symptom => {
      const lowerSymptom = symptom.toLowerCase()
      Object.entries(symptomKeywords).forEach(([keyword, skills]) => {
        if (lowerSymptom.includes(keyword)) {
          skills.forEach(skill => {
            if (nurse.skills.includes(skill)) {
              matchPoints += 10
            }
          })
        }
      })
    })
    
    // Add rating bonus
    matchPoints += nurse.rating * 2
    
    // Add experience bonus
    matchPoints += parseInt(nurse.experience) || 0
    
    return Math.min(99, Math.max(60, matchPoints))
  }, [])

  const createCareRequest = useCallback((
    request: Omit<CareRequest, "id" | "createdAt" | "matchedNurses" | "assignedNurse" | "assignedAt">
  ): CareRequest => {
    const id = `req-${Date.now()}`
    
    // Find matching nurses (online and verified)
    const availableNurses = nurses.filter(n => n.isOnline && n.verified)
    const matchedNurses: NurseMatch[] = availableNurses
      .map(nurse => ({
        nurse,
        matchScore: calculateMatchScore(request.symptoms, nurse),
        interviewStatus: "pending" as const,
        respondedAt: null
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5) // Top 5 matches
    
    const newRequest: CareRequest = {
      ...request,
      id,
      createdAt: new Date(),
      matchedNurses,
      status: "shortlisting",
      assignedNurse: null,
      assignedAt: null
    }
    
    setCareRequests(prev => [newRequest, ...prev])
    
    // Notify matched nurses
    matchedNurses.forEach(match => {
      addNotification({
        type: "request",
        title: "New Care Request",
        message: `New ${request.priority} priority request from ${request.patient.name}. Match score: ${match.matchScore}%`,
        forRole: "nurse",
        forUserId: match.nurse.id
      })
    })
    
    // Notify admin
    addNotification({
      type: "request",
      title: "New Care Request Created",
      message: `${request.patient.name} has submitted a ${request.priority} priority care request`,
      forRole: "admin",
      forUserId: "admin"
    })
    
    return newRequest
  }, [nurses, calculateMatchScore])

  const updateCareRequestStatus = useCallback((requestId: string, status: CareRequest["status"]) => {
    setCareRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status } : req
    ))
  }, [])

  const acceptRequest = useCallback((requestId: string, nurseId: string) => {
    setCareRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedMatches = req.matchedNurses.map(match => 
          match.nurse.id === nurseId 
            ? { ...match, interviewStatus: "accepted" as const, respondedAt: new Date() }
            : match
        )
        
        // Find the nurse who accepted
        const acceptedNurse = nurses.find(n => n.id === nurseId)
        
        return {
          ...req,
          matchedNurses: updatedMatches,
          status: "matched" as const,
          assignedNurse: acceptedNurse || null,
          assignedAt: new Date()
        }
      }
      return req
    }))
    
    // Notify patient
    const request = careRequests.find(r => r.id === requestId)
    const nurse = nurses.find(n => n.id === nurseId)
    if (request && nurse) {
      addNotification({
        type: "assignment",
        title: "Nurse Assigned",
        message: `${nurse.name} has accepted your care request and will be assigned to you.`,
        forRole: "patient",
        forUserId: request.patientId
      })
      
      addNotification({
        type: "match",
        title: "Request Matched",
        message: `${nurse.name} has accepted the request from ${request.patient.name}`,
        forRole: "admin",
        forUserId: "admin"
      })
    }
  }, [careRequests, nurses])

  const rejectRequest = useCallback((requestId: string, nurseId: string) => {
    setCareRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedMatches = req.matchedNurses.map(match => 
          match.nurse.id === nurseId 
            ? { ...match, interviewStatus: "rejected" as const, respondedAt: new Date() }
            : match
        )
        return { ...req, matchedNurses: updatedMatches }
      }
      return req
    }))
  }, [])

  const assignNurseToRequest = useCallback((requestId: string, nurseId: string) => {
    setCareRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const assignedNurse = nurses.find(n => n.id === nurseId) || null
        const updatedMatches = req.matchedNurses.map(match => 
          match.nurse.id === nurseId 
            ? { ...match, interviewStatus: "accepted" as const, respondedAt: new Date() }
            : match
        )
        return {
          ...req,
          matchedNurses: updatedMatches,
          assignedNurse,
          assignedAt: new Date(),
          status: "matched" as const
        }
      }
      return req
    }))
    
    // Notify both parties
    const request = careRequests.find(r => r.id === requestId)
    const nurse = nurses.find(n => n.id === nurseId)
    if (request && nurse) {
      addNotification({
        type: "assignment",
        title: "Nurse Assigned",
        message: `${nurse.name} has been assigned to your care request by admin.`,
        forRole: "patient",
        forUserId: request.patientId
      })
      
      addNotification({
        type: "assignment",
        title: "New Assignment",
        message: `You have been assigned to care for ${request.patient.name}`,
        forRole: "nurse",
        forUserId: nurseId
      })
    }
  }, [careRequests, nurses])

  const updateNurseOnlineStatus = useCallback((nurseId: string, isOnline: boolean) => {
    setNurses(prev => prev.map(nurse => 
      nurse.id === nurseId ? { ...nurse, isOnline } : nurse
    ))
    if (currentNurse?.id === nurseId) {
      setCurrentNurse(prev => prev ? { ...prev, isOnline } : null)
    }
  }, [currentNurse])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ))
  }, [])

  const getUnreadCount = useCallback((role: "patient" | "nurse" | "admin", userId: string): number => {
    return notifications.filter(n => 
      n.forRole === role && n.forUserId === userId && !n.read
    ).length
  }, [notifications])

  return (
    <StoreContext.Provider value={{
      currentPatient: mockPatient,
      currentNurse,
      setCurrentNurse,
      nurses,
      updateNurseOnlineStatus,
      careRequests,
      createCareRequest,
      updateCareRequestStatus,
      acceptRequest,
      rejectRequest,
      assignNurseToRequest,
      notifications,
      addNotification,
      markNotificationRead,
      getUnreadCount
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
