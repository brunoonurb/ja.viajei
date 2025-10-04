// Serviço de geocodificação usando OpenStreetMap Nominatim API
// Gratuito e sem necessidade de chave API

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    state?: string;
    county?: string;
  };
}

export interface GeocodingError {
  error: string;
  message: string;
}

// Cache simples para evitar requisições desnecessárias
const geocodingCache = new Map<string, GeocodingResult>();

export async function geocodeAddress(address: string): Promise<GeocodingResult | GeocodingError> {
  // Limpar e normalizar o endereço
  const cleanAddress = address.trim();
  
  if (!cleanAddress) {
    return {
      error: 'INVALID_ADDRESS',
      message: 'Endereço não pode estar vazio'
    };
  }

  // Verificar cache primeiro
  const cached = geocodingCache.get(cleanAddress);
  if (cached) {
    return cached;
  }

  try {
    // Construir URL para Nominatim API
    const encodedAddress = encodeURIComponent(cleanAddress);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Viagem-Europeia-App/1.0', // Nominatim requer User-Agent
      },
    });

    if (!response.ok) {
      return {
        error: 'API_ERROR',
        message: `Erro na API de geocodificação: ${response.status}`
      };
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return {
        error: 'NOT_FOUND',
        message: 'Endereço não encontrado'
      };
    }

    const result = data[0];
    
    const geocodingResult: GeocodingResult = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
      address: {
        city: result.address?.city || result.address?.town || result.address?.village,
        country: result.address?.country,
        state: result.address?.state,
        county: result.address?.county,
      }
    };

    // Salvar no cache
    geocodingCache.set(cleanAddress, geocodingResult);

    return geocodingResult;

  } catch (error) {
    console.error('Erro na geocodificação:', error);
    return {
      error: 'NETWORK_ERROR',
      message: 'Erro de conexão. Verifique sua internet e tente novamente.'
    };
  }
}

// Função para buscar coordenadas de uma cidade específica
export async function geocodeCity(city: string, country?: string): Promise<GeocodingResult | GeocodingError> {
  const searchQuery = country ? `${city}, ${country}` : city;
  return geocodeAddress(searchQuery);
}

// Função para verificar se um endereço é válido
export function isValidAddress(address: string): boolean {
  const cleanAddress = address.trim();
  return cleanAddress.length >= 3 && cleanAddress.length <= 200;
}

// Função para formatar endereço para exibição
export function formatAddress(geocodingResult: GeocodingResult): string {
  const { address } = geocodingResult;
  const parts = [];
  
  if (address.city) parts.push(address.city);
  if (address.county && address.county !== address.city) parts.push(address.county);
  if (address.state && address.state !== address.county) parts.push(address.state);
  if (address.country) parts.push(address.country);
  
  return parts.join(', ');
}