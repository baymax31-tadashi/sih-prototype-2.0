"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Navigation, Phone, Clock, Shield, AlertTriangle, Route, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for safe locations
const safeLocations = [
  {
    id: "SL-001",
    name: "Mumbai Emergency Shelter",
    type: "Emergency Shelter",
    address: "Bandra Kurla Complex, Mumbai, Maharashtra",
    lat: 19.0596,
    lng: 72.8656,
    capacity: 500,
    facilities: ["Medical Aid", "Food", "Water", "Communication"],
    contact: "+91-22-2659-2222",
    operatingHours: "24/7",
    accessibility: "Wheelchair Accessible",
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    id: "SL-002",
    name: "Coast Guard Station Mumbai",
    type: "Coast Guard Station",
    address: "Colaba, Mumbai, Maharashtra",
    lat: 18.9067,
    lng: 72.8147,
    capacity: 200,
    facilities: ["Rescue Operations", "Medical Aid", "Communication", "Boats"],
    contact: "1554",
    operatingHours: "24/7",
    accessibility: "Limited Access",
    lastUpdated: "2024-01-15T09:30:00Z",
  },
  {
    id: "SL-003",
    name: "Chennai Relief Center",
    type: "Relief Center",
    address: "Marina Beach Road, Chennai, Tamil Nadu",
    lat: 13.0475,
    lng: 80.2824,
    capacity: 800,
    facilities: ["Medical Aid", "Food", "Water", "Temporary Housing"],
    contact: "+91-44-2536-0000",
    operatingHours: "24/7",
    accessibility: "Fully Accessible",
    lastUpdated: "2024-01-15T08:45:00Z",
  },
  {
    id: "SL-004",
    name: "Kochi Port Authority Emergency Center",
    type: "Port Authority",
    address: "Willingdon Island, Kochi, Kerala",
    lat: 9.9667,
    lng: 76.2667,
    capacity: 300,
    facilities: ["Rescue Operations", "Medical Aid", "Communication"],
    contact: "+91-484-266-8001",
    operatingHours: "24/7",
    accessibility: "Wheelchair Accessible",
    lastUpdated: "2024-01-15T07:20:00Z",
  },
  {
    id: "SL-005",
    name: "Goa Disaster Management Center",
    type: "Disaster Management",
    address: "Panaji, Goa",
    lat: 15.4909,
    lng: 73.8278,
    capacity: 400,
    facilities: ["Medical Aid", "Food", "Water", "Communication", "Transport"],
    contact: "+91-832-242-4001",
    operatingHours: "24/7",
    accessibility: "Fully Accessible",
    lastUpdated: "2024-01-15T06:15:00Z",
  },
  {
    id: "SL-006",
    name: "Visakhapatnam Naval Base Emergency",
    type: "Naval Base",
    address: "Naval Base, Visakhapatnam, Andhra Pradesh",
    lat: 17.7231,
    lng: 83.3012,
    capacity: 600,
    facilities: ["Rescue Operations", "Medical Aid", "Communication", "Helicopters"],
    contact: "+91-891-256-4000",
    operatingHours: "24/7",
    accessibility: "Limited Access",
    lastUpdated: "2024-01-15T05:30:00Z",
  },
]

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

interface SafeLocationFinderProps {
  disasterLocation?: { lat: number; lng: number; address?: string }
  disasterType?: string
}

