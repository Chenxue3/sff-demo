// Consumer demand analysis types
export interface ConsumerData {
  word: string;
  frequency: number;
  category: 'brand' | 'region' | 'consumption_habit';
  translation?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface ConsumerAnalysisData {
  brands: ConsumerData[];
  regions: ConsumerData[];
  consumptionHabits: ConsumerData[];
  totalWords: number;
  lastUpdated: string;
}

// Beef interactive types
export interface BeefPart {
  id: string;
  name: string;
  englishName: string;
  description: string;
  characteristics: string[];
  nutritionalValue: {
    protein: number;
    fat: number;
    calories: number;
    vitamins: string[];
  };
  cookingMethods: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  purchaseLinks: {
    name: string;
    url: string;
    price?: number;
  }[];
  svgPath: string;
  clickArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Translation types
export interface TranslationData {
  chinese: string;
  english: string;
  confidence: number;
  category?: string;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

// Word cloud types
export interface WordCloudData {
  text: string;
  value: number;
  color?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component props types
export interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

export interface WordCloudProps {
  data: WordCloudData[];
  width: number;
  height: number;
  onWordClick?: (word: string) => void;
}

export interface FrequencyChartProps {
  data: ChartData;
  type: 'bar' | 'pie' | 'line';
  title: string;
}

export interface BeefShapeProps {
  onPartClick: (part: BeefPart) => void;
  selectedPart?: string;
}

export interface BeefPartInfoProps {
  part: BeefPart;
  isVisible: boolean;
  onClose: () => void;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

// Layout types
export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingProps {
  state: LoadingState;
  message?: string;
  error?: string;
}
