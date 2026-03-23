import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { SearchClubV2, SearchEventV2 } from './services/search.service'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get safe image URL from API response, with fallback
 */
export function getSafeImageUrl(url: string | undefined | null, fallback: string = ''): string {
  if (!url) return fallback
  if (typeof url !== 'string') return fallback
  // Filter out placeholder/example URLs
  if (url.includes('example.com') || url.includes('placeholder')) return fallback
  // Check if it's a valid URL (starts with http or /)
  if (url.startsWith('http') || url.startsWith('/')) return url
  return fallback
}

/**
 * Get primary image from club (logo or first image)
 */
export function getClubImageUrl(club: SearchClubV2 | undefined | null, fallback: string = ''): string {
  if (!club) return fallback
  
  const logoUrl = getSafeImageUrl(club.logoUrl, '')
  if (logoUrl) return logoUrl
  
  const firstImage = club.images?.[0]
  if (firstImage) {
    return getSafeImageUrl(firstImage, '')
  }
  
  return fallback
}

/**
 * Get primary image from event
 */
export function getEventImageUrl(event: SearchEventV2 | undefined | null, fallback: string = ''): string {
  if (!event) return fallback
  
  const imageUrl = getSafeImageUrl(event.imageUrl, '')
  if (imageUrl) return imageUrl
  
  const firstImage = event.images?.[0]
  if (firstImage) {
    return getSafeImageUrl(firstImage, '')
  }
  
  return fallback
}

/**
 * Safely truncate text with ellipsis
 */
export function truncateText(text: string | undefined | null, maxLength: number): string {
  if (!text || typeof text !== 'string') return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Get safe location/address from club
 */
export function getClubLocation(club: SearchClubV2 | undefined | null): string {
  if (!club) return 'Location TBD'
  
  if (club.address && typeof club.address === 'string' && club.address.trim()) {
    return club.address
  }
  
  return 'Location TBD'
}

/**
 * Get safe location from event
 */
export function getEventLocation(event: SearchEventV2 | undefined | null): string {
  if (!event) return 'Location TBD'
  
  if (event.location && typeof event.location === 'string' && event.location.trim()) {
    return event.location
  }
  
  if (event.clubName && typeof event.clubName === 'string' && event.clubName.trim()) {
    return event.clubName
  }
  
  return 'Location TBD'
}

/**
 * Safely get event start date
 */
export function getEventDate(event: SearchEventV2 | undefined | null): Date | null {
  if (!event || !event.startDateTime) return null
  try {
    const date = new Date(event.startDateTime)
    if (isNaN(date.getTime())) return null
    return date
  } catch {
    return null
  }
}

/**
 * Format date as Mon DD (e.g., "Mar 15")
 */
export function formatEventDateBadge(date: Date | undefined | null): { month: string; day: string } {
  if (!date) return { month: 'N/A', day: 'N/A' }
  try {
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    const day = date.getDate().toString().padStart(2, '0')
    return { month, day }
  } catch {
    return { month: 'N/A', day: 'N/A' }
  }
}

/**
 * Check if an event is past/expired
 * Uses actual date/time comparison instead of potentially incorrect API flags
 * Compares with current IST (Indian Standard Time) timezone
 */
export function isPastEvent(event: any): boolean {
  if (!event || !event.startDateTime) return false
  
  try {
    const eventDate = new Date(event.startDateTime)
    if (isNaN(eventDate.getTime())) return false
    
    // Get current time in IST (UTC+5:30)
    const utcDate = new Date()
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000))
    
    // Event is past if its start time is before current IST time
    return eventDate < istDate
  } catch {
    return false
  }
}

/**
 * Filter events to only include upcoming (non-expired) events
 */
export function filterUpcomingEvents(events: any[]): any[] {
  if (!Array.isArray(events)) return []
  return events.filter(event => !isPastEvent(event))
}

/**
 * Sort and extract club images with MAIN_IMAGE first
 * Images with type "MAIN_IMAGE" will appear first, followed by other types
 */
export function getSortedClubImages(images: any[] | undefined, fallback: string[] = []): string[] {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return fallback
  }

  // Sort images: MAIN_IMAGE first, then others
  const sorted = [...images].sort((a, b) => {
    const aType = a?.type || ''
    const bType = b?.type || ''
    
    // MAIN_IMAGE comes first
    if (aType === 'MAIN_IMAGE' && bType !== 'MAIN_IMAGE') return -1
    if (aType !== 'MAIN_IMAGE' && bType === 'MAIN_IMAGE') return 1
    
    return 0
  })

  // Extract URLs from sorted images
  const urls = sorted
    .map((img: any) => {
      if (typeof img === 'string') return img
      return img?.url || ''
    })
    .filter(Boolean)

  return urls.length > 0 ? urls : fallback
}