export function SafeLocationFinder({ disasterLocation, disasterType }: SafeLocationFinderProps) {
  const { toast } = useToast()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchLocation, setSearchLocation] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [nearestLocations, setNearestLocations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [locationError, setLocationError] = useState("")

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        setLocationError("")
        setIsLoading(false)
        toast({
          title: "Location captured",
          description: "Finding nearest safe locations...",
        })
      },
      (error) => {
        setLocationError("Unable to retrieve location. Please enter manually.")
        setIsLoading(false)
        console.error("Location error:", error)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  // Find nearest safe locations
  useEffect(() => {
    const targetLocation = disasterLocation || userLocation
    if (!targetLocation) return

    const locationsWithDistance = safeLocations.map((location) => ({
      ...location,
      distance: calculateDistance(targetLocation.lat, targetLocation.lng, location.lat, location.lng),
    }))

    // Filter by type if specified
    const filteredLocations =
      filterType === "all"
        ? locationsWithDistance
        : locationsWithDistance.filter((loc) => loc.type.toLowerCase().includes(filterType.toLowerCase()))

    // Sort by distance and take top 5
    const sortedLocations = filteredLocations.sort((a, b) => a.distance - b.distance).slice(0, 5)

    setNearestLocations(sortedLocations)
  }, [userLocation, disasterLocation, filterType])

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "emergency shelter":
        return "bg-green-500"
      case "coast guard station":
        return "bg-blue-500"
      case "relief center":
        return "bg-purple-500"
      case "port authority":
        return "bg-orange-500"
      case "disaster management":
        return "bg-red-500"
      case "naval base":
        return "bg-gray-600"
      default:
        return "bg-gray-500"
    }
  }

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  const getDirections = (location: any) => {
    const targetLocation = disasterLocation || userLocation
    if (!targetLocation) return

    // In a real app, this would open Google Maps or similar
    const url = `https://www.google.com/maps/dir/${targetLocation.lat},${targetLocation.lng}/${location.lat},${location.lng}`
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Shield className="w-6 h-6" />
            Safe Location Finder
          </CardTitle>
          <CardDescription className="text-green-700">
            {disasterLocation
              ? `Finding safe locations near the disaster area${disasterType ? ` (${disasterType})` : ""}`
              : "Find the nearest safe locations and emergency shelters in your area"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Location Input */}
      {!disasterLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="location">Enter your location or coordinates</Label>
                <Input
                  id="location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="e.g., Mumbai, Maharashtra or 19.0760, 72.8777"
                />
              </div>
              <div className="flex flex-col justify-end">
                <Button onClick={getCurrentLocation} disabled={isLoading} variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  {isLoading ? "Getting..." : "Use Current"}
                </Button>
              </div>
            </div>
            {locationError && <p className="text-sm text-destructive">{locationError}</p>}
            {userLocation && (
              <p className="text-sm text-muted-foreground">
                Current location: {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="filter">Filter by type:</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="emergency shelter">Emergency Shelters</SelectItem>
                <SelectItem value="coast guard">Coast Guard Stations</SelectItem>
                <SelectItem value="relief center">Relief Centers</SelectItem>
                <SelectItem value="port authority">Port Authorities</SelectItem>
                <SelectItem value="disaster management">Disaster Management</SelectItem>
                <SelectItem value="naval base">Naval Bases</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Safe Locations List */}
      {nearestLocations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Nearest Safe Locations
          </h3>

          {nearestLocations.map((location, index) => (
            <Card key={location.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{location.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-white ${getTypeColor(location.type)}`}>{location.type}</Badge>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {formatDistance(location.distance)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {location.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {location.contact}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {location.operatingHours}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Facilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {location.facilities.map((facility: string) => (
                          <Badge key={facility} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Capacity:</span> {location.capacity} people
                        <span className="mx-2">•</span>
                        <span className="font-medium">Access:</span> {location.accessibility}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => getDirections(location)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Route className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                    <Button onClick={() => window.open(`tel:${location.contact}`, "_self")} size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Emergency Information */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Emergency Contacts</h3>
              <div className="space-y-1 text-sm text-red-700">
                <p>
                  <strong>Coast Guard Emergency:</strong> 1554
                </p>
                <p>
                  <strong>National Emergency:</strong> 112
                </p>
                <p>
                  <strong>Disaster Management:</strong> 1078
                </p>
                <p>
                  <strong>Fire Services:</strong> 101
                </p>
              </div>
              <p className="text-xs text-red-600 mt-2">
                For immediate life-threatening emergencies, call these numbers first before heading to safe locations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Important Information</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Safe locations are updated in real-time based on current capacity and accessibility</li>
                <li>• Contact the facility before traveling to confirm availability</li>
                <li>• Bring identification, essential medications, and emergency supplies if possible</li>
                <li>• Follow official evacuation routes and instructions from authorities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
