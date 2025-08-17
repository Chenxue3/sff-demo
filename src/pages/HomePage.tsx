import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart3, Beef, ArrowRight, Sparkles, Globe, Leaf, Users } from "lucide-react"
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
              <span className="text-xl font-semibold text-primary">Silver Fern Farms</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/consumer-analysis" className="text-muted-foreground hover:text-foreground transition-colors">
                Consumer Insights
              </Link>
              <Link to="/beef-interactive" className="text-muted-foreground hover:text-foreground transition-colors">
                Beef Guide
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
            Creating Goodness
            <span className="block text-accent">From the Farms</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Exploring consumer demand patterns and sustainable beef production through data-driven insights and interactive visualizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/consumer-analysis">
                Consumer Analysis
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link to="/beef-interactive">
                Beef Interactive Guide
                <Beef className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-2xl text-primary">Consumer Demand Analysis</CardTitle>
              <CardDescription className="text-muted-foreground">
                Analyze global consumer behavior patterns through word frequency data, translated and categorized for market insights across 60+ countries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-warm rounded-full mr-3" />
                  Global market preference analysis
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-warm rounded-full mr-3" />
                  Regional consumption patterns
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-warm rounded-full mr-3" />
                  Data-driven decision making
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-rose/20 hover:border-rose/40 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-rose/10 rounded-lg flex items-center justify-center mb-4">
                <Beef className="w-6 h-6 text-rose" />
              </div>
              <CardTitle className="text-2xl text-primary">Interactive Beef Guide</CardTitle>
              <CardDescription className="text-muted-foreground">
                Explore New Zealand's finest grass-fed beef cuts with detailed information about characteristics, nutrition, and sustainable farming practices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-rose rounded-full mr-3" />
                  Interactive cow diagram
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-rose rounded-full mr-3" />
                  Nutritional information
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-rose rounded-full mr-3" />
                  Sustainable farming insights
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Guided by Māori values and committed to creating goodness from the farms the world needs.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">Manaakitanga</h3>
            <p className="text-sm text-muted-foreground">Acting with respect, integrity and kindness in all that we do.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">Kotahitanga</h3>
            <p className="text-sm text-muted-foreground">Unity and solidarity, working together as one global team.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-warm/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-warm" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">Kaitiakitanga</h3>
            <p className="text-sm text-muted-foreground">Connecting us to our past, present and future through stewardship.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">60+</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">6,000+</div>
            <div className="text-sm text-muted-foreground">Farmers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warm mb-2">75+</div>
            <div className="text-sm text-muted-foreground">Years</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Grass-fed</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Creating goodness from the farms the world needs. We are Silver Fern Farms.</p>
            <p className="mt-2">© 2025 Silver Fern Farms. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
