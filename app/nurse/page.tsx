"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, User, Bell, Settings, LogOut, Briefcase, 
  MapPin, Clock, Calendar, Star, Video, FileText,
  CheckCircle, AlertCircle, ChevronRight, X, Phone,
  Activity, Users
} from "lucide-react"
import { useStore, type CareRequest, type NurseMatch } from "@/lib/store"

export default function NurseDashboard() {
  const { 
    currentNurse, 
    nurses,
    setCurrentNurse,
    updateNurseOnlineStatus,
    careRequests,
    acceptRequest,
    rejectRequest,
    notifications,
    getUnreadCount,
    markNotificationRead
  } = useStore()
  
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [activeTab, setActiveTab] = useState("new")

  // Set default nurse if not set
  useEffect(() => {
    if (!currentNurse && nurses.length > 0) {
      setCurrentNurse(nurses[0])
    }
  }, [currentNurse, nurses, setCurrentNurse])

  if (!currentNurse) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // Get requests where this nurse is matched
  const getMyRequests = () => {
    return careRequests.filter(request => 
      request.matchedNurses.some(match => match.nurse.id === currentNurse.id)
    )
  }

  const myRequests = getMyRequests()
  const newRequests = myRequests.filter(r => {
    const myMatch = r.matchedNurses.find(m => m.nurse.id === currentNurse.id)
    return myMatch?.interviewStatus === "pending" && r.status !== "matched" && r.status !== "completed"
  })
  const acceptedRequests = myRequests.filter(r => r.assignedNurse?.id === currentNurse.id)
  const pendingRequests = myRequests.filter(r => {
    const myMatch = r.matchedNurses.find(m => m.nurse.id === currentNurse.id)
    return myMatch?.interviewStatus !== "pending" && myMatch?.interviewStatus !== "accepted" && r.status !== "matched"
  })

  const nurseNotifications = notifications.filter(n => n.forRole === "nurse" && n.forUserId === currentNurse.id)
  const unreadCount = getUnreadCount("nurse", currentNurse.id)

  const handleAccept = (requestId: string) => {
    acceptRequest(requestId, currentNurse.id)
    setSelectedJob(null)
  }

  const handleReject = (requestId: string) => {
    rejectRequest(requestId, currentNurse.id)
    setSelectedJob(null)
  }

  const toggleOnlineStatus = (checked: boolean) => {
    updateNurseOnlineStatus(currentNurse.id, checked)
  }

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
      case "pending": return "bg-blue-500 text-white"
      case "shortlisting": return "bg-blue-500 text-white"
      case "interview": return "bg-yellow-500 text-black"
      case "matched": return "bg-primary text-primary-foreground"
      case "completed": return "bg-primary/80 text-primary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getMatchScore = (request: CareRequest): number => {
    const match = request.matchedNurses.find(m => m.nurse.id === currentNurse.id)
    return match?.matchScore || 0
  }

  const RequestCard = ({ request, showActions = true }: { request: CareRequest, showActions?: boolean }) => {
    const matchScore = getMatchScore(request)
    const isSelected = selectedJob === request.id
    const myMatch = request.matchedNurses.find(m => m.nurse.id === currentNurse.id)

    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "border-primary" : ""}`}
        onClick={() => setSelectedJob(isSelected ? null : request.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{request.patient.name}</CardTitle>
              <CardDescription>Age: {request.patient.age} years</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(request.priority)}>
                {request.priority.toUpperCase()}
              </Badge>
              {request.assignedNurse?.id === currentNurse.id ? (
                <Badge className="bg-primary text-primary-foreground">ASSIGNED</Badge>
              ) : (
                <Badge className={getStatusColor(request.status)}>
                  {request.status.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">Symptoms:</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {request.symptoms.map((symptom, i) => (
                  <Badge key={i} variant="outline">{symptom}</Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Duration: {request.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{request.patient.location}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">AI Match Score:</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {matchScore}%
                </Badge>
              </div>
              <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${isSelected ? "rotate-90" : ""}`} />
            </div>
          </div>

          {/* Expanded Details */}
          {isSelected && (
            <div className="mt-4 pt-4 border-t border-border space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="font-medium text-foreground mb-2">Case Summary</h4>
                <p className="text-sm text-muted-foreground">
                  Patient requires {request.duration} of care for {request.symptoms.join(", ").toLowerCase()}. 
                  Located in {request.patient.location}. {request.priority === "high" ? "Immediate attention required." : "Standard care protocol applicable."}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Contact: {request.patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Service: {request.serviceType === "immediate" ? "Immediate" : "Long-term"}</span>
                  </div>
                </div>
              </div>
              
              {showActions && myMatch?.interviewStatus === "pending" && (
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 gap-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAccept(request.id)
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Accept Job
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReject(request.id)
                    }}
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </Button>
                </div>
              )}

              {request.assignedNurse?.id === currentNurse.id && (
                <div className="flex gap-3">
                  <Button className="flex-1 gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Patient
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <MapPin className="h-4 w-4" />
                    Get Directions
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
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
              <span className={`text-sm font-medium ${currentNurse.isOnline ? "text-primary" : "text-muted-foreground"}`}>
                {currentNurse.isOnline ? "Online" : "Offline"}
              </span>
              <Switch 
                checked={currentNurse.isOnline} 
                onCheckedChange={toggleOnlineStatus}
                className="data-[state=checked]:bg-primary"
              />
            </div>
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
                    {nurseNotifications.length === 0 ? (
                      <p className="p-4 text-center text-sm text-muted-foreground">No notifications</p>
                    ) : (
                      nurseNotifications.slice(0, 10).map(notif => (
                        <div 
                          key={notif.id}
                          className={`p-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 ${!notif.read ? "bg-primary/5" : ""}`}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notif.createdAt.toLocaleTimeString()}
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
                <CardTitle className="mt-4">{currentNurse.name}</CardTitle>
                <CardDescription>{currentNurse.specialization}</CardDescription>
                {currentNurse.verified && (
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
                    <span className="text-sm font-medium">{currentNurse.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{currentNurse.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed Jobs</span>
                    <span className="text-sm font-medium">{currentNurse.completedJobs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium">{currentNurse.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={currentNurse.isOnline ? "default" : "secondary"}>
                      {currentNurse.isOnline ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-primary/5 p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{newRequests.length}</p>
                    <p className="text-xs text-muted-foreground">New Requests</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{acceptedRequests.length}</p>
                    <p className="text-xs text-muted-foreground">Active Jobs</p>
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
                  Completed Jobs ({currentNurse.completedJobs})
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
              <h2 className="text-2xl font-bold text-foreground">Care Requests</h2>
              <div className="flex items-center gap-2">
                {newRequests.length > 0 && (
                  <Badge className="gap-1 bg-blue-500">
                    <AlertCircle className="h-3 w-3" />
                    {newRequests.length} New
                  </Badge>
                )}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="new" className="gap-2">
                  <AlertCircle className="h-4 w-4" />
                  New ({newRequests.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="gap-2">
                  <Users className="h-4 w-4" />
                  Active ({acceptedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <Clock className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-4 mt-4">
                {!currentNurse.isOnline ? (
                  <Card className="border-dashed">
                    <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground">You are currently offline. Go online to receive new requests.</p>
                      <Button className="mt-4" onClick={() => toggleOnlineStatus(true)}>
                        Go Online
                      </Button>
                    </CardContent>
                  </Card>
                ) : newRequests.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-10 text-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No new care requests at the moment.</p>
                      <p className="text-sm text-muted-foreground mt-2">New requests will appear here when patients need help.</p>
                    </CardContent>
                  </Card>
                ) : (
                  newRequests.map((request) => (
                    <RequestCard key={request.id} request={request} showActions={true} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="active" className="space-y-4 mt-4">
                {acceptedRequests.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-10 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No active jobs.</p>
                      <p className="text-sm text-muted-foreground mt-2">Accept a request to start caring for patients.</p>
                    </CardContent>
                  </Card>
                ) : (
                  acceptedRequests.map((request) => (
                    <RequestCard key={request.id} request={request} showActions={false} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-4">
                <Card className="border-dashed">
                  <CardContent className="py-10 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No completed jobs yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">Your job history will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
