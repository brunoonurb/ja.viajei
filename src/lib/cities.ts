/**
 * Lista de cidades principais por país para sugestões
 */

export interface City {
  name: string
  nameEn: string
  country: string
  countryCode: string
}

export const cities: City[] = [
  // França
  { name: 'Paris', nameEn: 'Paris', country: 'França', countryCode: 'FR' },
  { name: 'Lyon', nameEn: 'Lyon', country: 'França', countryCode: 'FR' },
  { name: 'Marseille', nameEn: 'Marseille', country: 'França', countryCode: 'FR' },
  { name: 'Nice', nameEn: 'Nice', country: 'França', countryCode: 'FR' },
  { name: 'Toulouse', nameEn: 'Toulouse', country: 'França', countryCode: 'FR' },
  { name: 'Bordeaux', nameEn: 'Bordeaux', country: 'França', countryCode: 'FR' },
  { name: 'Estrasburgo', nameEn: 'Strasbourg', country: 'França', countryCode: 'FR' },
  { name: 'Lille', nameEn: 'Lille', country: 'França', countryCode: 'FR' },

  // Alemanha
  { name: 'Berlim', nameEn: 'Berlin', country: 'Alemanha', countryCode: 'DE' },
  { name: 'Hamburgo', nameEn: 'Hamburg', country: 'Alemanha', countryCode: 'DE' },
  { name: 'Munique', nameEn: 'Munich', country: 'Alemanha', countryCode: 'DE' },
  { name: 'Colônia', nameEn: 'Cologne', country: 'Alemanha', countryCode: 'DE' },
  { name: 'Frankfurt', nameEn: 'Frankfurt', country: 'Alemanha', countryCode: 'DE' },
  { name: 'Stuttgart', nameEn: 'Stuttgart', country: 'Alemanha', countryCode: 'DE' },
  { name: 'Düsseldorf', nameEn: 'Düsseldorf', country: 'Alemanha', countryCode: 'DE' },
  { name: 'Dresden', nameEn: 'Dresden', country: 'Alemanha', countryCode: 'DE' },

  // Itália
  { name: 'Roma', nameEn: 'Rome', country: 'Itália', countryCode: 'IT' },
  { name: 'Milão', nameEn: 'Milan', country: 'Itália', countryCode: 'IT' },
  { name: 'Nápoles', nameEn: 'Naples', country: 'Itália', countryCode: 'IT' },
  { name: 'Turim', nameEn: 'Turin', country: 'Itália', countryCode: 'IT' },
  { name: 'Palermo', nameEn: 'Palermo', country: 'Itália', countryCode: 'IT' },
  { name: 'Gênova', nameEn: 'Genoa', country: 'Itália', countryCode: 'IT' },
  { name: 'Bolonha', nameEn: 'Bologna', country: 'Itália', countryCode: 'IT' },
  { name: 'Florença', nameEn: 'Florence', country: 'Itália', countryCode: 'IT' },
  { name: 'Veneza', nameEn: 'Venice', country: 'Itália', countryCode: 'IT' },
  { name: 'Pisa', nameEn: 'Pisa', country: 'Itália', countryCode: 'IT' },
  { name: 'Ravena', nameEn: 'Ravenna', country: 'Itália', countryCode: 'IT' },
  { name: 'Montepulciano', nameEn: 'Montepulciano', country: 'Itália', countryCode: 'IT' },

  // Reino Unido
  { name: 'Londres', nameEn: 'London', country: 'Reino Unido', countryCode: 'GB' },
  { name: 'Manchester', nameEn: 'Manchester', country: 'Reino Unido', countryCode: 'GB' },
  { name: 'Birmingham', nameEn: 'Birmingham', country: 'Reino Unido', countryCode: 'GB' },
  { name: 'Liverpool', nameEn: 'Liverpool', country: 'Reino Unido', countryCode: 'GB' },
  { name: 'Leeds', nameEn: 'Leeds', country: 'Reino Unido', countryCode: 'GB' },
  { name: 'Sheffield', nameEn: 'Sheffield', country: 'Reino Unido', countryCode: 'GB' },
  { name: 'Edimburgo', nameEn: 'Edinburgh', country: 'Reino Unido', countryCode: 'GB' },
  { name: 'Glasgow', nameEn: 'Glasgow', country: 'Reino Unido', countryCode: 'GB' },
  { name: 'Cardiff', nameEn: 'Cardiff', country: 'Reino Unido', countryCode: 'GB' },
  { name: 'Belfast', nameEn: 'Belfast', country: 'Reino Unido', countryCode: 'GB' },

  // Espanha
  { name: 'Madrid', nameEn: 'Madrid', country: 'Espanha', countryCode: 'ES' },
  { name: 'Barcelona', nameEn: 'Barcelona', country: 'Espanha', countryCode: 'ES' },
  { name: 'Valência', nameEn: 'Valencia', country: 'Espanha', countryCode: 'ES' },
  { name: 'Sevilha', nameEn: 'Seville', country: 'Espanha', countryCode: 'ES' },
  { name: 'Bilbao', nameEn: 'Bilbao', country: 'Espanha', countryCode: 'ES' },
  { name: 'Málaga', nameEn: 'Malaga', country: 'Espanha', countryCode: 'ES' },

  // Holanda
  { name: 'Amsterdã', nameEn: 'Amsterdam', country: 'Holanda', countryCode: 'NL' },
  { name: 'Rotterdam', nameEn: 'Rotterdam', country: 'Holanda', countryCode: 'NL' },
  { name: 'Haia', nameEn: 'The Hague', country: 'Holanda', countryCode: 'NL' },
  { name: 'Utrecht', nameEn: 'Utrecht', country: 'Holanda', countryCode: 'NL' },

  // Bélgica
  { name: 'Bruxelas', nameEn: 'Brussels', country: 'Bélgica', countryCode: 'BE' },
  { name: 'Antuérpia', nameEn: 'Antwerp', country: 'Bélgica', countryCode: 'BE' },
  { name: 'Gante', nameEn: 'Ghent', country: 'Bélgica', countryCode: 'BE' },
  { name: 'Bruges', nameEn: 'Bruges', country: 'Bélgica', countryCode: 'BE' },

  // Suíça
  { name: 'Zurique', nameEn: 'Zurich', country: 'Suíça', countryCode: 'CH' },
  { name: 'Genebra', nameEn: 'Geneva', country: 'Suíça', countryCode: 'CH' },
  { name: 'Basileia', nameEn: 'Basel', country: 'Suíça', countryCode: 'CH' },
  { name: 'Lugano', nameEn: 'Lugano', country: 'Suíça', countryCode: 'CH' },
  { name: 'Bern', nameEn: 'Bern', country: 'Suíça', countryCode: 'CH' },

  // Áustria
  { name: 'Viena', nameEn: 'Vienna', country: 'Áustria', countryCode: 'AT' },
  { name: 'Graz', nameEn: 'Graz', country: 'Áustria', countryCode: 'AT' },
  { name: 'Linz', nameEn: 'Linz', country: 'Áustria', countryCode: 'AT' },
  { name: 'Salzburg', nameEn: 'Salzburg', country: 'Áustria', countryCode: 'AT' },

  // República Tcheca
  { name: 'Praga', nameEn: 'Prague', country: 'República Tcheca', countryCode: 'CZ' },
  { name: 'Brno', nameEn: 'Brno', country: 'República Tcheca', countryCode: 'CZ' },
  { name: 'Ostrava', nameEn: 'Ostrava', country: 'República Tcheca', countryCode: 'CZ' },

  // Polônia
  { name: 'Varsóvia', nameEn: 'Warsaw', country: 'Polônia', countryCode: 'PL' },
  { name: 'Cracóvia', nameEn: 'Krakow', country: 'Polônia', countryCode: 'PL' },
  { name: 'Gdansk', nameEn: 'Gdansk', country: 'Polônia', countryCode: 'PL' },
  { name: 'Wroclaw', nameEn: 'Wroclaw', country: 'Polônia', countryCode: 'PL' },
  { name: 'Zary', nameEn: 'Zary', country: 'Polônia', countryCode: 'PL' },

  // Eslováquia
  { name: 'Bratislava', nameEn: 'Bratislava', country: 'Eslováquia', countryCode: 'SK' },
  { name: 'Kosice', nameEn: 'Kosice', country: 'Eslováquia', countryCode: 'SK' },

  // Hungria
  { name: 'Budapeste', nameEn: 'Budapest', country: 'Hungria', countryCode: 'HU' },
  { name: 'Debrecen', nameEn: 'Debrecen', country: 'Hungria', countryCode: 'HU' },
  { name: 'Szombathely', nameEn: 'Szombathely', country: 'Hungria', countryCode: 'HU' },

  // Croácia
  { name: 'Zagreb', nameEn: 'Zagreb', country: 'Croácia', countryCode: 'HR' },
  { name: 'Split', nameEn: 'Split', country: 'Croácia', countryCode: 'HR' },
  { name: 'Dubrovnik', nameEn: 'Dubrovnik', country: 'Croácia', countryCode: 'HR' },

  // Eslovênia
  { name: 'Liubliana', nameEn: 'Ljubljana', country: 'Eslovênia', countryCode: 'SI' },
  { name: 'Maribor', nameEn: 'Maribor', country: 'Eslovênia', countryCode: 'SI' },

  // Dinamarca
  { name: 'Copenhague', nameEn: 'Copenhagen', country: 'Dinamarca', countryCode: 'DK' },
  { name: 'Aarhus', nameEn: 'Aarhus', country: 'Dinamarca', countryCode: 'DK' },
  { name: 'Sønderborg', nameEn: 'Sønderborg', country: 'Dinamarca', countryCode: 'DK' },

  // Luxemburgo
  { name: 'Luxemburgo', nameEn: 'Luxembourg', country: 'Luxemburgo', countryCode: 'LU' },

  // Mônaco
  { name: 'Monaco', nameEn: 'Monaco', country: 'Mônaco', countryCode: 'MC' },

  // Brasil
  { name: 'São Paulo', nameEn: 'São Paulo', country: 'Brasil', countryCode: 'BR' },
  { name: 'Rio de Janeiro', nameEn: 'Rio de Janeiro', country: 'Brasil', countryCode: 'BR' },
  { name: 'Brasília', nameEn: 'Brasília', country: 'Brasil', countryCode: 'BR' },
  { name: 'Salvador', nameEn: 'Salvador', country: 'Brasil', countryCode: 'BR' },
  { name: 'Fortaleza', nameEn: 'Fortaleza', country: 'Brasil', countryCode: 'BR' },
  { name: 'Belo Horizonte', nameEn: 'Belo Horizonte', country: 'Brasil', countryCode: 'BR' },
  { name: 'Manaus', nameEn: 'Manaus', country: 'Brasil', countryCode: 'BR' },
  { name: 'Curitiba', nameEn: 'Curitiba', country: 'Brasil', countryCode: 'BR' },
]

