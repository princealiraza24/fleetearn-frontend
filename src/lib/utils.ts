import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtPKR(amount: number): string {
  return `Rs.${Math.round(amount).toLocaleString('en-PK')}`
}

export function fmtDate(dateStr: string): string {
  return format(new Date(dateStr), 'dd MMM yyyy')
}

export function fmtDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'dd MMM yyyy, hh:mm a')
}

export function fmtRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function calcDailyPct(durationDays: number): number {
  // (2^(1/days) - 1) * 100
  return (Math.pow(2, 1 / durationDays) - 1) * 100
}

export function planVehicleIcon(vehicleType: string): string {
  return vehicleType === 'Bike' ? '🛵' : '🚚'
}

export const PLAN_BRANDS: Record<string, string[]> = {
  'Bike Starter':  ['🍔 Foodpanda', '🚗 Bykea', '🛺 Rider.pk'],
  'Fleet Basic':   ['🛍️ Daraz', '📦 TCS', '🍔 Foodpanda'],
  'Truck Pro':     ['📦 TCS', '🐆 Leopard', '🛍️ Daraz'],
  'Fleet Elite':   ['🐆 Leopard', '📦 TCS', '📮 Pak Post'],
}
