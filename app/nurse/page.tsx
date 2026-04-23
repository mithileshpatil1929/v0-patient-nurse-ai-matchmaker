"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Heart, User, Bell, Settings, LogOut, Briefcase, 
  MapPin, Clock, Calendar, Star, Video, FileText,
  CheckCircle, AlertCircle, ChevronRight
} from "lucide-react"

interface JobRequest {
  id: string
  patientName: string
  age: number
  symptoms: string[]
  duration: string
  location: string
  priority: "high" | "medium" | "low"
  status: "new" | "pending" | "accepted"
  matchScore: number
}

export default function NurseDashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  
  const nurseProfile = {
    name: "Priya Sharma",
    specialization: "General Care & Elderly Care",
    experience: "5+ years",
    rating: 4.8,
    completedJobs: 156,
    verified: true
  }

  const jobRequests: JobRequest[] = [
    {
      id: "1",
      patientName: "Ramesh Kumar",
      age: 65,
      symptoms: ["Fever", "Headache", "Body Pain"],
      duration: "5 days",
      location: "Andheri West, Mumbai",
      priority: "medium",
      status: "new",
      matchScore: 95
    },
    {
      id: "2",
      patientName: "Sunita Devi",
      age: 72,
      symptoms: ["Post-surgery care", "Wound dressing"],
      duration: "14 days",
      location: "Bandra, Mumbai",
      priority: "high",
      status: "new",
      matchScore: 88
    },
    {
      id: "3",
      patientName: "Mohan Patel",
      age: 58,
      symptoms: ["Diabetes monitoring", "Insulin administration"],
      duration: "30 days",
      location: "Juhu, Mumbai",
      priority: "low",
      status: "pending",
      matchScore: 92
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "bg-red-500 text-white"
      case "medium": return "bg-yellow-500 text-black"
      case "low": return "bg-primary text-primary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "new": return "bg-blue-500 text-white"
      case "pending": return "bg-yellow-500 text-black"
      case "accepted": return "bg-primary text-primary-foreground"
      default: return "bg-muted text-muted-foreground"
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
            <Badge variant="outline" className="ml-2">Nurse Portal</Badge>
          </Link>
          <div className="flex items-center gap-4">
            {/* Online/Offline Toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isOnline ? "text-primary" : "text-muted-foreground"}`}>
                {isOnline ? "Online" : "Offline"}
              </span>
              <Switch 
                checked={isOnline} 
                onCheckedChange={setIsOnline}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="mt-4">{nurseProfile.name}</CardTitle>
                <CardDescription>{nurseProfile.specialization}</CardDescription>
                {nurseProfile.verified && (
                  <Badge className="mx-auto mt-2 bg-primary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    AI Verified
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Experience</span>
                    <span className="text-sm font-medium">{nurseProfile.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{nurseProfile.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed Jobs</span>
                    <span className="text-sm font-medium">{nurseProfile.completedJobs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={isOnline ? "default" : "secondary"}>
                      {isOnline ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Update Documents
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Video className="h-4 w-4" />
                  Video Interview History
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  My Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Briefcase className="h-4 w-4" />
                  Completed Jobs
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

          {/* Job Requests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Job Requests</h2>
              <Badge variant="outline" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {jobRequests.filter(j => j.status === "new").length} New
              </Badge>
            </div>

            <div className="space-y-4">
              {jobRequests.map((job) => (
                <Card 
                  key={job.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedJob === job.id ? "border-primary" : ""}`}
                  onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.patientName}</CardTitle>
                        <CardDescription>Age: {job.age} years</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Symptoms:</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {job.symptoms.map((symptom, i) => (
                            <Badge key={i} variant="outline">{symptom}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Duration: {job.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">AI Match Score:</span>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {job.matchScore}%
                          </Badge>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${selectedJob === job.id ? "rotate-90" : ""}`} />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedJob === job.id && (
                      <div className="mt-4 pt-4 border-t border-border space-y-4">
                        <div className="rounded-lg bg-muted/50 p-4">
                          <h4 className="font-medium text-foreground mb-2">Case Summary</h4>
                          <p className="text-sm text-muted-foreground">
                            Patient requires {job.duration} of care for {job.symptoms.join(", ").toLowerCase()}. 
                            Located in {job.location}. {job.priority === "high" ? "Immediate attention required." : "Standard care protocol applicable."}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button className="flex-1 gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Accept Job
                          </Button>
                          <Button variant="outline" className="flex-1 gap-2">
                            <Video className="h-4 w-4" />
                            Schedule Interview
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
