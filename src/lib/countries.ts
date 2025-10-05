/**
 * Lista de países com nomes em português e inglês para sugestões
 */

export interface Country {
  name: string
  nameEn: string
  code: string
}

export const countries: Country[] = [
  { name: 'Alemanha', nameEn: 'Germany', code: 'DE' },
  { name: 'Áustria', nameEn: 'Austria', code: 'AT' },
  { name: 'Bélgica', nameEn: 'Belgium', code: 'BE' },
  { name: 'Brasil', nameEn: 'Brazil', code: 'BR' },
  { name: 'Bulgária', nameEn: 'Bulgaria', code: 'BG' },
  { name: 'Croácia', nameEn: 'Croatia', code: 'HR' },
  { name: 'Dinamarca', nameEn: 'Denmark', code: 'DK' },
  { name: 'Eslováquia', nameEn: 'Slovakia', code: 'SK' },
  { name: 'Eslovênia', nameEn: 'Slovenia', code: 'SI' },
  { name: 'Espanha', nameEn: 'Spain', code: 'ES' },
  { name: 'Estônia', nameEn: 'Estonia', code: 'EE' },
  { name: 'Finlândia', nameEn: 'Finland', code: 'FI' },
  { name: 'França', nameEn: 'France', code: 'FR' },
  { name: 'Grécia', nameEn: 'Greece', code: 'GR' },
  { name: 'Holanda', nameEn: 'Netherlands', code: 'NL' },
  { name: 'Hungria', nameEn: 'Hungary', code: 'HU' },
  { name: 'Irlanda', nameEn: 'Ireland', code: 'IE' },
  { name: 'Itália', nameEn: 'Italy', code: 'IT' },
  { name: 'Letônia', nameEn: 'Latvia', code: 'LV' },
  { name: 'Lituânia', nameEn: 'Lithuania', code: 'LT' },
  { name: 'Luxemburgo', nameEn: 'Luxembourg', code: 'LU' },
  { name: 'Malta', nameEn: 'Malta', code: 'MT' },
  { name: 'Mônaco', nameEn: 'Monaco', code: 'MC' },
  { name: 'Noruega', nameEn: 'Norway', code: 'NO' },
  { name: 'Polônia', nameEn: 'Poland', code: 'PL' },
  { name: 'Portugal', nameEn: 'Portugal', code: 'PT' },
  { name: 'República Tcheca', nameEn: 'Czech Republic', code: 'CZ' },
  { name: 'Romênia', nameEn: 'Romania', code: 'RO' },
  { name: 'Reino Unido', nameEn: 'United Kingdom', code: 'GB' },
  { name: 'Suécia', nameEn: 'Sweden', code: 'SE' },
  { name: 'Suíça', nameEn: 'Switzerland', code: 'CH' },
  { name: 'Turquia', nameEn: 'Turkey', code: 'TR' },
  { name: 'Ucrânia', nameEn: 'Ukraine', code: 'UA' },
  { name: 'Vaticano', nameEn: 'Vatican City', code: 'VA' },
  
  // Países fora da Europa também
  { name: 'Argentina', nameEn: 'Argentina', code: 'AR' },
  { name: 'Austrália', nameEn: 'Australia', code: 'AU' },
  { name: 'Canadá', nameEn: 'Canada', code: 'CA' },
  { name: 'Chile', nameEn: 'Chile', code: 'CL' },
  { name: 'China', nameEn: 'China', code: 'CN' },
  { name: 'Colômbia', nameEn: 'Colombia', code: 'CO' },
  { name: 'Cuba', nameEn: 'Cuba', code: 'CU' },
  { name: 'Egito', nameEn: 'Egypt', code: 'EG' },
  { name: 'Estados Unidos', nameEn: 'United States', code: 'US' },
  { name: 'Índia', nameEn: 'India', code: 'IN' },
  { name: 'Japão', nameEn: 'Japan', code: 'JP' },
  { name: 'México', nameEn: 'Mexico', code: 'MX' },
  { name: 'Peru', nameEn: 'Peru', code: 'PE' },
  { name: 'Rússia', nameEn: 'Russia', code: 'RU' },
  { name: 'Uruguai', nameEn: 'Uruguay', code: 'UY' },
]

/**
 * Busca países que correspondem ao termo de busca
 */
export function searchCountries(query: string): Country[] {
  if (!query || query.length < 1) {
    return countries.slice(0, 10) // Mostra os primeiros 10 por padrão
  }

  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  return countries.filter(country => {
    const normalizedName = country.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const normalizedNameEn = country.nameEn.toLowerCase()
    
    return normalizedName.includes(normalizedQuery) || 
           normalizedNameEn.includes(normalizedQuery)
  }).slice(0, 10) // Limita a 10 resultados
}

/**
 * Obtém um país pelo nome
 */
export function getCountryByName(name: string): Country | undefined {
  return countries.find(country => 
    country.name.toLowerCase() === name.toLowerCase() ||
    country.nameEn.toLowerCase() === name.toLowerCase()
  )
}