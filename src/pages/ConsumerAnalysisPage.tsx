import { useEffect, useMemo, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link } from 'react-router-dom'
import type { ChartConfig } from "../components/ui/chart"
import {ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

// Types
type LabeledWord = {
  zh: string
  en: string
  frequency: number
  labels: string[]
}

type LabelStat = {
  label: string
  totalFrequency: number
  wordCount: number
}

// Hide low-signal contextual tags by default
const HIDDEN_BY_DEFAULT = new Set([
  'high_frequency_word','short_word','long_word','code_number','foreign_word'
])

// Always hide these categories from UI
const ALWAYS_HIDE = new Set(['other','not_important'])

type TabKey = 'categories' | 'top100' | 'origins'

interface CountryData {
  name: string
  frequency: number
  percentage: number
  words: Array<{
    zh: string
    en: string
    frequency: number
  }>
}

interface OriginAnalysisData {
  countries: CountryData[]
  total_mentions: number
  unique_countries: number
}

export default function ConsumerAnalysisPage() {
  const [data, setData] = useState<LabeledWord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('categories')
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const [topFilterLabel, setTopFilterLabel] = useState<string | null>(null)
  const [originData, setOriginData] = useState<OriginAnalysisData | null>(null)
  const [originLoading, setOriginLoading] = useState(false)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch('/data/labeled.json')
        if (!res.ok) throw new Error(`Failed to load labeled.json (${res.status})`)
        const json: LabeledWord[] = await res.json()
        setData(json)
      } catch (e: any) {
        setError(e.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Load origin data when origins tab is selected
  useEffect(() => {
    if (activeTab === 'origins' && !originData && !originLoading) {
      setOriginLoading(true)
      fetch('/data/country_analysis.json')
        .then(res => res.json())
        .then((data: OriginAnalysisData) => setOriginData(data))
        .catch(() => {})
        .finally(() => setOriginLoading(false))
    }
  }, [activeTab, originData, originLoading])

  // Chart configuration for origins
  const chartConfig: ChartConfig = {
    frequency: {
      label: "Mentions",
      color: "hsl(var(--chart-1))",
    },
  }

  const chartData = useMemo(() => {
    if (!originData) return []
    const colors = ["#85BEDC", "#CABEE9", "#A6B0BB", "#CCBBCD", "#647588", "#070604", "#F9E211", "#797A87", "#A8ACAD", "#D6CBB5"]
    return originData.countries.slice(0, 10).map((country, index) => ({
      name: country.name,
      frequency: country.frequency,
      percentage: country.percentage,
      fill: colors[index % colors.length]
    }))
  }, [originData])

  const visibleData = useMemo(() => {
    return data.map(item => ({
      ...item,
      labels: item.labels.filter(l => !ALWAYS_HIDE.has(l) && !HIDDEN_BY_DEFAULT.has(l))
    }))
  }, [data])

  const labelStats: LabelStat[] = useMemo(() => {
    const totals: Record<string, { freq: number; count: number }> = {}
    for (const item of visibleData) {
      for (const l of item.labels) {
        if (!totals[l]) totals[l] = { freq: 0, count: 0 }
        totals[l].freq += item.frequency
        totals[l].count += 1
      }
    }
    return Object.entries(totals)
      .map(([label, v]) => ({ label, totalFrequency: v.freq, wordCount: v.count }))
      .sort((a, b) => b.totalFrequency - a.totalFrequency)
  }, [visibleData])

  const wordsForActive = useMemo(() => {
    if (!activeLabel) return []
    return visibleData
      .filter(w => w.labels.includes(activeLabel))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 50)
  }, [activeLabel, visibleData])

  // Auto-scroll to details on mobile when category is selected
  useEffect(() => {
    if (activeLabel && detailsRef.current && window.innerWidth < 768) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }, 100)
    }
  }, [activeLabel])

  // Top 100 by frequency with optional label filter
  const top100Base = useMemo(() => {
    return [...visibleData].sort((a, b) => b.frequency - a.frequency).slice(0, 100)
  }, [visibleData])

  const top100LabelStats = useMemo(() => {
    const totals: Record<string, { freq: number; count: number }> = {}
    for (const item of top100Base) {
      for (const l of item.labels) {
        if (!totals[l]) totals[l] = { freq: 0, count: 0 }
        totals[l].freq += item.frequency
        totals[l].count += 1
      }
    }
    return Object.entries(totals)
      .map(([label, v]) => ({ label, totalFrequency: v.freq, wordCount: v.count }))
      .sort((a, b) => b.totalFrequency - a.totalFrequency)
  }, [top100Base])

  const top100Filtered = useMemo(() => {
    const list = top100Base
    if (!topFilterLabel) return list
    return list.filter(w => w.labels.includes(topFilterLabel))
  }, [top100Base, topFilterLabel])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-semibold text-primary">Consumer Analysis</h1>
          
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link to="/">Back Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            The Real Competition: Country vs Country
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            When Chinese consumers choose imported beef, they're not comparing brands - they're comparing countries. Australia leads, but New Zealand has unique advantages.
          </p>
          {/* divider */}
          <div className="w-full h-[1px] bg-border my-10"></div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Click the tabs below to explore the data.
          </p>
        </section>

      

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
            variant={activeTab==='origins' ? 'default' : 'outline'}
            onClick={() => setActiveTab('origins')}
            size="sm"
          >
            Origin Analysis
          </Button>
          <Button
            variant={activeTab==='categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
            size="sm"
          >
            Categories
          </Button>
          <Button
            variant={activeTab==='top100' ? 'default' : 'outline'}
            onClick={() => setActiveTab('top100')}
            size="sm"
          >
            Top 100 Words
          </Button>
          
        </div>

        {loading && (
          <div className="text-center text-muted-foreground">Loading data…</div>
        )}
        {error && (
          <div className="text-center text-destructive">{error}</div>
        )}

        {!loading && !error && activeTab==='categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left: Label ranking */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-primary">Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {labelStats.length === 0 && (
                    <div className="text-sm text-muted-foreground">No labels to display</div>
                  )}
                  {labelStats.map((ls) => (
                    <button
                      key={ls.label}
                      onClick={() => setActiveLabel(ls.label)}
                      className={`w-full text-left px-3 py-2 rounded-md border hover:bg-accent/10 transition flex items-center justify-between ${activeLabel===ls.label? 'border-accent text-accent' : 'border-border'}`}
                    >
                      <span className="truncate mr-3">{ls.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {ls.totalFrequency} / {ls.wordCount}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right: Active label details */}
            <Card className="md:col-span-2 lg:col-span-2" ref={detailsRef}>
              <CardHeader>
                <CardTitle className="text-primary">
                  {activeLabel ? `Top words: ${activeLabel}` : 'Select a category to explore'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!activeLabel && (
                  <div className="text-sm text-muted-foreground">Pick a category to see top words and frequencies.</div>
                )}
                {activeLabel && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {wordsForActive.map((w) => (
                      <div key={w.zh+activeLabel} className="flex items-center justify-between rounded-md border p-3">
                        <div className="min-w-0">
                          <div className="font-medium text-primary truncate">{w.zh} <span className="text-muted-foreground">({w.en})</span></div>
                          <div className="text-xs text-muted-foreground truncate">{w.labels.join(' · ')}</div>
                        </div>
                        <div className="text-sm text-muted-foreground pl-3 shrink-0">{w.frequency}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && !error && activeTab==='top100' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left: label filter for top100 */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-primary">Filter Top 100 by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    size="sm"
                    variant={topFilterLabel===null ? 'default' : 'outline'}
                    onClick={() => setTopFilterLabel(null)}
                  >
                    All
                  </Button>
                  {top100LabelStats.map((ls) => (
                    <Button
                      key={ls.label}
                      size="sm"
                      variant={topFilterLabel===ls.label ? 'default' : 'outline'}
                      onClick={() => setTopFilterLabel(ls.label)}
                    >
                      {ls.label}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Showing {top100Filtered.length} / 100 words
                </div>
              </CardContent>
            </Card>

            {/* Right: top100 list */}
            <Card className="md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-primary">Top 100 Words by Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {top100Filtered.map((w) => (
                    <div key={w.zh+(topFilterLabel||'all')} className="flex items-center justify-between rounded-md border p-3">
                      <div className="min-w-0">
                        <div className="font-medium text-primary truncate">{w.zh} <span className="text-muted-foreground">({w.en})</span></div>
                        <div className="text-xs text-muted-foreground truncate">{w.labels.join(' · ')}</div>
                      </div>
                      <div className="text-sm text-muted-foreground pl-3 shrink-0">{w.frequency}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && !error && activeTab==='origins' && (
          <div className="space-y-6">
            {/* Origin analysis stats overview */}
            {originData && (
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Mentions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{originData.total_mentions.toLocaleString()}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Countries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{originData.unique_countries}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Top Origin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{originData.countries[0]?.name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">{originData.countries[0]?.percentage}%</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Origin Distribution Chart</CardTitle>
              </CardHeader>
              <CardContent>
                {originLoading && (
                  <div className="text-center text-muted-foreground py-8">Loading chart data...</div>
                )}
                {!originLoading && !originData && (
                  <div className="text-center text-muted-foreground py-8">Failed to load chart data</div>
                )}
                {originData && chartData.length > 0 && (
                  <div className="w-full">
                    <ChartContainer config={chartConfig} className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full max-w-2xl mx-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={false}
                            outerRadius="70%"
                            innerRadius="30%"
                            fill="#8884d8"
                            dataKey="frequency"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                            formatter={(value: any, _name: any, props: any) => [
                              `${value} mentions (${props.payload?.percentage}%)`,
                              props.payload?.name || 'Country'
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    
                    {/* Legend below the chart */}
                    <div className="flex flex-wrap gap-2">
                      {chartData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: entry.fill }}
                          />
                          <span className="truncate font-medium">{entry.name}</span>
                          <span className="text-muted-foreground text-xs">({entry.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Country rankings with hover */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Most Discussed Product Origins</CardTitle>
              </CardHeader>
              <CardContent>
                {originLoading && (
                  <div className="text-center text-muted-foreground py-8">Loading origin data...</div>
                )}
                {!originLoading && !originData && (
                  <div className="text-center text-muted-foreground py-8">Failed to load origin data</div>
                )}
                {originData && (
                  <div className="space-y-4">
                    {originData.countries.slice(0, 10).map((country, index) => {
                      const maxFreq = originData.countries[0]?.frequency || 1
                      const countryWords = country.words.slice(0, 5)
                      return (
                        <div 
                          key={country.name} 
                          className="relative flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/5 transition-colors cursor-pointer group"
                          onMouseEnter={() => setHoveredCountry(country.name)}
                          onMouseLeave={() => setHoveredCountry(null)}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{country.name}</span>
                              <div className="text-sm text-muted-foreground">
                                {country.frequency} mentions ({country.percentage}%)
                              </div>
                            </div>
                            
                            <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${(country.frequency / maxFreq) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Hover tooltip */}
                          {hoveredCountry === country.name && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-background border border-border rounded-lg shadow-lg z-10 min-w-[200px]">
                              <div className="text-sm font-medium mb-2 text-center">{country.name}</div>
                              <div className="space-y-1">
                                {countryWords.map((word, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs">
                                    <span className="font-medium">{word.zh}</span>
                                    <span className="text-muted-foreground ml-2">({word.en})</span>
                                    <span className="text-muted-foreground ml-2">{word.frequency}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Control Strategy */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-primary">Turning Geographic Challenges into Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">The Challenge</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Being located at the edge of the world means higher shipping costs, currency fluctuations, and tariff uncertainties that impact our export strategy.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• High fuel costs for long-distance shipping</li>
                      <li>• Currency exchange rate volatility</li>
                      <li>• Tariff changes affecting pricing</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Our Response</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Instead of just accepting these costs, we can turn them into competitive advantages and new revenue streams.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Long-term partnerships with shipping companies</li>
                      <li>• Currency hedging and futures contracts</li>
                      <li>• Data-driven cost prediction platforms</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            {originData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">The Real Competition</h3>
                      <p className="text-sm text-muted-foreground">
                        {originData.countries[0]?.name} leads with {originData.countries[0]?.percentage}% of mentions, 
                        but this shows consumers compare countries, not brands. We need to differentiate New Zealand from Australia and the US.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Our Opportunity</h3>
                      <p className="text-sm text-muted-foreground">
                        With {originData.unique_countries} countries competing, we can stand out by emphasizing our "100% grass-fed" advantage and building trust through transparency.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
        {/* Data Source Information */}
        <section className="mb-8">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                  ℹ️
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">Data Source & Methodology</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      This analysis is based on posts and comments from Xiaohongshu/RedNote (小红书) discussing "imported beef" (进口牛肉). The original data is in Chinese, and I uesd Google Translate API to translate it to English, it may cause some potential translation errors/confusions.
                      Due to platform restrictions requiring login for search functionality, the data collection was performed using an account registered in New Zealand.
                    </p>
                    <p className="text-amber-600 dark:text-amber-400">
                      <strong>Note:</strong> The New Zealand-based account may have resulted in a higher proportion of Oceania-related content appearing in search results, 
                      potentially introducing geographical bias in the data distribution.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

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
