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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from '@/table/data-table'

import { columns, type Sale } from '@/table/columns'
import { columns as totalColumns, type TotalSales } from '@/table/totals'
import { columns as weeklyColumns, type WeeklyTotals } from '@/table/weekly-totals'

import supabase from '@/utils/supabase';

const cogs = [
  { product: 'tshirt', cogs: 8.48 },
  { product: 'hoodie', cogs: 19.05 }
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
  
  // Generate last 5 days
  const last5Days = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  });

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
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) // Sort by most recent first
      .map(([weekKey, sales], index) => {
        const monday = new Date(weekKey);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        const formatShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const weekPeriod = `${formatShort(monday)} - ${formatShort(sunday)}`;
        
        const salesWithCogs = sales.map(sale => ({
          ...sale,
          cogs: cogs.find(c => c.product === sale.product_type)?.cogs ?? 0
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

  useEffect(() => {
    loadWeeklyTotals();
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    const apiData = await getData(selectedDate);
    const newData = apiData.map(sale => ({
      ...sale,
      cogs: cogs.find(c => c.product === sale.product_type)?.cogs ?? 0
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
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <Card className="my-1.5 p-4 w-full mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Sales Report Generator
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {last5Days.map((date, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={selectedDate.toDateString() === date.toDateString() ? 'bg-accent' : ''}
                  >
                    {formatDate(date)}
                    {index === 0 && ' (Today)'}
                  </DropdownMenuItem>
                ))}
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
          <Button className="max-w-fit mx-auto" variant={"outline"} size={"lg"} onClick={handleGenerateReport} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
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
