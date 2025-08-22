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
  const mapInstanceRef = useRef<any>(null)
  const basePolylineRef = useRef<any>(null)
  const highlightPolylineRef = useRef<any>(null)
  const stepMarkersRef = useRef<any[]>([])
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null)
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

        mapInstanceRef.current = mapInstance

        // Create polyline for the journey
        const flightPlanCoordinates = journeySteps.map(s => ({ lat: s.coordinates.lat, lng: s.coordinates.lng }))

        // Base path
        const basePolyline = new (window.google as any).maps.Polyline({
          path: flightPlanCoordinates,
          geodesic: true,
          strokeColor: "#94A3B8",
          strokeOpacity: 0.6,
          strokeWeight: 3,
        })
        basePolyline.setMap(mapInstance)
        basePolylineRef.current = basePolyline

        // Highlighted path (dynamic)
        const highlightPolyline = new (window.google as any).maps.Polyline({
          path: [],
          geodesic: true,
          strokeColor: "#FF6B35",
          strokeOpacity: 1.0,
          strokeWeight: 4,
        })
        highlightPolyline.setMap(mapInstance)
        highlightPolylineRef.current = highlightPolyline

        // Add markers for key points
        stepMarkersRef.current = []
        journeySteps.forEach((step, idx) => {
          const marker = new (window.google as any).maps.Marker({
            position: step.coordinates,
            map: mapInstance,
            title: `${idx + 1}. ${step.title} - ${step.location}`,
            label: { text: String(idx + 1), color: "#ffffff" },
            icon: {
              path: (window.google as any).maps.SymbolPath.CIRCLE,
              fillColor: "#0EA5E9",
              fillOpacity: 0.9,
              strokeColor: "#0EA5E9",
              strokeWeight: 1,
              scale: 6
            }
          })
          marker.addListener('click', () => handleSelectStep(idx))
          stepMarkersRef.current.push(marker)
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
      if (basePolylineRef.current) basePolylineRef.current.setMap(null)
      if (highlightPolylineRef.current) highlightPolylineRef.current.setMap(null)
      if (stepMarkersRef.current?.length) {
        stepMarkersRef.current.forEach(m => m.setMap(null))
        stepMarkersRef.current = { current: [] } as any
      }
    }
  }, [])

  // Handle selecting a step from the timeline or marker
  const handleSelectStep = (index: number) => {
    try {
      setActiveStepIndex(index)
      const step = journeySteps[index]
      
      if (mapInstanceRef.current && step) {
        const map = mapInstanceRef.current
        
        // Smooth pan and zoom animation with easing
        const currentCenter = map.getCenter()
        const targetCenter = step.coordinates
        
        // Calculate zoom level based on step type
        let targetZoom = 5
        if (index === 0) targetZoom = 6 // Farm - closer zoom
        else if (index === 1) targetZoom = 5 // Port - medium zoom  
        else if (index === 2) targetZoom = 3 // Ocean - wider view
        else if (index === 3) targetZoom = 6 // Destination - closer zoom
        
        // Smooth pan with easing
        const panOptions = {
          center: targetCenter,
          zoom: targetZoom,
          duration: 1000,
          easing: 'easeInOutCubic'
        }
        
        // Use Google Maps panTo with smooth animation
        map.panTo(targetCenter)
        map.setZoom(targetZoom)
      }

      // Animate polyline path progressively
      const coords = journeySteps.map(s => ({ lat: s.coordinates.lat, lng: s.coordinates.lng }))
      if (highlightPolylineRef.current) {
        const path = coords.slice(0, index + 1)
        highlightPolylineRef.current.setPath(path)
        
        // Add a brief flash effect to the polyline
        highlightPolylineRef.current.setOptions({
          strokeOpacity: 1.0,
          strokeWeight: 5
        })
        setTimeout(() => {
          if (highlightPolylineRef.current) {
            highlightPolylineRef.current.setOptions({
              strokeOpacity: 0.8,
              strokeWeight: 4
            })
          }
        }, 300)
      }

      // Enhanced marker animation
      stepMarkersRef.current?.forEach((marker, idx) => {
        if (marker && (window.google as any)?.maps?.Animation) {
          if (idx === index) {
            // Active marker: bounce animation
            marker.setAnimation((window.google as any).maps.Animation.BOUNCE)
            setTimeout(() => marker.setAnimation(null), 1500)
            
            // Update marker appearance for active state
            marker.setIcon({
              path: (window.google as any).maps.SymbolPath.CIRCLE,
              fillColor: "#FF6B35",
              fillOpacity: 1.0,
              strokeColor: "#FF6B35", 
              strokeWeight: 2,
              scale: 8
            })
          } else {
            // Inactive markers: subtle scale down
            marker.setIcon({
              path: (window.google as any).maps.SymbolPath.CIRCLE,
              fillColor: "#0EA5E9",
              fillOpacity: 0.6,
              strokeColor: "#0EA5E9",
              strokeWeight: 1,
              scale: 5
            })
          }
        }
      })
      
    } catch (e) {
      console.error('Error in handleSelectStep:', e)
    }
  }

  // Auto-select first step on mount with delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current && journeySteps.length > 0) {
        handleSelectStep(0)
      }
    }, 800)
    
    return () => clearTimeout(timer)
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

        {/* Map + Timeline side by side on desktop, stacked on mobile */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Journey Map */}
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
                  className="w-full h-[320px] sm:h-[380px] md:h-[460px] lg:h-[520px] rounded-lg border transition-all duration-500 hover:shadow-xl hover:scale-[1.01] transform"
                />
              </CardContent>
            </Card>

            {/* Journey Timeline */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Journey Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 md:pl-8">
                  <div className="absolute left-3 md:left-4 top-0 bottom-0 w-px bg-border animate-pulse opacity-60 z-0" />
                  <div className="space-y-4">
                    {journeySteps.map((step, index) => (
                      <div key={step.id} className="relative">
                        <div className="absolute -left-0.5 md:-left-[3px] top-2 z-10">
                          <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full bg-background  flex items-center justify-center transition-all duration-300 ${activeStepIndex===index ? 'border-accent text-accent scale-110 shadow-lg' : 'border-border text-primary hover:scale-105'}`}>
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStepIndex===index ? 'bg-accent scale-125' : 'bg-primary'}`} />
                            {activeStepIndex === index && (
                              <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
                            )}
                          </div>
                        </div>
                        <div className="ml-2 md:ml-4 relative z-0">
                          <button 
                            onClick={() => handleSelectStep(index)} 
                            className={`w-full text-left rounded-lg border p-3 md:p-4 bg-background/60 backdrop-blur-sm transition-all duration-500 transform ${activeStepIndex===index ? 'border-accent bg-accent/5 scale-[1.02] shadow-lg' : 'hover:bg-accent/5 hover:scale-[1.01] hover:shadow-md active:scale-[0.98]'} border-l-0 focus:outline-none`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary transition-transform duration-300 hover:scale-110">
                                  {step.icon}
                                </div>
                                <h3 className={`font-semibold transition-colors duration-300 ${activeStepIndex===index ? 'text-accent' : 'text-primary'}`}>
                                  {index + 1}. {step.title}
                                </h3>
                              </div>
                              <span className={`px-2 py-1  text-xs rounded-md whitespace-nowrap transition-all duration-300 ${activeStepIndex===index ? 'bg-accent/20 border-accent text-accent' : 'border-border hover:bg-accent/10 hover:border-accent'}`}>
                                {step.duration}
                              </span>
                            </div>
                            <p className={`text-sm mb-1 transition-colors duration-300 ${activeStepIndex===index ? 'text-accent/80' : 'text-muted-foreground'}`}>{step.description}</p>
                            <p className={`text-xs transition-colors duration-300 ${activeStepIndex===index ? 'text-accent' : 'text-primary'}`}>{step.location}</p>
                            {step.details?.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {step.details.map((d, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md text-xs  transition-all duration-200 hover:bg-accent/5 hover:border-accent/50">{d}</span>
                                ))}
                              </div>
                            )}
                          </button>
                        </div>
                        {index !== journeySteps.length - 1 && (
                          <div className={`absolute left-3 md:left-4 top-[2.25rem] w-px transition-all duration-500 z-0 ${activeStepIndex === index ? 'bg-accent' : 'bg-border'}`} style={{ height: 'calc(100% - 2.25rem)' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

