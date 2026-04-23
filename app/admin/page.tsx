"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, Users, Activity, Brain, Search, Filter,
  CheckCircle, Clock, Video, FileText, AlertTriangle,
  TrendingUp, UserCheck, Stethoscope, Settings, Bell,
  ChevronRight, Eye, Play, User
} from "lucide-react"

interface MatchingProcess {
  id: string
  patientName: string
  symptoms: string[]
  status: "shortlisting" | "interviewing" | "matched" | "completed"
  matchedNurses: NurseMatch[]
  createdAt: string
}

interface NurseMatch {
  id: string
  name: string
  matchScore: number
  skills: string[]
  experience: string
  verified: boolean
  interviewStatus: "pending" | "completed" | "selected"
}

interface VerificationQueue {
  id: string
  name: string
  quizScore: number
  documentsVerified: boolean
  interviewDate: string
  status: "pending" | "passed" | "failed"
}

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)

  const stats = {
    totalPatients: 1247,
    totalNurses: 389,
    activeMatches: 45,
    successRate: 94.5
  }

  const matchingProcesses: MatchingProcess[] = [
    {
      id: "1",
      patientName: "Ramesh Kumar",
      symptoms: ["Fever", "Headache", "Body Pain"],
      status: "interviewing",
      matchedNurses: [
        { id: "n1", name: "Priya Sharma", matchScore: 95, skills: ["General Care", "Elderly Care"], experience: "5 years", verified: true, interviewStatus: "completed" },
        { id: "n2", name: "Anjali Verma", matchScore: 88, skills: ["General Care"], experience: "3 years", verified: true, interviewStatus: "pending" },
        { id: "n3", name: "Sunita Roy", matchScore: 82, skills: ["Home Care"], experience: "4 years", verified: true, interviewStatus: "pending" }
      ],
      createdAt: "2024-01-15 10:30"
    },
    {
      id: "2",
      patientName: "Sunita Devi",
      symptoms: ["Post-surgery care", "Wound dressing"],
      status: "shortlisting",
      matchedNurses: [
        { id: "n4", name: "Meera Patel", matchScore: 92, skills: ["Surgical Care", "ICU"], experience: "7 years", verified: true, interviewStatus: "pending" },
        { id: "n5", name: "Kavita Singh", matchScore: 89, skills: ["Wound Care"], experience: "6 years", verified: true, interviewStatus: "pending" }
      ],
      createdAt: "2024-01-15 11:45"
    },
    {
      id: "3",
      patientName: "Mohan Patel",
      symptoms: ["Diabetes monitoring", "Insulin administration"],
      status: "matched",
      matchedNurses: [
        { id: "n6", name: "Rekha Joshi", matchScore: 98, skills: ["Diabetes Care", "Chronic Care"], experience: "8 years", verified: true, interviewStatus: "selected" }
      ],
      createdAt: "2024-01-14 14:20"
    }
  ]

  const verificationQueue: VerificationQueue[] = [
    { id: "v1", name: "Neha Gupta", quizScore: 92, documentsVerified: true, interviewDate: "2024-01-16", status: "pending" },
    { id: "v2", name: "Pooja Sharma", quizScore: 88, documentsVerified: true, interviewDate: "2024-01-15", status: "passed" },
    { id: "v3", name: "Ritu Agarwal", quizScore: 65, documentsVerified: false, interviewDate: "-", status: "failed" },
    { id: "v4", name: "Sonia Mehta", quizScore: 95, documentsVerified: true, interviewDate: "2024-01-17", status: "pending" }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case "shortlisting": return "bg-blue-500 text-white"
      case "interviewing": return "bg-yellow-500 text-black"
      case "matched": case "passed": return "bg-primary text-primary-foreground"
      case "completed": case "selected": return "bg-primary text-primary-foreground"
      case "failed": return "bg-destructive text-white"
      case "pending": return "bg-muted text-muted-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getProgressValue = (status: string) => {
    switch(status) {
      case "shortlisting": return 33
      case "interviewing": return 66
      case "matched": case "completed": return 100
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
            <Badge variant="outline" className="ml-2">Admin</Badge>
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
              <span className="hidden text-sm font-medium md:block">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalPatients}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified Nurses</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalNurses}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Matches</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeMatches}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">{stats.successRate}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="matching" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="matching" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Matching
            </TabsTrigger>
            <TabsTrigger value="verification" className="gap-2">
              <UserCheck className="h-4 w-4" />
              Verification Queue
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Activity className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* AI Matching Tab */}
          <TabsContent value="matching" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search by patient name or symptoms..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Matching Processes */}
            <div className="space-y-4">
              {matchingProcesses.map((process) => (
                <Card 
                  key={process.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedProcess === process.id ? "border-primary" : ""}`}
                  onClick={() => setSelectedProcess(selectedProcess === process.id ? null : process.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Brain className="h-5 w-5 text-primary" />
                          {process.patientName}
                        </CardTitle>
                        <CardDescription>Created: {process.createdAt}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(process.status)}>
                        {process.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Symptoms */}
                      <div className="flex flex-wrap gap-2">
                        {process.symptoms.map((symptom, i) => (
                          <Badge key={i} variant="outline">{symptom}</Badge>
                        ))}
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Matching Progress</span>
                          <span className="font-medium">{process.matchedNurses.length} nurses shortlisted</span>
                        </div>
                        <Progress value={getProgressValue(process.status)} className="h-2" />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>Shortlisting</span>
                          <span>Interview</span>
                          <span>Matched</span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedProcess === process.id && (
                        <div className="mt-4 pt-4 border-t border-border space-y-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Shortlisted Nurses (AI Ranked)
                          </h4>
                          <div className="space-y-3">
                            {process.matchedNurses.map((nurse) => (
                              <div 
                                key={nurse.id}
                                className="flex items-center justify-between rounded-lg border border-border p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium flex items-center gap-2">
                                      {nurse.name}
                                      {nurse.verified && (
                                        <Badge variant="outline" className="text-xs">
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          Verified
                                        </Badge>
                                      )}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {nurse.experience} | {nurse.skills.join(", ")}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge className="bg-primary/10 text-primary">
                                    {nurse.matchScore}% Match
                                  </Badge>
                                  <Badge className={getStatusColor(nurse.interviewStatus)}>
                                    {nurse.interviewStatus}
                                  </Badge>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Video className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <Button className="gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Finalize Match
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <Video className="h-4 w-4" />
                              Schedule Interview
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${selectedProcess === process.id ? "rotate-90" : ""}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Verification Queue Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Nurse Verification Queue
                </CardTitle>
                <CardDescription>
                  Review AI assessment results and approve verified nurses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationQueue.map((nurse) => (
                    <div 
                      key={nurse.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{nurse.name}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Brain className="h-3 w-3" />
                              Quiz: {nurse.quizScore}%
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Docs: {nurse.documentsVerified ? "Verified" : "Pending"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Interview: {nurse.interviewDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(nurse.status)}>
                          {nurse.status.toUpperCase()}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play className="h-4 w-4" />
                          </Button>
                          {nurse.status === "pending" && (
                            <>
                              <Button size="sm" className="h-8">Approve</Button>
                              <Button size="sm" variant="destructive" className="h-8">Reject</Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>AI Matching Performance</CardTitle>
                  <CardDescription>Success metrics over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Match Score</span>
                      <span className="font-medium text-foreground">92.3%</span>
                    </div>
                    <Progress value={92.3} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Patient Satisfaction</span>
                      <span className="font-medium text-foreground">94.5%</span>
                    </div>
                    <Progress value={94.5} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Nurse Acceptance Rate</span>
                      <span className="font-medium text-foreground">87.2%</span>
                    </div>
                    <Progress value={87.2} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Verification Stats</CardTitle>
                  <CardDescription>Nurse onboarding metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Quiz Pass Rate</span>
                      <span className="font-medium text-foreground">78.5%</span>
                    </div>
                    <Progress value={78.5} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Document Verification</span>
                      <span className="font-medium text-foreground">95.2%</span>
                    </div>
                    <Progress value={95.2} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Interview Completion</span>
                      <span className="font-medium text-foreground">89.1%</span>
                    </div>
                    <Progress value={89.1} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: CheckCircle, text: "Nurse Priya Sharma matched with patient Ramesh Kumar", time: "5 min ago", color: "text-primary" },
                      { icon: Brain, text: "AI shortlisted 3 nurses for patient Sunita Devi", time: "15 min ago", color: "text-primary" },
                      { icon: UserCheck, text: "Nurse Rekha Joshi completed verification", time: "1 hour ago", color: "text-primary" },
                      { icon: AlertTriangle, text: "High priority request received from Andheri", time: "2 hours ago", color: "text-yellow-500" },
                      { icon: Video, text: "Interview completed for Nurse Anjali Verma", time: "3 hours ago", color: "text-primary" }
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ${activity.color}`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{activity.text}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
