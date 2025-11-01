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
import { SellerStats, type SellerStat } from '@/components/seller-stats'

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

const SELLERS = [
  "Juan", "Lydia", "Corbyn", "Hailee", "Joseph", "Jason", "Anabella",
  "Cortland", "Diego", "Ally", "Kayla", "Makall", "Michael", "Price",
  "Katie", "Carter", "Jessica"
] as const;

function App() {
  const [data, setData] = useState<Sale[]>([]);
  const [totals, setTotals] = useState<TotalSales | null>(null);
  const [weeklyTotals, setWeeklyTotals] = useState<WeeklyTotals[]>([]);
  const [sellerStats, setSellerStats] = useState<SellerStat[]>([]);
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

    // IBC Financial Week starts on Oct 12, 2024 (Saturday) and runs for 7 days (Sat-Fri)
    const firstWeekStart = new Date('2024-10-12T00:00:00');
    const weekLengthMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    // Group sales by IBC Financial Week
    const financialWeekGroups = new Map<number, Sale[]>();
    
    allData.forEach(sale => {
      const saleDate = new Date(sale.date);
      
      // Calculate which week this sale belongs to
      const timeDiff = saleDate.getTime() - firstWeekStart.getTime();
      const weekNumber = Math.floor(timeDiff / weekLengthMs);
      
      // Only include sales that are on or after the first week start
      if (weekNumber >= 0) {
        if (!financialWeekGroups.has(weekNumber)) {
          financialWeekGroups.set(weekNumber, []);
        }
        financialWeekGroups.get(weekNumber)!.push(sale);
      }
    });

    // Convert to array and calculate totals for each IBC Financial Week
    const financialWeeks: WeeklyTotals[] = Array.from(financialWeekGroups.entries())
      .sort(([a], [b]) => a - b) // Sort by week number
      .map(([weekNumber, sales]) => {
        const weekStart = new Date(firstWeekStart.getTime() + (weekNumber * weekLengthMs));
        const weekEnd = new Date(weekStart.getTime() + weekLengthMs - 1); // End is 6 days 23:59:59 later
        
        const formatShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const weekPeriod = `IBC Week ${weekNumber + 1}: ${formatShort(weekStart)} - ${formatShort(weekEnd)}`;
        
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
          id: `ibc-week-${weekNumber}`,
          weekPeriod,
          tshirts,
          hoodies,
          revenue: revenue.toFixed(2),
        };
      });

    setWeeklyTotals(financialWeeks);
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

    // Calculate seller statistics
    const sellerCounts = new Map<string, number>();
    SELLERS.forEach(seller => sellerCounts.set(seller, 0));
    
    newData.forEach(sale => {
      if (sale.seller && SELLERS.includes(sale.seller as any)) {
        sellerCounts.set(sale.seller, (sellerCounts.get(sale.seller) || 0) + 1);
      }
    });

    const sellerStatsArray: SellerStat[] = Array.from(sellerCounts.entries()).map(([name, count]) => ({
      name,
      count
    }));

    setSellerStats(sellerStatsArray);
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

          <div className="mt-6">
            <SellerStats sellerStats={sellerStats} />
          </div>
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
