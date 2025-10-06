"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { Camera, Plane, Train, Plus, Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";
import "leaflet/dist/leaflet.css";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  city: string;
  country: string;
  imageData: string;
  imageType: string;
  takenAt: string;
  createdAt: string;
}

interface TravelRoute {
  id: string;
  city: string;
  country: string;
  transport: string;
  order: number;
  visited: boolean;
  visitedAt: string | null;
  latitude?: number;
  longitude?: number;
}

interface MapaRealProps {
  routes: TravelRoute[];
  photos: Photo[];
  isAuthenticated: boolean;
  onPhotoUpload: (file: File, city: string) => void;
  onImageClick?: (photo: Photo, photosArray?: Photo[]) => void;
  onOpenUploadModal?: (city: string, country: string) => void;
  onAddCity?: () => void;
}

// Coordenadas reais das cidades
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Brasil: { lat: -14.235, lng: -51.9253 },
  "Reino Unido": { lat: 55.3781, lng: -3.436 },
  Escócia: { lat: 56.4907, lng: -4.2026 },
  Londres: { lat: 51.5074, lng: -0.1278 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  Milão: { lat: 45.4642, lng: 9.19 },
  Lugano: { lat: 46.0101, lng: 8.96 },
  Zurique: { lat: 47.3769, lng: 8.5417 },
  Luxemburgo: { lat: 49.6116, lng: 6.1319 },
  Bruxelas: { lat: 50.8503, lng: 4.3517 },
  Amsterdã: { lat: 52.3676, lng: 4.9041 },
  Sønderborg: { lat: 54.9094, lng: 9.8074 },
  Hamburgo: { lat: 53.5511, lng: 9.9937 },
  Berlim: { lat: 52.52, lng: 13.405 },
  Zary: { lat: 50.0413, lng: 15.36 },
  Praga: { lat: 50.0755, lng: 14.4378 },
  Viena: { lat: 48.2082, lng: 16.3738 },
  Bratislava: { lat: 48.1486, lng: 17.1077 },
  Szombathely: { lat: 47.2307, lng: 16.6218 },
  Zagreb: { lat: 45.815, lng: 15.9819 },
  Liubliana: { lat: 46.0569, lng: 14.5058 },
  Veneza: { lat: 45.4408, lng: 12.3155 },
  Ravena: { lat: 44.4184, lng: 12.2035 },
  Roma: { lat: 41.9028, lng: 12.4964 },
  Montepulciano: { lat: 43.0935, lng: 11.7819 },
  Pisa: { lat: 43.7228, lng: 10.4017 },
  Florença: { lat: 43.7696, lng: 11.2558 },
  Monaco: { lat: 43.7384, lng: 7.4246 },
  Turim: { lat: 45.0703, lng: 7.6869 },
};


const transportColors = {
  plane: "#3b82f6",
  train: "#10b981",
  car: "#8b5cf6",
};

