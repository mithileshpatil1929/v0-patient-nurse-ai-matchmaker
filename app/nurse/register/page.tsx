"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Heart, Upload, CheckCircle, MessageCircle, Send,
  FileText, Video, ArrowRight, ArrowLeft, Loader2
} from "lucide-react"

type OnboardingStep = "info" | "documents" | "quiz" | "interview" | "complete"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

export default function NurseRegistration() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("info")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    specialization: "",
    nursingCouncilId: "",
  })
  const [documents, setDocuments] = useState({
    nursingId: false,
    experience: false,
    cv: false
  })
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [quizPassed, setQuizPassed] = useState<boolean | null>(null)
  const [chatMessages, setChatMessages] = useState([
    { type: "ai", content: "Welcome to the AI Medical Assessment. I will ask you 5 questions to verify your medical knowledge. Ready?" }
  ])
  const [chatInput, setChatInput] = useState("")

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "A patient presents with a blood pressure reading of 180/110 mmHg. How would you classify this?",
      options: ["Normal", "Elevated", "Hypertension Stage 1", "Hypertensive Crisis"],
      correctAnswer: 3
    },
    {
      id: 2,
      question: "What is the correct sequence for CPR in adults?",
      options: ["Airway, Breathing, Compressions", "Compressions, Airway, Breathing", "Breathing, Compressions, Airway", "Airway, Compressions, Breathing"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "A diabetic patient shows signs of hypoglycemia. What is the first step?",
      options: ["Administer insulin", "Give orange juice or glucose", "Call for emergency", "Check blood sugar level"],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "What is the normal range for oxygen saturation (SpO2)?",
      options: ["85-90%", "90-94%", "95-100%", "80-85%"],
      correctAnswer: 2
    },
    {
      id: 5,
      question: "Which vein is commonly used for IV cannulation in adults?",
      options: ["Jugular vein", "Femoral vein", "Cephalic vein", "Subclavian vein"],
      correctAnswer: 2
    }
  ]

  const getStepProgress = () => {
    switch(currentStep) {
      case "info": return 20
      case "documents": return 40
      case "quiz": return 60
      case "interview": return 80
      case "complete": return 100
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleDocumentUpload = (docType: keyof typeof documents) => {
    setIsProcessing(true)
    setTimeout(() => {
      setDocuments(prev => ({ ...prev, [docType]: true }))
      setIsProcessing(false)
    }, 1500)
  }

  const handleQuizAnswer = (questionId: number, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  const submitQuiz = () => {
    setIsProcessing(true)
    setTimeout(() => {
      const correctCount = quizQuestions.filter(
        q => quizAnswers[q.id] === q.correctAnswer
      ).length
      setQuizPassed(correctCount >= 4)
      setIsProcessing(false)
    }, 2000)
  }

  const handleChatSend = () => {
    if (!chatInput.trim()) return
    
    setChatMessages(prev => [...prev, { type: "user", content: chatInput }])
    setChatInput("")

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setChatMessages(prev => [...prev, { 
          type: "ai", 
          content: `Good answer! Next question: ${quizQuestions[currentQuestion + 1].question}` 
        }])
      } else {
        setChatMessages(prev => [...prev, { 
          type: "ai", 
          content: "Thank you for completing the assessment. Your responses are being analyzed..." 
        }])
        setTimeout(() => {
          setQuizPassed(true)
          setChatMessages(prev => [...prev, { 
            type: "ai", 
            content: "Congratulations! You have passed the AI Medical Assessment. You can now proceed to the video interview stage." 
          }])
        }, 2000)
      }
    }, 1000)
  }

  const renderStep = () => {
    switch(currentStep) {
      case "info":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Tell us about yourself and your nursing experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Enter your full name" 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    placeholder="your@email.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="+91 9876543210" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input 
                    id="experience" 
                    name="experience" 
                    placeholder="e.g., 5 years" 
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Textarea 
                    id="specialization" 
                    name="specialization"
                    placeholder="Describe your areas of expertise..." 
                    value={formData.specialization}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nursingCouncilId">Nursing Council ID</Label>
                  <Input 
                    id="nursingCouncilId" 
                    name="nursingCouncilId"
                    placeholder="e.g., NC123456" 
                    value={formData.nursingCouncilId}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Button 
                className="w-full gap-2" 
                onClick={() => setCurrentStep("documents")}
                disabled={!formData.name || !formData.email || !formData.phone}
              >
                Continue to Documents
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )

      case "documents":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>Upload your credentials and certificates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* Nursing Council ID */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Nursing Council ID</p>
                      <p className="text-sm text-muted-foreground">Required for verification</p>
                    </div>
                  </div>
                  {documents.nursingId ? (
                    <Badge className="bg-primary gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Uploaded
                    </Badge>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDocumentUpload("nursingId")}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Upload
                    </Button>
                  )}
                </div>

                {/* Experience Certificate */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Experience Certificate</p>
                      <p className="text-sm text-muted-foreground">From previous employers</p>
                    </div>
                  </div>
                  {documents.experience ? (
                    <Badge className="bg-primary gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Uploaded
                    </Badge>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDocumentUpload("experience")}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Upload
                    </Button>
                  )}
                </div>

                {/* CV */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">CV / Resume</p>
                      <p className="text-sm text-muted-foreground">Your professional resume</p>
                    </div>
                  </div>
                  {documents.cv ? (
                    <Badge className="bg-primary gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Uploaded
                    </Badge>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDocumentUpload("cv")}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Upload
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="gap-2" onClick={() => setCurrentStep("info")}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1 gap-2" 
                  onClick={() => setCurrentStep("quiz")}
                  disabled={!documents.nursingId || !documents.experience || !documents.cv}
                >
                  Continue to AI Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case "quiz":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                AI Medical Assessment
              </CardTitle>
              <CardDescription>
                Answer the following medical questions to verify your skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quizPassed === null ? (
                <div className="space-y-6">
                  {/* Chat Interface */}
                  <div className="h-64 overflow-y-auto rounded-lg border border-border p-4 space-y-3">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-xl px-4 py-2 ${
                          msg.type === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-foreground"
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Current Question */}
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm font-medium mb-3">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </p>
                    <p className="font-medium mb-4">{quizQuestions[currentQuestion].question}</p>
                    <RadioGroup 
                      value={quizAnswers[quizQuestions[currentQuestion].id] !== undefined ? quizAnswers[quizQuestions[currentQuestion].id].toString() : ""}
                      onValueChange={(val) => handleQuizAnswer(quizQuestions[currentQuestion].id, parseInt(val))}
                    >
                      {quizQuestions[currentQuestion].options.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                          <Label htmlFor={`option-${i}`} className="cursor-pointer">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type your explanation (optional)..." 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                    />
                    <Button size="icon" onClick={handleChatSend}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => setCurrentStep("documents")}>
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      className="flex-1 gap-2" 
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length < quizQuestions.length || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Submit Assessment
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : quizPassed ? (
                <div className="text-center py-8">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Assessment Passed!</h3>
                  <p className="text-muted-foreground mb-6">
                    Congratulations! You have successfully passed the AI Medical Assessment.
                  </p>
                  <Button className="gap-2" onClick={() => setCurrentStep("interview")}>
                    Proceed to Video Interview
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Assessment Not Passed</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to score at least 80% to proceed. You can retry after 24 hours.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setQuizAnswers({})
                    setQuizPassed(null)
                    setCurrentQuestion(0)
                  }}>
                    Review Your Answers
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "interview":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Video Interview
              </CardTitle>
              <CardDescription>
                Complete a video interview to finalize your verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Video Interview Interface</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    You will be connected with our AI interviewer
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <h4 className="font-medium">Interview Guidelines:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>1. Ensure you have a stable internet connection</li>
                  <li>2. Find a quiet, well-lit environment</li>
                  <li>3. Have your documents ready for reference</li>
                  <li>4. The interview will take approximately 15-20 minutes</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="gap-2" onClick={() => setCurrentStep("quiz")}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1 gap-2" 
                  onClick={() => {
                    setIsProcessing(true)
                    setTimeout(() => {
                      setIsProcessing(false)
                      setCurrentStep("complete")
                    }, 2000)
                  }}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Starting Interview...
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4" />
                      Start Interview
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case "complete":
        return (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Registration Complete!
              </h2>
              <p className="text-muted-foreground mb-2">
                Welcome to Digital Savers, {formData.name}!
              </p>
              <Badge className="mb-6 bg-primary">AI Verified Nurse</Badge>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Your profile has been verified. You can now receive job requests from patients. 
                Keep your availability status updated to receive new opportunities.
              </p>
              <Link href="/nurse">
                <Button className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )
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
          <Link href="/nurse">
            <Button variant="outline" size="sm">Already Registered?</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Registration Progress</span>
              <span className="text-sm text-muted-foreground">{getStepProgress()}%</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span className={currentStep === "info" ? "text-primary font-medium" : ""}>Info</span>
              <span className={currentStep === "documents" ? "text-primary font-medium" : ""}>Documents</span>
              <span className={currentStep === "quiz" ? "text-primary font-medium" : ""}>AI Quiz</span>
              <span className={currentStep === "interview" ? "text-primary font-medium" : ""}>Interview</span>
              <span className={currentStep === "complete" ? "text-primary font-medium" : ""}>Complete</span>
            </div>
          </div>

          {/* Step Content */}
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
