"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Phone, AlertTriangle, MapPin, Clock, X, 
  CheckCircle, Ambulance, Users, Loader2
} from "lucide-react"

interface SOSEmergencyProps {
  isOpen: boolean
  onClose: () => void
}

type EmergencyStatus = "idle" | "confirming" | "alerting" | "dispatched" | "help_arriving"

export function SOSEmergency({ isOpen, onClose }: SOSEmergencyProps) {
  const [status, setStatus] = useState<EmergencyStatus>("idle")
  const [countdown, setCountdown] = useState(5)
  const [eta, setEta] = useState<number | null>(null)

  useEffect(() => {
    if (status === "confirming" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (status === "confirming" && countdown === 0) {
      triggerEmergency()
    }
  }, [status, countdown])

  const startSOS = () => {
    setStatus("confirming")
    setCountdown(5)
  }

  const cancelSOS = () => {
    setStatus("idle")
    setCountdown(5)
  }

  const triggerEmergency = () => {
    setStatus("alerting")
    // Simulate alerting process
    setTimeout(() => {
      setStatus("dispatched")
      setEta(12)
      // Simulate ETA countdown
      const etaInterval = setInterval(() => {
        setEta(prev => {
          if (prev && prev > 1) return prev - 1
          clearInterval(etaInterval)
          setStatus("help_arriving")
          return 0
        })
      }, 2000)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-destructive/50 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mx-auto h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive">Emergency SOS</CardTitle>
          <CardDescription>
            Instant help for medical emergencies
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {status === "idle" && (
            <>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  This will immediately alert emergency services and notify your emergency contacts.
                </p>
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="w-full h-16 text-lg font-bold gap-2"
                  onClick={startSOS}
                >
                  <Phone className="h-6 w-6" />
                  TRIGGER SOS
                </Button>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <h4 className="font-medium text-sm">What happens when you trigger SOS:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Ambulance className="h-4 w-4 mt-0.5 text-destructive" />
                    Nearest ambulance will be dispatched
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5 text-destructive" />
                    Your emergency contacts will be notified
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-destructive" />
                    Your location will be shared with responders
                  </li>
                </ul>
              </div>
            </>
          )}

          {status === "confirming" && (
            <div className="text-center space-y-6">
              <div className="relative mx-auto h-32 w-32">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={351.86}
                    strokeDashoffset={351.86 - (351.86 * (5 - countdown)) / 5}
                    className="text-destructive transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-destructive">{countdown}</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  Triggering SOS in {countdown} seconds...
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tap cancel if this was accidental
                </p>
              </div>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={cancelSOS}
              >
                Cancel SOS
              </Button>
            </div>
          )}

          {status === "alerting" && (
            <div className="text-center space-y-6">
              <div className="mx-auto h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center animate-pulse">
                <Loader2 className="h-10 w-10 text-destructive animate-spin" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  Alerting Emergency Services...
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please stay calm, help is on the way
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Location shared</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Contacting emergency services...</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Notifying emergency contacts...</span>
                </div>
              </div>
            </div>
          )}

          {(status === "dispatched" || status === "help_arriving") && (
            <div className="text-center space-y-6">
              <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Ambulance className={`h-10 w-10 text-primary ${status === "dispatched" ? "animate-bounce" : ""}`} />
              </div>
              
              {status === "dispatched" && eta !== null && (
                <>
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      Help is on the way!
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-3xl font-bold text-primary">
                      <Clock className="h-8 w-8" />
                      <span>{eta} min</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Estimated arrival time
                    </p>
                  </div>

                  <Progress value={((12 - eta) / 12) * 100} className="h-2" />

                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Location shared</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Ambulance dispatched</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Emergency contacts notified</span>
                    </div>
                  </div>
                </>
              )}

              {status === "help_arriving" && (
                <>
                  <div>
                    <Badge className="bg-primary text-lg px-4 py-2">ARRIVING NOW</Badge>
                    <p className="text-lg font-medium text-foreground mt-4">
                      Help has arrived!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Medical team is at your location
                    </p>
                  </div>
                  <Button onClick={onClose} className="w-full">
                    Close
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Emergency Contact Info */}
          {status !== "help_arriving" && (
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground text-center">
                Your registered location:{" "}
                <span className="font-medium text-foreground">Andheri West, Mumbai</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
