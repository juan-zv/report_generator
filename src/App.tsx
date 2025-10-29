import { useState, useEffect } from 'react'
import './App.css'

import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { ChartNoAxesCombined, CalendarIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { DataTable } from '@/table/data-table'

import { columns, type Sale } from '@/table/columns'
import { columns as totalColumns, type TotalSales } from '@/table/totals'
import { columns as weeklyColumns, type WeeklyTotals } from '@/table/weekly-totals'

import supabase from '@/utils/supabase';

const cogs = [
  // Doubt Not
  { design: "doubt-not", type: "tshirt", size: "small", cogs: 9.40 },
  { design: "doubt-not", type: "tshirt", size: "medium", cogs: 9.20 },
  { design: "doubt-not", type: "tshirt", size: "large", cogs: 9.58 },
  { design: "doubt-not", type: "tshirt", size: "xl", cogs: 9.36 },
  { design: "doubt-not", type: "tshirt", size: "xxl", cogs: 0 },

  { design: "doubt-not", type: "hoodie", size: "small", cogs: 20.55 },
  { design: "doubt-not", type: "hoodie", size: "medium", cogs: 20.55 },
  { design: "doubt-not", type: "hoodie", size: "large", cogs: 20.55 },
  { design: "doubt-not", type: "hoodie", size: "xl", cogs: 20.55 },
  { design: "doubt-not", type: "hoodie", size: "xxl", cogs: 0 },

  // Child of God
  { design: "child-of-god", type: "tshirt", size: "small", cogs: 8.88 },
  { design: "child-of-god", type: "tshirt", size: "medium", cogs: 8.68 },
  { design: "child-of-god", type: "tshirt", size: "large", cogs: 9.06 },
  { design: "child-of-god", type: "tshirt", size: "xl", cogs: 8.84 },
  { design: "child-of-god", type: "tshirt", size: "xxl", cogs: 0 },

  { design: "child-of-god", type: "hoodie", size: "small", cogs: 20.03 },
  { design: "child-of-god", type: "hoodie", size: "medium", cogs: 20.03 },
  { design: "child-of-god", type: "hoodie", size: "large", cogs: 20.03 },
  { design: "child-of-god", type: "hoodie", size: "xl", cogs: 20.03 },
  { design: "child-of-god", type: "hoodie", size: "xxl", cogs: 0 },

  // Line Upon Line
  { design: "line-upon-line", type: "tshirt", size: "small", cogs: 9.54 },
  { design: "line-upon-line", type: "tshirt", size: "medium", cogs: 9.34 },
  { design: "line-upon-line", type: "tshirt", size: "large", cogs: 9.72 },
  { design: "line-upon-line", type: "tshirt", size: "xl", cogs: 9.50 },
  { design: "line-upon-line", type: "tshirt", size: "xxl", cogs: 0 },

  { design: "line-upon-line", type: "hoodie", size: "small", cogs: 20.69 },
  { design: "line-upon-line", type: "hoodie", size: "medium", cogs: 20.69 },
  { design: "line-upon-line", type: "hoodie", size: "large", cogs: 20.69 },
  { design: "line-upon-line", type: "hoodie", size: "xl", cogs: 20.69 },
  { design: "line-upon-line", type: "hoodie", size: "xxl", cogs: 0 },

  // Hands of God
  { design: "hands-of-god", type: "tshirt", size: "small", cogs: 9.40 },
  { design: "hands-of-god", type: "tshirt", size: "medium", cogs: 9.20 },
  { design: "hands-of-god", type: "tshirt", size: "large", cogs: 9.58 },
  { design: "hands-of-god", type: "tshirt", size: "xl", cogs: 9.36 },
  { design: "hands-of-god", type: "tshirt", size: "xxl", cogs: 0 },

  { design: "hands-of-god", type: "hoodie", size: "small", cogs: 20.55 },
  { design: "hands-of-god", type: "hoodie", size: "medium", cogs: 20.55 },
  { design: "hands-of-god", type: "hoodie", size: "large", cogs: 20.55 },
  { design: "hands-of-god", type: "hoodie", size: "xl", cogs: 20.55 },
  { design: "hands-of-god", type: "hoodie", size: "xxl", cogs: 0 },

  // Endure to the End
  { design: "endure-to-the-end", type: "tshirt", size: "small", cogs: 9.27 },
  { design: "endure-to-the-end", type: "tshirt", size: "medium", cogs: 9.07 },
  { design: "endure-to-the-end", type: "tshirt", size: "large", cogs: 9.45 },
  { design: "endure-to-the-end", type: "tshirt", size: "xl", cogs: 9.23 },
  { design: "endure-to-the-end", type: "tshirt", size: "xxl", cogs: 0 },

  { design: "endure-to-the-end", type: "hoodie", size: "small", cogs: 20.42 },
  { design: "endure-to-the-end", type: "hoodie", size: "medium", cogs: 20.42 },
  { design: "endure-to-the-end", type: "hoodie", size: "large", cogs: 20.42 },
  { design: "endure-to-the-end", type: "hoodie", size: "xl", cogs: 20.42 },
  { design: "endure-to-the-end", type: "hoodie", size: "xxl", cogs: 0 },

  // Look to God
  { design: "look-to-god", type: "tshirt", size: "small", cogs: 9.38 },
  { design: "look-to-god", type: "tshirt", size: "medium", cogs: 9.18 },
  { design: "look-to-god", type: "tshirt", size: "large", cogs: 9.56 },
  { design: "look-to-god", type: "tshirt", size: "xl", cogs: 9.34 },
  { design: "look-to-god", type: "tshirt", size: "xxl", cogs: 0 },

  { design: "look-to-god", type: "hoodie", size: "small", cogs: 20.53 },
  { design: "look-to-god", type: "hoodie", size: "medium", cogs: 20.53 },
  { design: "look-to-god", type: "hoodie", size: "large", cogs: 20.53 },
  { design: "look-to-god", type: "hoodie", size: "xl", cogs: 20.53 },
  { design: "look-to-god", type: "hoodie", size: "xxl", cogs: 0 },

  // Death Has No Sting
  { design: "death-has-no-sting", type: "tshirt", size: "small", cogs: 9.54 },
  { design: "death-has-no-sting", type: "tshirt", size: "medium", cogs: 9.34 },
  { design: "death-has-no-sting", type: "tshirt", size: "large", cogs: 9.72 },
  { design: "death-has-no-sting", type: "tshirt", size: "xl", cogs: 9.50 },
  { design: "death-has-no-sting", type: "tshirt", size: "xxl", cogs: 0 },

  { design: "death-has-no-sting", type: "hoodie", size: "small", cogs: 20.69 },
  { design: "death-has-no-sting", type: "hoodie", size: "medium", cogs: 20.69 },
  { design: "death-has-no-sting", type: "hoodie", size: "large", cogs: 20.69 },
  { design: "death-has-no-sting", type: "hoodie", size: "xl", cogs: 20.69 },
  { design: "death-has-no-sting", type: "hoodie", size: "xxl", cogs: 0 },
] as const

async function getData(targetDate: Date): Promise<Sale[]> {
  // Fetch data from your API here.
  const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).toISOString();
  const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1).toISOString();

  const { data, error } = await supabase
    .from('Sales')
    .select('*')
    .gte('date', startOfDay)
    .lt('date', endOfDay);

  if (error) {
    console.error('Error fetching sales data:', error);
    return [];
  }
  return data as Sale[];
}

