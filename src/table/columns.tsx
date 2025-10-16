"use client"

import type { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Sale = {
  id: string
  product_type: string
  color: string
  design: string
  size: string
  cogs: number
  price: number
  payment_method: string
  notes: string
}

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "product_type",
    header: "Type",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "design",
    header: "Design",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "cogs",
    header: "COGS",
    cell: ({ row }) => {
      const amount = row.getValue("cogs") as number
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = row.getValue("price") as number
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return formatted
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
]