"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mic, MicOff, Heart, AlertTriangle, Clock, Phone, 
  User, Calendar, ChevronRight, Activity, Stethoscope,
  Bell, Settings, LogOut, MessageCircle, Send, CheckCircle,
  Star, MapPin
} from "lucide-react"
import { SOSEmergency } from "@/components/sos-emergency"
import { useStore, type CareRequest } from "@/lib/store"
import { formatTime } from "@/lib/format"

type TriageLevel = "high" | "medium" | "low" | null
type ServiceType = "immediate" | "longterm" | null

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function PatientDashboard() {
  const { currentPatient, careRequests, createCareRequest, notifications, getUnreadCount, markNotificationRead } = useStore()
  
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [triageLevel, setTriageLevel] = useState<TriageLevel>(null)
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: "Namaste! Main aapka Digital Savers AI assistant hoon. Bol kar ya likh kar apni pareshani batayein. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState("")
  const [showSOS, setShowSOS] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<CareRequest | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Get patient's care requests
  const patientRequests = careRequests.filter(r => r.patientId === currentPatient.id)
  const activeRequest = patientRequests.find(r => r.status !== "completed" && r.status !== "cancelled")
  const patientNotifications = notifications.filter(n => n.forRole === "patient" && n.forUserId === currentPatient.id)
  const unreadCount = getUnreadCount("patient", currentPatient.id)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update current request when careRequests changes
  useEffect(() => {
    if (currentRequest) {
      const updated = careRequests.find(r => r.id === currentRequest.id)
      if (updated) {
        setCurrentRequest(updated)
      }
    }
  }, [careRequests, currentRequest])

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      if (transcript) {
        processSymptoms(transcript)
      }
    } else {
      setIsListening(true)
      setTranscript("")
      // Simulate voice recognition
      setTimeout(() => {
        setTranscript("Mujhe do din se bukhar hai aur sir mein dard ho raha hai")
      }, 2000)
    }
  }

  const analyzeSymptoms = (text: string): { symptoms: string[], priority: TriageLevel } => {
    const symptomKeywords: Record<string, { display: string, severity: number }> = {
      "bukhar": { display: "Fever (Bukhar)", severity: 2 },
      "fever": { display: "Fever", severity: 2 },
      "sir": { display: "Headache (Sir Dard)", severity: 1 },
      "headache": { display: "Headache", severity: 1 },
      "dard": { display: "Body Pain", severity: 1 },
      "pain": { display: "Body Pain", severity: 1 },
      "cough": { display: "Cough", severity: 1 },
      "khansi": { display: "Cough (Khansi)", severity: 1 },
      "saans": { display: "Breathing Difficulty", severity: 3 },
      "breath": { display: "Breathing Difficulty", severity: 3 },
      "chest": { display: "Chest Pain", severity: 3 },
      "diabetes": { display: "Diabetes Care", severity: 2 },
      "sugar": { display: "Blood Sugar Issues", severity: 2 },
      "wound": { display: "Wound Care", severity: 2 },
      "ghav": { display: "Wound (Ghav)", severity: 2 },
      "surgery": { display: "Post-Surgery Care", severity: 2 },
      "operation": { display: "Post-Operation Care", severity: 2 }
    }
    
    const lowerText = text.toLowerCase()
    const foundSymptoms: string[] = []
    let maxSeverity = 1
    
    Object.entries(symptomKeywords).forEach(([keyword, data]) => {
      if (lowerText.includes(keyword) && !foundSymptoms.includes(data.display)) {
        foundSymptoms.push(data.display)
        maxSeverity = Math.max(maxSeverity, data.severity)
      }
    })
    
    const priority: TriageLevel = maxSeverity >= 3 ? "high" : maxSeverity >= 2 ? "medium" : "low"
    
    return { symptoms: foundSymptoms, priority }
  }

  const processSymptoms = (text: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Analyze symptoms
    const { symptoms, priority } = analyzeSymptoms(text)
    
    setTimeout(() => {
      if (symptoms.length > 0) {
        setDetectedSymptoms(symptoms)
        setTriageLevel(priority)
        
        const priorityText = priority === "high" ? "HIGH (Urgent)" : priority === "medium" ? "MEDIUM" : "LOW"
        const aiResponse: Message = {
          id: messages.length + 2,
          type: "ai",
          content: `Maine aapke symptoms analyze kar liye hain:\n\n${symptoms.map(s => `- ${s}`).join("\n")}\n\nYeh ${priorityText} priority case hai. Kya aap immediate help chahte hain (1 visit) ya long-term care (multiple days)?`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
      } else {
        const aiResponse: Message = {
          id: messages.length + 2,
          type: "ai",
          content: "Main samajh nahi paya. Kripya apne symptoms detail mein batayein - jaise bukhar, sir dard, khansi, ya koi aur takleef.",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
      }
    }, 1500)
  }

  const handleSendMessage = () => {
    if (inputText.trim()) {
      processSymptoms(inputText)
      setInputText("")
    }
  }

  const selectService = (type: ServiceType) => {
    setServiceType(type)
    
    // Create the care request
    const newRequest = createCareRequest({
      patientId: currentPatient.id,
      patient: currentPatient,
      symptoms: detectedSymptoms,
      description: messages.filter(m => m.type === "user").map(m => m.content).join(". "),
      priority: triageLevel || "medium",
      serviceType: type || "immediate",
      duration: type === "immediate" ? "1 visit" : "7 days",
      status: "pending"
    })
    
    setCurrentRequest(newRequest)
    
    const aiMessage: Message = {
      id: messages.length + 1,
      type: "ai",
      content: type === "immediate" 
        ? `Request bhej diya gaya hai! Main aapke liye turant best-matched nurses dhundh raha hoon.\n\nAapko ${newRequest.matchedNurses.length} nurses mile hain. Top match: ${newRequest.matchedNurses[0]?.nurse.name} (${newRequest.matchedNurses[0]?.matchScore}% match).\n\nNurse ke accept karte hi aapko notification milegi.`
        : `Long-term care request bhej diya gaya! ${newRequest.matchedNurses.length} nurses shortlist ho gaye hain.\n\nTop match: ${newRequest.matchedNurses[0]?.nurse.name} with ${newRequest.matchedNurses[0]?.matchScore}% compatibility.\n\nJab koi nurse accept karega, aapko turant notification milegi.`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiMessage])
  }

  const resetConversation = () => {
    setTriageLevel(null)
    setServiceType(null)
    setDetectedSymptoms([])
    setCurrentRequest(null)
    setMessages([{
      id: 1,
      type: "ai",
      content: "Namaste! Main aapka Digital Savers AI assistant hoon. Bol kar ya likh kar apni pareshani batayein. How can I help you today?",
      timestamp: new Date()
    }])
  }

  const getTriageColor = (level: TriageLevel) => {
    switch(level) {
      case "high": return "bg-red-500 text-white"
      case "medium": return "bg-yellow-500 text-black"
      case "low": return "bg-primary text-primary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusProgress = (status: CareRequest["status"]) => {
    switch(status) {
      case "pending": return 10
      case "shortlisting": return 33
      case "interview": return 66
      case "matched": return 100
      case "completed": return 100
      default: return 0
    }
  }

  const getStatusLabel = (status: CareRequest["status"]) => {
    switch(status) {
      case "pending": return "Request Sent"
      case "shortlisting": return "AI Shortlisting"
      case "interview": return "Nurse Review"
      case "matched": return "Nurse Assigned"
      case "completed": return "Completed"
      case "cancelled": return "Cancelled"
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Digital Savers</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 rounded-lg border border-border bg-card shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {patientNotifications.length === 0 ? (
                      <p className="p-4 text-center text-sm text-muted-foreground">No notifications</p>
                    ) : (
                      patientNotifications.slice(0, 10).map(notif => (
                        <div 
                          key={notif.id}
                          className={`p-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 ${!notif.read ? "bg-primary/5" : ""}`}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
<p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
                                            {formatTime(notif.createdAt)}
                                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <span className="hidden text-sm font-medium md:block">{currentPatient.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      AI Health Assistant
                    </CardTitle>
                    <CardDescription>Bol kar ya likh kar apni pareshani batayein</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {triageLevel && (
                      <Badge className={getTriageColor(triageLevel)}>
                        {triageLevel.toUpperCase()} Priority
                      </Badge>
                    )}
                    {serviceType && (
                      <Button variant="outline" size="sm" onClick={resetConversation}>
                        New Request
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className="mt-1 text-xs opacity-70" suppressHydrationWarning>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Service Selection */}
              {triageLevel && !serviceType && (
                <div className="border-t border-border p-4">
                  <p className="mb-3 text-sm font-medium text-foreground">Select Service Type:</p>
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 gap-2" 
                      onClick={() => selectService("immediate")}
                    >
                      <Clock className="h-4 w-4" />
                      Immediate Help (1 Visit)
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={() => selectService("longterm")}
                    >
                      <Calendar className="h-4 w-4" />
                      Long-term Care
                    </Button>
                  </div>
                </div>
              )}

              {/* Input Area */}
              {!serviceType && (
                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-3">
                    <Button
                      size="lg"
                      variant={isListening ? "destructive" : "default"}
                      className={`h-14 w-14 rounded-full ${isListening ? "animate-pulse" : ""}`}
                      onClick={toggleListening}
                    >
                      {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </Button>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Type your symptoms here... (e.g., bukhar, sir dard, khansi)"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[50px] max-h-[100px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button size="icon" className="h-[50px] w-[50px]" onClick={handleSendMessage}>
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  {isListening && (
                    <p className="mt-2 text-center text-sm text-primary animate-pulse">
                      Listening... {transcript && `"${transcript}"`}
                    </p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* SOS Button */}
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="p-4">
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="w-full h-16 text-lg font-bold gap-2"
                  onClick={() => setShowSOS(true)}
                >
                  <Phone className="h-6 w-6" />
                  SOS EMERGENCY
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Instant ambulance & family alerts
                </p>
              </CardContent>
            </Card>
            
            {/* SOS Modal */}
            <SOSEmergency isOpen={showSOS} onClose={() => setShowSOS(false)} />

            {/* Active Request Status */}
            {(currentRequest || activeRequest) && (
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Care Request Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={getStatusProgress((currentRequest || activeRequest)!.status)} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className={`${(currentRequest || activeRequest)!.status === "shortlisting" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      AI Matching
                    </span>
                    <span className={`${(currentRequest || activeRequest)!.status === "interview" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      Nurse Review
                    </span>
                    <span className={`${(currentRequest || activeRequest)!.status === "matched" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      Assigned
                    </span>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline">{getStatusLabel((currentRequest || activeRequest)!.status)}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Matched Nurses</span>
                      <span className="font-medium">{(currentRequest || activeRequest)!.matchedNurses.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Priority</span>
                      <Badge className={getTriageColor((currentRequest || activeRequest)!.priority)}>
                        {(currentRequest || activeRequest)!.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Assigned Nurse Info */}
                  {(currentRequest || activeRequest)!.assignedNurse && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{(currentRequest || activeRequest)!.assignedNurse!.name}</p>
                          <p className="text-xs text-muted-foreground">{(currentRequest || activeRequest)!.assignedNurse!.specialization}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              AI Verified
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              {(currentRequest || activeRequest)!.assignedNurse!.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full mt-3" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Nurse
                      </Button>
                    </div>
                  )}

                  {/* Show matched nurses if not assigned yet */}
                  {!(currentRequest || activeRequest)!.assignedNurse && (currentRequest || activeRequest)!.matchedNurses.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <p className="text-sm font-medium">Top Matched Nurses:</p>
                      {(currentRequest || activeRequest)!.matchedNurses.slice(0, 3).map((match, i) => (
                        <div key={match.nurse.id} className="flex items-center justify-between rounded-lg border border-border p-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {i + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{match.nurse.name}</p>
                              <p className="text-xs text-muted-foreground">{match.nurse.experience}</p>
                            </div>
                          </div>
                          <Badge className="bg-primary/10 text-primary text-xs">
                            {match.matchScore}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Triage Report */}
            {triageLevel && !currentRequest && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-primary" />
                    Smart Triage Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <Badge className={getTriageColor(triageLevel)}>
                      {triageLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Detected Symptoms:</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {detectedSymptoms.map((symptom, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  View Past Requests ({patientRequests.filter(r => r.status === "completed").length})
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Activity className="h-4 w-4" />
                  Medical History
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  My Profile
                </Button>
                <Link href="/">
                  <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
