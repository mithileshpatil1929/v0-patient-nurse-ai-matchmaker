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
  ChevronRight, Eye, Play, User, MapPin, Phone
} from "lucide-react"
import { useStore, type CareRequest } from "@/lib/store"

export default function AdminDashboard() {
  const { 
    nurses, 
    careRequests, 
    assignNurseToRequest,
    notifications,
    getUnreadCount,
    markNotificationRead
  } = useStore()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)

  const adminNotifications = notifications.filter(n => n.forRole === "admin")
  const unreadCount = getUnreadCount("admin", "admin")

  // Calculate stats
  const stats = {
    totalPatients: careRequests.length,
    totalNurses: nurses.length,
    verifiedNurses: nurses.filter(n => n.verified).length,
    onlineNurses: nurses.filter(n => n.isOnline).length,
    activeMatches: careRequests.filter(r => r.status === "shortlisting" || r.status === "interview").length,
    completedMatches: careRequests.filter(r => r.status === "matched" || r.status === "completed").length,
    pendingRequests: careRequests.filter(r => r.status === "pending" || r.status === "shortlisting").length
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "pending": return "bg-gray-500 text-white"
      case "shortlisting": return "bg-blue-500 text-white"
      case "interview": return "bg-yellow-500 text-black"
      case "matched": case "completed": return "bg-primary text-primary-foreground"
      case "cancelled": return "bg-destructive text-white"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "bg-red-500 text-white"
      case "medium": return "bg-yellow-500 text-black"
      case "low": return "bg-primary text-primary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getProgressValue = (status: string) => {
    switch(status) {
      case "pending": return 15
      case "shortlisting": return 33
      case "interview": return 66
      case "matched": case "completed": return 100
      default: return 0
    }
  }

  const handleAssignNurse = (requestId: string, nurseId: string) => {
    assignNurseToRequest(requestId, nurseId)
  }

  const filteredRequests = careRequests.filter(request => 
    searchQuery === "" || 
    request.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
            <Badge variant="outline" className="ml-2">Admin Panel</Badge>
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
                <div className="absolute right-0 top-12 w-96 rounded-lg border border-border bg-card shadow-lg z-50">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold">Activity Feed</h3>
                    <Badge variant="outline">{adminNotifications.length} total</Badge>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {adminNotifications.length === 0 ? (
                      <p className="p-4 text-center text-sm text-muted-foreground">No activity yet</p>
                    ) : (
                      adminNotifications.slice(0, 15).map(notif => (
                        <div 
                          key={notif.id}
                          className={`p-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 ${!notif.read ? "bg-primary/5" : ""}`}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`h-2 w-2 rounded-full mt-2 ${
                              notif.type === "request" ? "bg-blue-500" :
                              notif.type === "match" ? "bg-primary" :
                              notif.type === "assignment" ? "bg-yellow-500" :
                              "bg-gray-500"
                            }`} />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notif.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notif.createdAt.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
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
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalPatients}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.pendingRequests} pending</p>
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
                  <p className="text-2xl font-bold text-foreground">{stats.verifiedNurses}</p>
                  <p className="text-xs text-primary mt-1">{stats.onlineNurses} online now</p>
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
                  <p className="text-xs text-muted-foreground mt-1">In progress</p>
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
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{stats.completedMatches}</p>
                  <p className="text-xs text-primary mt-1">Successfully matched</p>
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
            <TabsTrigger value="nurses" className="gap-2">
              <UserCheck className="h-4 w-4" />
              Nurses ({nurses.length})
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

            {/* Care Requests */}
            {filteredRequests.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Care Requests Yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    When patients submit care requests through the Patient Portal, they will appear here with AI-matched nurses.
                  </p>
                  <div className="mt-6 flex justify-center gap-4">
                    <Link href="/patient">
                      <Button variant="outline">Open Patient Portal</Button>
                    </Link>
                    <Link href="/nurse">
                      <Button variant="outline">Open Nurse Portal</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card 
                    key={request.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedProcess === request.id ? "border-primary" : ""}`}
                    onClick={() => setSelectedProcess(selectedProcess === request.id ? null : request.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            {request.patient.name}
                          </CardTitle>
                          <CardDescription>
                            Created: {request.createdAt.toLocaleString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Symptoms */}
                        <div className="flex flex-wrap gap-2">
                          {request.symptoms.map((symptom, i) => (
                            <Badge key={i} variant="outline">{symptom}</Badge>
                          ))}
                        </div>

                        {/* Patient Info */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Age: {request.patient.age}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{request.patient.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{request.duration}</span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Matching Progress</span>
                            <span className="font-medium">{request.matchedNurses.length} nurses shortlisted</span>
                          </div>
                          <Progress value={getProgressValue(request.status)} className="h-2" />
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>Shortlisting</span>
                            <span>Interview</span>
                            <span>Matched</span>
                          </div>
                        </div>

                        {/* Assigned Nurse */}
                        {request.assignedNurse && (
                          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium flex items-center gap-2">
                                  Assigned: {request.assignedNurse.name}
                                  <Badge variant="outline" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {request.assignedNurse.experience} | {request.assignedNurse.specialization}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Expanded Details */}
                        {selectedProcess === request.id && !request.assignedNurse && (
                          <div className="mt-4 pt-4 border-t border-border space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              Shortlisted Nurses (AI Ranked)
                            </h4>
                            <div className="space-y-3">
                              {request.matchedNurses.map((match) => (
                                <div 
                                  key={match.nurse.id}
                                  className="flex items-center justify-between rounded-lg border border-border p-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium flex items-center gap-2">
                                        {match.nurse.name}
                                        {match.nurse.verified && (
                                          <Badge variant="outline" className="text-xs">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Verified
                                          </Badge>
                                        )}
                                        <Badge variant={match.nurse.isOnline ? "default" : "secondary"} className="text-xs">
                                          {match.nurse.isOnline ? "Online" : "Offline"}
                                        </Badge>
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {match.nurse.experience} | {match.nurse.skills.slice(0, 2).join(", ")}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Badge className="bg-primary/10 text-primary">
                                      {match.matchScore}% Match
                                    </Badge>
                                    <Badge className={
                                      match.interviewStatus === "accepted" ? "bg-primary text-primary-foreground" :
                                      match.interviewStatus === "rejected" ? "bg-destructive text-white" :
                                      "bg-muted text-muted-foreground"
                                    }>
                                      {match.interviewStatus}
                                    </Badge>
                                    <Button 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleAssignNurse(request.id, match.nurse.id)
                                      }}
                                      disabled={match.interviewStatus === "rejected"}
                                    >
                                      Assign
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${selectedProcess === request.id ? "rotate-90" : ""}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Nurses Tab */}
          <TabsContent value="nurses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Registered Nurses
                </CardTitle>
                <CardDescription>
                  All verified nurses in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nurses.map((nurse) => (
                    <div 
                      key={nurse.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            {nurse.name}
                            {nurse.verified && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{nurse.specialization}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {nurse.experience}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {nurse.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              {nurse.completedJobs} jobs
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={nurse.isOnline ? "default" : "secondary"}>
                          {nurse.isOnline ? "Online" : "Offline"}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">&#9733;</span>
                          <span>{nurse.rating}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
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
                  <CardTitle>Platform Overview</CardTitle>
                  <CardDescription>Real-time statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Care Requests</span>
                      <span className="text-lg font-bold">{stats.totalPatients}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Requests</span>
                      <span className="text-lg font-bold text-yellow-500">{stats.pendingRequests}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Matching</span>
                      <span className="text-lg font-bold text-blue-500">{stats.activeMatches}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Successfully Matched</span>
                      <span className="text-lg font-bold text-primary">{stats.completedMatches}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nurse Availability</CardTitle>
                  <CardDescription>Current status overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Registered</span>
                      <span className="text-lg font-bold">{stats.totalNurses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Verified</span>
                      <span className="text-lg font-bold text-primary">{stats.verifiedNurses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Currently Online</span>
                      <span className="text-lg font-bold text-primary">{stats.onlineNurses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Offline</span>
                      <span className="text-lg font-bold text-muted-foreground">{stats.totalNurses - stats.onlineNurses}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {adminNotifications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No activity yet. Activity will appear here when patients and nurses interact with the platform.</p>
                ) : (
                  <div className="space-y-3">
                    {adminNotifications.slice(0, 10).map(notif => (
                      <div key={notif.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                        <div className={`h-2 w-2 rounded-full mt-2 ${
                          notif.type === "request" ? "bg-blue-500" :
                          notif.type === "match" ? "bg-primary" :
                          notif.type === "assignment" ? "bg-yellow-500" :
                          "bg-gray-500"
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {notif.createdAt.toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