/**
 * Busca cidades que correspondem ao termo de busca e país
 */
export function searchCities(query: string, country?: string): City[] {
  if (!query || query.length < 1) {
    // Se não há query, retorna cidades do país especificado ou primeiras 10
    if (country) {
      return cities.filter(city => city.country === country).slice(0, 10)
    }
    return cities.slice(0, 10)
  }

  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  let filteredCities = cities.filter(city => {
    const normalizedName = city.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const normalizedNameEn = city.nameEn.toLowerCase()
    
    return normalizedName.includes(normalizedQuery) || 
           normalizedNameEn.includes(normalizedQuery)
  })

  // Se um país foi especificado, filtra por país também
  if (country) {
    filteredCities = filteredCities.filter(city => city.country === country)
  }

  return filteredCities.slice(0, 10) // Limita a 10 resultados
}

/**
 * Obtém uma cidade pelo nome e país
 */
export function getCityByNameAndCountry(name: string, country: string): City | undefined {
  return cities.find(city => 
    city.name.toLowerCase() === name.toLowerCase() &&
    city.country.toLowerCase() === country.toLowerCase()
  )
}

/**
 * Obtém todas as cidades de um país
 */
export function getCitiesByCountry(country: string): City[] {
  return cities.filter(city => city.country === country)
}