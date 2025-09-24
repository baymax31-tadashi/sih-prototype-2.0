"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { SafeLocationFinder } from "@/components/safe-location-finder"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for threat validation - ideally this would come from an API
const pendingReports = [
  {
    id: "RPT-001",
    title: "Severe Coastal Flooding",
    type: "Flood Alert",
    location: "Mumbai Marine Drive",
    reporter: "Rajesh Kumar",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    submittedAt: "2024-01-15T10:30:00Z",
    threatLevel: "High",
    status: "pending",
    description: "Heavy rainfall causing severe flooding along Marine Drive. Water level rising rapidly.",
    media: ["/coastal-flooding-infrastructure.jpg"],
    coordinates: { lat: 18.922, lng: 72.8347 },
    verificationScore: 85,
    socialMentions: 23,
    officialSources: 2,
  },
  {
    id: "RPT-002",
    title: "Oil Spill Detected",
    type: "Marine Pollution",
    location: "Goa Beaches",
    reporter: "Priya Singh",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    submittedAt: "2024-01-15T09:15:00Z",
    threatLevel: "Medium",
    status: "pending",
    description: "Large oil spill observed near popular tourist beaches. Marine life at risk.",
    media: ["/marine-pollution-oil-spill.jpg"],
    coordinates: { lat: 15.2993, lng: 74.124 },
    verificationScore: 72,
    socialMentions: 15,
    officialSources: 1,
  },
  {
    id: "RPT-003",
    title: "Infrastructure Damage",
    type: "Infrastructure Damage",
    location: "Kochi Port",
    reporter: "Mohammed Ali",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    submittedAt: "2024-01-15T08:45:00Z",
    threatLevel: "Low",
    status: "pending",
    description: "Pier damage observed after recent storm. Needs immediate attention.",
    media: ["/damaged-coastal-infrastructure.jpg"],
    coordinates: { lat: 9.9312, lng: 76.2673 },
    verificationScore: 91,
    socialMentions: 8,
    officialSources: 3,
  },
]

export default function SafeLocationsPage() {
  const [selectedReport, setSelectedReport] = useState<{ lat: number; lng: number; address: string } | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Safe Location Finder</h1>
            <p className="text-muted-foreground">
              Find the nearest emergency shelters, relief centers, and safe locations during coastal disasters
            </p>
          </div>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Select Disaster Area</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={(value) => {
                  const report = pendingReports.find((report) => report.id === value)
                  if (report) {
                    setSelectedReport({
                      lat: report.coordinates.lat,
                      lng: report.coordinates.lng,
                      address: report.location,
                    })
                  } else {
                    setSelectedReport(null)
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a disaster area" />
                </SelectTrigger>
                <SelectContent>
                  {pendingReports.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.title} - {report.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <SafeLocationFinder disasterLocation={selectedReport || undefined} />
        </div>
      </div>
    </div>
  )
}
