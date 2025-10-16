import { useState } from 'react'
import './App.css'

import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { ChartNoAxesCombined } from 'lucide-react';
import { DataTable } from '@/table/data-table'

import { columns, type Sale } from '@/table/columns'
import { columns as totalColumns, type TotalSales } from '@/table/totals'

import supabase from '@/utils/supabase';

const cogs = [
  { product: 'tshirt', cogs: 8.48 },
  { product: 'hoodie', cogs: 19.05 }
] as const

async function getData(): Promise<Sale[]> {
  // Fetch data from your API here.
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

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

function App() {
  const [data, setData] = useState<Sale[]>([]);
  const [totals, setTotals] = useState<TotalSales | null>(null);
  const [loading, setLoading] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleGenerateReport = async () => {
    setLoading(true);
    const apiData = await getData();
    const newData = apiData.map(sale => ({
      ...sale,
      cogs: cogs.find(c => c.product === sale.product_type)?.cogs ?? 0
    }));
    setData(newData);

    // Calculate totals
    const totalTshirts = newData.filter(sale => sale.product_type === 'tshirt').length;
    const totalHoodies = newData.filter(sale => sale.product_type === 'hoodie').length;
    const totalCogs = newData.reduce((sum, sale) => sum + sale.cogs, 0);
    const totalRevenue = newData.reduce((sum, sale) => sum + sale.price, 0);
    const totalCard = newData.filter(sale => sale.payment_method === 'card').length;
    const totalCash = newData.filter(sale => sale.payment_method === 'cash').length;
  
    // Set totals state
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
          <CardTitle>Sales Report Generator</CardTitle>
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
          <CardTitle className="text-justify">For {today}:</CardTitle>
          <DataTable columns={columns} data={data} />
          <DataTable columns={totalColumns} data={totals ? [totals] : []} />
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
