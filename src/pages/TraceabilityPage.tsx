import { useEffect, useRef, useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

import { MapPin, Ship, Clock,  Leaf, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

// Types for traceability data
interface FarmInfo {
  id: string
  name: string
  location: string
  farmer: string
  story: string
  practices: string[]
  certifications: string[]
  coordinates: { lat: number; lng: number }
}

interface JourneyStep {
  id: string
  title: string
  description: string
  location: string
  duration: string
  icon: React.ReactNode
  coordinates: { lat: number; lng: number }
  details: string[]
}

export default function TraceabilityPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [_, setMap] = useState<any>(null)
  const [polyline, setPolyline] = useState<any>(null)
  const navigate = useNavigate()

  // Farm information
  const farmData: FarmInfo = {
    id: "farm-001",
    name: "Southern Cross Farm",
    location: "Dunedin, South Island, New Zealand",
    farmer: "Sarah & Michael Thompson",
    story: "Our family has been farming this land for three generations. We believe in sustainable practices that respect both the animals and the environment. Our cattle graze freely on lush pastures, ensuring the highest quality beef while maintaining the natural ecosystem.",
    practices: ["Grass-fed", "Free-range", "Sustainable farming", "Animal welfare focused"],
    certifications: ["NZ Beef + Lamb Quality Mark", "Organic Certification", "Animal Welfare Approved"],
    coordinates: { lat: -45.8788, lng: 170.5028 } // Dunedin coordinates
  }

  // Journey steps from farm to plate
  const journeySteps: JourneyStep[] = [
    {
      id: "step-1",
      title: "Farm",
      description: "Grass-fed beef from our certified farm",
      location: "Dunedin, New Zealand",
      duration: "Day 1",
      icon: <Leaf className="w-5 h-5" />,
      coordinates: { lat: -45.8788, lng: 170.5028 },
      details: ["Quality inspection", "Processing"]
    },
    {
      id: "step-2",
      title: "Port",
      description: "Shipment departs New Zealand",
      location: "Port of Otago",
      duration: "Day 2",
      icon: <Ship className="w-5 h-5" />,
      coordinates: { lat: -45.8167, lng: 170.6167 },
      details: ["Refrigerated containers", "Customs clearance"]
    },
    {
      id: "step-3",
      title: "Ocean",
      description: "Sustainable sea transport",
      location: "Pacific Ocean",
      duration: "Days 3-20",
      icon: <Ship className="w-5 h-5" />,
      coordinates: { lat: -20.0000, lng: 160.0000 },
      details: ["Temperature monitoring", "Quality checks"]
    },
    {
      id: "step-4",
      title: "Destination",
      description: "Beef arrives in Shanghai",
      location: "Shanghai, China",
      duration: "Day 21",
      icon: <MapPin className="w-5 h-5" />,
      coordinates: { lat: 31.2304, lng: 121.4737 },
      details: ["Final inspection", "Distribution"]
    }
  ]

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) return

      try {
        const mapInstance = new (window.google as any).maps.Map(mapRef.current, {
          zoom: 3,
          center: { lat: -20, lng: 160 },
          mapTypeId: "terrain"
        })

        setMap(mapInstance)

        // Create polyline for the journey
        const flightPlanCoordinates = [
          { lat: -45.8788, lng: 170.5028 }, // Dunedin
          { lat: -45.8167, lng: 170.6167 }, // Port of Otago
          { lat: -20.0000, lng: 160.0000 }, // Pacific Ocean
          { lat: 31.2304, lng: 121.4737 },  // Shanghai
        ]

        const polylineInstance = new (window.google as any).maps.Polyline({
          path: flightPlanCoordinates,
          geodesic: true,
          strokeColor: "#FF6B35",
          strokeOpacity: 1.0,
          strokeWeight: 4,
        })

        polylineInstance.setMap(mapInstance)
        setPolyline(polylineInstance)

        // Add markers for key points
        const markers = [
          {
            position: { lat: -45.8788, lng: 170.5028 },
            title: "Dunedin Farm",
            icon: "🏔️"
          },
          {
            position: { lat: 31.2304, lng: 121.4737 },
            title: "Shanghai Destination", 
            icon: "🏙️"
          }
        ]

        markers.forEach(markerData => {
          new (window.google as any).maps.Marker({
            position: markerData.position,
            map: mapInstance,
            title: markerData.title,
            label: markerData.icon
          })
        })
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    // Load Google Maps API
    if (!window.google) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg'
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&language=en&v=weekly`
      script.async = true
      script.defer = true
      script.onload = initMap
      script.onerror = () => {
        console.error('Failed to load Google Maps API')
        // Fallback: show a message instead of the map
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-muted/20 rounded-lg">
              <div class="text-center p-6">
            <div class="text-2xl mb-2">🗺️</div>
            <p class="text-muted-foreground">Interactive map temporarily unavailable</p>
            <p class="text-sm text-muted-foreground mt-2">Please check back later</p>
          </div>
        </div>
      `
        }
      }
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      if (polyline) {
        polyline.setMap(null)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-background to-rose-50">
      {/* Header */}
     <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-primary">Tracing the Journey Demo</h1>
          <div className="flex items-center gap-3">
            <Button 
              variant="default" 
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/90"
            >
              Back Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">


        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Building Trust Through Transparency
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Show consumers exactly where their beef comes from - from the rolling hills of Dunedin, 
            New Zealand to their table in Shanghai, China. This builds trust and differentiates us from grain-fed competitors.
          </p>
        </section>

        {/* Journey Map */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Journey Map
              </CardTitle>
              <CardDescription>
                Interactive map showing the complete journey from farm to destination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                ref={mapRef} 
                className="w-full h-[400px] md:h-[500px] rounded-lg border"
              />
            </CardContent>
          </Card>
        </section>

        {/* Farm Information */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Farm Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{farmData.name}</h3>
                  <p className="text-muted-foreground mb-4">{farmData.location}</p>
                  <p className="text-muted-foreground mb-4">{farmData.story}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Practices</h4>
                      <div className="flex flex-wrap gap-2">
                        {farmData.practices.map((practice, index) => (
                          <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md">
                            {practice}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg p-6">
                  <h4 className="font-semibold text-primary mb-4">Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm">Grass-fed and free-range</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm">Sustainable practices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm">Full traceability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Journey Timeline */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Journey Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {journeySteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-primary">{step.title}</h3>
                        <span className="px-2 py-1 border border-border text-xs rounded-md">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <p className="text-xs text-primary">{step.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>



      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Creating goodness from the farms the world needs. We are Silver Fern Farms.</p>
            <p className="mt-2">© 2025 Silver Fern Farms. All rights reserved.</p>
            <div className="mt-4 pt-4 border-t border-border/20">
              <p className="text-xs">
                Demo created by <a href="https://chenxue3.github.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Zoea</a> for GradConnect Days
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