async function getAllWeeklyData(): Promise<Sale[]> {
  // Get all sales data from the database
  const { data, error } = await supabase
    .from('Sales')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching all sales data:', error);
    return [];
  }
  return data as Sale[];
}

function App() {
  const [data, setData] = useState<Sale[]>([]);
  const [totals, setTotals] = useState<TotalSales | null>(null);
  const [weeklyTotals, setWeeklyTotals] = useState<WeeklyTotals[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const loadWeeklyTotals = async () => {
    const allData = await getAllWeeklyData();
    
    if (allData.length === 0) {
      setWeeklyTotals([]);
      return;
    }

    // Group sales by week (Monday to Sunday)
    const weeklyGroups = new Map<string, Sale[]>();
    
    allData.forEach(sale => {
      const saleDate = new Date(sale.date);
      // Get Monday of the week (ISO week starts on Monday)
      const dayOfWeek = saleDate.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days, otherwise go to Monday
      const monday = new Date(saleDate);
      monday.setDate(saleDate.getDate() + diff);
      monday.setHours(0, 0, 0, 0);
      
      const weekKey = monday.toISOString().split('T')[0]; // Use Monday's date as key
      
      if (!weeklyGroups.has(weekKey)) {
        weeklyGroups.set(weekKey, []);
      }
      weeklyGroups.get(weekKey)!.push(sale);
    });

    // Convert to array and calculate totals for each week
    const weeklyTotalsArray: WeeklyTotals[] = Array.from(weeklyGroups.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()) // Sort by oldest first (most recent at bottom)
      .map(([weekKey, sales], index) => {
        const monday = new Date(weekKey);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        const formatShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const weekPeriod = `${formatShort(monday)} - ${formatShort(sunday)}`;
        
        const salesWithCogs = sales.map(sale => ({
          ...sale,
          cogs: cogs.find(c => 
            c.design === sale.design && 
            c.type === sale.product_type && 
            c.size === sale.size
          )?.cogs ?? 0
        }));
        
        const tshirts = salesWithCogs.filter(sale => sale.product_type === 'tshirt').length;
        const hoodies = salesWithCogs.filter(sale => sale.product_type === 'hoodie').length;
        const revenue = salesWithCogs.reduce((sum, sale) => sum + sale.price, 0);
        
        return {
          id: `week-${index}`,
          weekPeriod,
          tshirts,
          hoodies,
          revenue: revenue.toFixed(2),
        };
      });

    setWeeklyTotals(weeklyTotalsArray);
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    const apiData = await getData(selectedDate);
    const newData = apiData.map(sale => ({
      ...sale,
      cogs: cogs.find(c => 
        c.design === sale.design && 
        c.type === sale.product_type && 
        c.size === sale.size
      )?.cogs ?? 0
    }));
    setData(newData);

    // Calculate daily totals
    const totalTshirts = newData.filter(sale => sale.product_type === 'tshirt').length;
    const totalHoodies = newData.filter(sale => sale.product_type === 'hoodie').length;
    const totalCogs = newData.reduce((sum, sale) => sum + sale.cogs, 0);
    const totalRevenue = newData.reduce((sum, sale) => sum + sale.price, 0);
    const totalCard = newData.filter(sale => sale.payment_method === 'card').length;
    const totalCash = newData.filter(sale => sale.payment_method === 'cash').length;
  
    // Set daily totals state
    setTotals({
      id: 'totals',
      tshirts: totalTshirts.toString(),
      hoodies: totalHoodies.toString(),
      cogs: totalCogs.toFixed(2),
      revenue: totalRevenue.toFixed(2),
      card: totalCard,
      cash: totalCash,
    });

    setLoading(false);
  }

  useEffect(() => {
    loadWeeklyTotals();
    handleGenerateReport();
  }, [selectedDate]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <Card className="my-1.5 p-4 w-full mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Sales Report Generator
            <DropdownMenu open={calendarOpen} onOpenChange={setCalendarOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                  initialFocus
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          <CardDescription>
            Generate sales reports from Keystone database with a single click!
            <br />
            NOTE: It is under development, so please be patient with any bugs or issues.
            <br />
            Thank you for your understanding and support!
          </CardDescription>
        </CardHeader>
        <CardContent className={`space-y-3 ${loading ? 'opacity-50' : ''}`}>
          <CardTitle className="text-justify">For {formatDate(selectedDate)}:</CardTitle>
          <DataTable columns={columns} data={data} />
          <DataTable columns={totalColumns} data={totals ? [totals] : []} />
          
          <CardTitle className="text-justify mt-6">Weekly Totals:</CardTitle>
          <DataTable columns={weeklyColumns} data={weeklyTotals} />
        </CardContent>
        <CardFooter>
          <CardDescription className="flex items-center">
            <ChartNoAxesCombined className="mr-2 h-4 w-4" />
            v0.1.0 | Made by Juansito with a LOT of love ❤️ ©2025
          </CardDescription>
        </CardFooter>
      </Card>
    </ThemeProvider>
  )
}

export default App
