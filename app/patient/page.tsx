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
  Bell, Settings, LogOut, MessageCircle, Send
} from "lucide-react"
import { SOSEmergency } from "@/components/sos-emergency"

type TriageLevel = "high" | "medium" | "low" | null
type ServiceType = "immediate" | "longterm" | null
type BookingStatus = "shortlisting" | "interview" | "allotted" | null

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function PatientDashboard() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [triageLevel, setTriageLevel] = useState<TriageLevel>(null)
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(null)
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      // Simulate voice recognition result
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

  const processSymptoms = (text: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content: "Maine aapke symptoms analyze kar liye hain. Aapko bukhar aur sir dard hai - yeh Medium priority case hai. Kya aap immediate help chahte hain (1 visit) ya long-term care (multiple days)?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setTriageLevel("medium")
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
    const aiMessage: Message = {
      id: messages.length + 1,
      type: "ai",
      content: type === "immediate" 
        ? "Theek hai! Main aapke liye turant ek nurse dhundh raha hoon. 15-20 minute mein nurse aapke paas pahunch jayegi."
        : "Long-term care ke liye main best-matched nurses dhundh raha hoon. Interview process start ho gaya hai.",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiMessage])
    
    if (type === "longterm") {
      setBookingStatus("shortlisting")
      // Simulate booking progress
      setTimeout(() => setBookingStatus("interview"), 3000)
      setTimeout(() => setBookingStatus("allotted"), 6000)
    }
  }

  const getTriageColor = (level: TriageLevel) => {
    switch(level) {
      case "high": return "bg-red-500 text-white"
      case "medium": return "bg-yellow-500 text-black"
      case "low": return "bg-primary text-primary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getBookingProgress = () => {
    switch(bookingStatus) {
      case "shortlisting": return 33
      case "interview": return 66
      case "allotted": return 100
      default: return 0
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
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <span className="hidden text-sm font-medium md:block">Patient</span>
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
                  {triageLevel && (
                    <Badge className={getTriageColor(triageLevel)}>
                      {triageLevel.toUpperCase()} Priority
                    </Badge>
                  )}
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
                        <p className="text-sm">{message.content}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                      placeholder="Type your message here..."
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

            {/* Triage Report */}
            {triageLevel && (
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
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        Fever (Bukhar)
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        Headache (Sir Dard)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Recommendation:</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Rest, hydration, and monitoring. Consult nurse if symptoms persist beyond 48 hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Status */}
            {bookingStatus && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Nurse Booking Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={getBookingProgress()} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className={bookingStatus === "shortlisting" ? "text-primary font-medium" : "text-muted-foreground"}>
                      AI Shortlisting
                    </span>
                    <span className={bookingStatus === "interview" ? "text-primary font-medium" : "text-muted-foreground"}>
                      Interview
                    </span>
                    <span className={bookingStatus === "allotted" ? "text-primary font-medium" : "text-muted-foreground"}>
                      Allotted
                    </span>
                  </div>
                  {bookingStatus === "allotted" && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Nurse Priya Sharma</p>
                          <p className="text-xs text-muted-foreground">5+ years experience</p>
                          <Badge variant="outline" className="mt-1 text-xs">AI Verified</Badge>
                        </div>
                      </div>
                      <Button className="w-full mt-3" size="sm">
                        View Profile & Confirm
                      </Button>
                    </div>
                  )}
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
                  View Appointments
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
