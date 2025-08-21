import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart3, Beef, ArrowRight,  Leaf } from "lucide-react"
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-background to-rose-50">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-primary"> Made for Silver Fern Farms GradConnect Days</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/consumer-analysis" className="text-muted-foreground hover:text-foreground transition-colors">
                Consumer Insights
              </Link>
              <Link to="/traceability" className="text-muted-foreground hover:text-foreground transition-colors">
                Traceability
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
            Staying Competitive
            <span className="block text-accent">in Global Markets</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Understanding what consumers really want when they choose imported beef, and how we can turn challenges into opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/consumer-analysis">
                Consumer Analysis
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link to="/traceability">
                Traceability Journey
                <Beef className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link to="/consumer-analysis">
          <Card className="border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-2xl text-primary">What Consumers Really Want</CardTitle>
              <CardDescription className="text-muted-foreground">
                Discover what people discuss when choosing imported beef - origin, price, taste, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-warm rounded-full mr-3" />
                  Country vs country competition insights
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-warm rounded-full mr-3" />
                  Origin preference analysis
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-warm rounded-full mr-3" />
                  Price and quality discussions
                </li>
              </ul>
            </CardContent>
          </Card>
          </Link>

          <Link to="/traceability">
          <Card className="border-rose/20 hover:border-rose/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-rose/10 rounded-lg flex items-center justify-center mb-4">
                <Beef className="w-6 h-6 text-rose" />
              </div>
              <CardTitle className="text-2xl text-primary">Building Trust Through Transparency</CardTitle>
              <CardDescription className="text-muted-foreground">
                Show consumers exactly where their beef comes from - from pasture to plate with full traceability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-rose rounded-full mr-3" />
                  Interactive journey map
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-rose rounded-full mr-3" />
                  Farmer stories & farm info
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-rose rounded-full mr-3" />
                  "100% grass-fed" differentiation
                </li>
              </ul>
            </CardContent>
          </Card>
          </Link>
        </div>
      </section>

      

      

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
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