// Criar ícones customizados para os marcadores
const createCustomIcon = (transport: string, visited: boolean) => {
  const bgColor = visited ? "#10b981" : "#6b7280";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${bgColor};
        border: 3px solid white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="color: white; font-size: 12px;">
          ${transport === "plane" ? "✈" : transport === "train" ? "🚂" : "🚐"}
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

// Componente para ajustar a visualização do mapa
function MapController({
  routes,
  onMapReady,
}: {
  routes: TravelRoute[];
  onMapReady?: (map: L.Map) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  useEffect(() => {
    if (Array.isArray(routes) && routes.length > 0) {
      // Usar coordenadas das rotas se disponíveis, senão usar mapeamento estático
      const bounds = routes
        .map((route) => {
          // Priorizar coordenadas do banco de dados
          if (route.latitude && route.longitude) {
            return [route.latitude, route.longitude] as [number, number];
          }
          // Fallback para mapeamento estático
          const staticCoords = cityCoordinates[route.city];
          return staticCoords ? [staticCoords.lat, staticCoords.lng] as [number, number] : null;
        })
        .filter((coord) => coord !== null);

      if (bounds.length > 0) {
        // Se temos coordenadas reais, ajustar o mapa para elas
        if (bounds.length === 1) {
          // Para uma única coordenada, centralizar nela
          map.setView(bounds[0] as [number, number], 8);
        } else {
          // Para múltiplas coordenadas, ajustar bounds
          const boundsArray = bounds as [number, number][];
          map.fitBounds(boundsArray, {
            padding: [30, 30],
            maxZoom: 50,
          });
        }
      } else {
        // Fallback para Europa se não há coordenadas válidas
        const europeBounds = [
          [35.0, -10.0], // Sudoeste (Portugal/Espanha)
          [70.0, 40.0], // Nordeste (Norte da Europa/Rússia)
        ] as [[number, number], [number, number]];

        map.fitBounds(europeBounds, {
          padding: [30, 30],
          maxZoom: 50,
        });
      }
    }
  }, [map, routes]);

  return null;
}

// Componente para as linhas da rota
function RouteLines({ routes }: { routes: TravelRoute[] }) {
  if (!Array.isArray(routes)) return null;
  
  const sortedRoutes = [...routes].sort((a, b) => a.order - b.order);

  const routePoints = sortedRoutes
    .map((route) => {
      // Priorizar coordenadas do banco de dados
      if (route.latitude && route.longitude) {
        return [route.latitude, route.longitude] as [number, number];
      }
      // Fallback para mapeamento estático
      const staticCoords = cityCoordinates[route.city];
      return staticCoords ? [staticCoords.lat, staticCoords.lng] as [number, number] : null;
    })
    .filter((coord) => coord !== null);

  if (routePoints.length < 2) return null;

  return (
    <Polyline
      positions={routePoints as [number, number][]}
      pathOptions={{
        color: "#3b82f6",
        weight: 3,
        opacity: 0.7,
        dashArray: "10, 10",
      }}
    />
  );
}

export default function MapaReal(props: MapaRealProps) {
  const {
    routes,
    photos,
    isAuthenticated,
    onPhotoUpload,
    onImageClick,
    onOpenUploadModal,
    onAddCity,
  } = props;
  const [selectedCity, setSelectedCity] = useState<TravelRoute | null>(null);
  const [cityPhotos, setCityPhotos] = useState<Photo[]>([]);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getCityPhotos = (city: string) => {
    return Array.isArray(photos) ? photos.filter(
      (photo) => photo.city.toLowerCase() === city.toLowerCase()
    ) : [];
  };

  const getCountryPhotos = (country: string) => {
    return Array.isArray(photos) ? photos.filter(
      (photo) => photo.country.toLowerCase() === country.toLowerCase()
    ) : [];
  };

  const handleMapReady = (map: L.Map) => {
    setMapInstance(map);
  };

  const invalidateMapSize = () => {
    if (mapInstance) {
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 100);
    }
  };

  const handleCityClick = (route: TravelRoute) => {
    // Fechar painel lateral se estiver aberto para evitar conflitos
    if (selectedCity) {
      setSelectedCity(null);
      setTimeout(() => {
        setSelectedCity(route);
        setCityPhotos(getCountryPhotos(route.country));
      }, 100);
    } else {
      setSelectedCity(route);
      setCityPhotos(getCountryPhotos(route.country));
    }
  };

  const handleClosePanel = () => {
    setSelectedCity(null);
    // Invalidar tamanho do mapa após fechar o painel
    setTimeout(() => {
      invalidateMapSize();
    }, 300); // Aguarda a animação do painel terminar
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedCity) {
      onPhotoUpload(file, selectedCity.city);
      setShowPhotoUpload(false);
      setTimeout(() => {
        setCityPhotos(getCityPhotos(selectedCity.city));
      }, 1000);
    }
  };

  // Invalidar tamanho do mapa quando o painel lateral é aberto/fechado
  useEffect(() => {
    invalidateMapSize();
  }, [selectedCity]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Invalidar tamanho do mapa após mudança de tela cheia
    setTimeout(() => {
      invalidateMapSize();
    }, 100);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
      setTimeout(() => {
        invalidateMapSize();
      }, 100);
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  // Invalidar tamanho do mapa quando modal de upload é aberto/fechado
  useEffect(() => {
    invalidateMapSize();
  }, [showPhotoUpload]);

  // Listener para redimensionamento da janela
  useEffect(() => {
    const handleResize = () => {
      invalidateMapSize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mapInstance]);

  // Invalidar tamanho do mapa quando as fotos são atualizadas
  useEffect(() => {
    invalidateMapSize();
  }, [photos]);

  // Agrupar cidades por país
  const routesByCountry = Array.isArray(routes) ? routes.reduce((acc, route) => {
    if (!acc[route.country]) {
      acc[route.country] = [];
    }
    acc[route.country].push(route);
    return acc;
  }, {} as Record<string, TravelRoute[]>) : {};

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Mapa Interativo da Europa
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Navegue pelo mapa, clique nos marcadores para ver fotos de cada
              local
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="bg-blue-600 text-white px-3 py-2 md:px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 md:space-x-2 text-sm md:text-base"
              title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              <span className="hidden md:inline">
                {isFullscreen ? "Sair" : "Tela Cheia"}
              </span>
            </button>
            {isAuthenticated && onAddCity && (
              <button
                onClick={onAddCity}
                className="bg-green-600 text-white px-3 py-2 md:px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 md:space-x-2 text-sm md:text-base"
              >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adicionar Cidade</span>
              <span className="sm:hidden">+</span>
            </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Mapa Leaflet */}
        <div className="h-64 md:h-96 w-full">
          <MapContainer
            center={[52.0, -10.0]} // Centro mais ao norte para focar na Europa
            zoom={5} // Zoom inicial menor para mostrar mais da Europa
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
            zoomControl={true}
            minZoom={2}
            maxZoom={50}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController routes={routes} onMapReady={handleMapReady} />

            {/* Linhas da rota */}
            <RouteLines routes={routes} />

            {/* Marcadores das cidades */}
            {Array.isArray(routes) ? routes.map((route) => {
              // Priorizar coordenadas do banco de dados
              let coords = null;
              if (route.latitude && route.longitude) {
                coords = { lat: route.latitude, lng: route.longitude };
              } else {
                // Fallback para mapeamento estático
                coords = cityCoordinates[route.city];
              }
              
              if (!coords) return null;

              const countryPhotosCount = getCountryPhotos(route.country).length;

              return (
                <Marker
                  key={route.id}
                  position={[coords.lat, coords.lng]}
                  icon={createCustomIcon(route.transport, route.visited)}
                  eventHandlers={{
                    click: () => handleCityClick(route),
                  }}
                >
                  <Popup>
                    <div className="p-3 min-w-[250px]">
                      <h3 className="font-bold text-lg mb-1">{route.city}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {route.country}
                      </p>

                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {route.transport === "plane"
                            ? "✈ Avião"
                            : route.transport === "train"
                            ? "🚂 Trem"
                            : "🚐 Motorhome"}
                        </span>
                        {countryPhotosCount > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            📸 {countryPhotosCount} fotos
                          </span>
                        )}
                      </div>

                      {/* Botões de ação no popup */}
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            const countryPhotos = getCountryPhotos(
                              route.country
                            );
                            if (countryPhotos.length > 0) {
                              // Filtrar fotos apenas deste país e abrir o visualizador
                              setCityPhotos(countryPhotos);
                              onImageClick?.(countryPhotos[0], countryPhotos);
                            }
                          }}
                          className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          <Camera className="h-4 w-4" />
                          <span>Ver Fotos ({countryPhotosCount})</span>
                        </button>

                        {isAuthenticated && (
                          <label className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer text-sm font-medium">
                            <Camera className="h-4 w-4" />
                            <span>Adicionar Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onPhotoUpload(file, route.city);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {route.visited && route.visitedAt && (
                        <p className="text-xs text-green-600 mt-2 text-center">
                          ✓ Visitado em{" "}
                          {new Date(route.visitedAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            }) : null}
          </MapContainer>
        </div>

        {/* Painel lateral com detalhes da cidade */}

        {/* Modal de upload de foto */}
        {showPhotoUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">
                Adicionar Foto - {selectedCity?.city}
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legenda da ordem dos países */}
      <div className="p-3 md:p-4 bg-gray-50 border-t border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">
          Ordem da Viagem por País:
        </h4>
        <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
          Clique em um país para ver suas fotos
        </p>
        <div className="flex flex-wrap gap-1">
          {Object.entries(routesByCountry).map(([country, countryRoutes]) => {
            const countryPhotosCount = getCountryPhotos(country).length;
            return (
              <div
                key={country}
                className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  const countryPhotos = getCountryPhotos(country);
                  if (countryPhotos.length > 0) {
                    onImageClick?.(countryPhotos[0], countryPhotos);
                  }
                }}
              >
                <span className="text-xs md:text-sm font-medium text-gray-700 truncate">
                  {country}
                </span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  ({countryRoutes.length})
                </span>
                {countryPhotosCount > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1 md:px-2 py-1 rounded-full flex-shrink-0">
                    📸 {countryPhotosCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Tela Cheia */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full h-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
            {/* Cabeçalho do Modal */}
            <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                Mapa Interativo da Europa - Tela Cheia
              </h3>
              <button
                onClick={toggleFullscreen}
                className="bg-red-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base flex-shrink-0"
              >
                <Minimize2 className="h-4 w-4" />
                <span className="hidden sm:inline">Sair da Tela Cheia</span>
                <span className="sm:hidden">Sair</span>
              </button>
            </div>
            
            {/* Mapa em Tela Cheia */}
            <div className="flex-1 relative">
              <MapContainer
                center={[52.0, 10.0]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
                zoomControl={true}
                minZoom={3}
                maxZoom={50}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Marcadores das cidades */}
                {Array.isArray(routes) && routes.map((route) => {
                  const coords = cityCoordinates[route.city];
                  if (!coords) return null;
                  
                  const cityPhotosCount = getCityPhotos(route.city).length;
                  
                  return (
                    <Marker
                      key={route.id}
                      position={[coords.lat, coords.lng]}
                      icon={createCustomIcon(route.transport, route.visited)}
                      eventHandlers={{
                        click: () => handleCityClick(route),
                      }}
                    >
                      <Popup>
                        <div className="p-3 min-w-[250px]">
                          <h3 className="font-bold text-lg mb-1">{route.city}</h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {route.country}
                          </p>

                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {route.transport === "plane"
                                ? "✈ Avião"
                                : route.transport === "train"
                                ? "🚂 Trem"
                                : "🚐 Motorhome"}
                            </span>
                            {cityPhotosCount > 0 && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                📸 {cityPhotosCount} fotos
                              </span>
                            )}
                          </div>

                          {/* Botões de ação no popup */}
                          <div className="space-y-2">
                            <button
                              onClick={() => {
                                const countryPhotos = getCountryPhotos(
                                  route.country
                                );
                                if (countryPhotos.length > 0) {
                                  setCityPhotos(countryPhotos);
                                  onImageClick?.(countryPhotos[0], countryPhotos);
                                }
                              }}
                              className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                            >
                              <Camera className="h-4 w-4" />
                              <span>Ver Fotos ({cityPhotosCount})</span>
                            </button>

                            {isAuthenticated && (
                              <label className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer text-sm font-medium">
                                <Camera className="h-4 w-4" />
                                <span>Adicionar Foto</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePhotoUpload}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                
                {/* Linha conectando as cidades */}
                {Array.isArray(routes) && routes.length > 1 && (
                  <Polyline
                    positions={routes
                      .map(route => cityCoordinates[route.city])
                      .filter(Boolean)
                      .map(coords => [coords.lat, coords.lng] as [number, number])
                    }
                    color="#3b82f6"
                    weight={3}
                    opacity={0.7}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
