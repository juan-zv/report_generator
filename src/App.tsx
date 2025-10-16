// import { useState } from 'react'
import './App.css'

import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Car } from 'lucide-react'


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <Card>
        <CardHeader>
          <CardTitle>Sales Report Generator</CardTitle>
          <CardDescription>
            Generate sales reports from Keystone data
          </CardDescription>
          <Button variant={"outline"} size={"lg"}>Generate Report</Button>
        </CardHeader>
        <CardContent>
          {/* Your content goes here
           TABLE with sales data
           Headers: Date, Product, Quantity, Price, Total
                      */}
        </CardContent>
        <CardFooter>
          <CardDescription className="flex items-center">
            <Car className="mr-2 h-4 w-4" />
            v0.1.0
          </CardDescription>
        </CardFooter>
      </Card>
    </ThemeProvider>
  )
}

export default App
