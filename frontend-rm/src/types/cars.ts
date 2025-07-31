export type Manufacturer = {
  code: string
  name: string
  logo_url: string
}

export type Car = {
  uuid: string
  model: string
  year_of_manufacture: string
  version: string
  type_of_vehicle: string
  color: string
  engine: string
  power: string
  transmission: string
  fuel: string
  number_of_doors: string
  number_of_seats: string
  other_info: string
  image_url: string
  '3d_model_url': string
  min_price: string
  manufacturer: Manufacturer | null
}
