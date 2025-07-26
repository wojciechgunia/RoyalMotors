export interface LaravelResponseCollection<T> {
  data: T[]
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
  path: string
  first_page_url: string | null
  last_page_url: string | null
  next_page_url: string | null
  prev_page_url: string | null
}
