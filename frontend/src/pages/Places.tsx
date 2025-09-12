import React, { useState, useEffect } from 'react';

interface Place {
  id: number;
  name: string;
  type: 'restaurant' | 'church' | 'museum' | 'park' | 'hospital' | 'library' | 'shopping' | 'entertainment';
  address: string;
  accessible: boolean;
  wheelchairAccessible: boolean;
  hasAccessibleRestrooms: boolean;
  hasRamps: boolean;
  hasElevator: boolean;
  hasBrailleSignage: boolean;
  hasAudioAssistance: boolean;
  rating: number;
  reviews: Review[];
  distance: number;
  coordinates: { lat: number; lng: number };
  phoneNumber?: string;
  website?: string;
  hours?: string;
}

interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  accessibilityNotes: string;
  timestamp: Date;
  helpful: number;
}

interface Filter {
  type: string;
  wheelchairAccessible: boolean;
  hasAccessibleRestrooms: boolean;
  hasRamps: boolean;
  hasElevator: boolean;
  hasBrailleSignage: boolean;
  hasAudioAssistance: boolean;
  minRating: number;
  maxDistance: number;
}

const Places: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [filters, setFilters] = useState<Filter>({
    type: '',
    wheelchairAccessible: false,
    hasAccessibleRestrooms: false,
    hasRamps: false,
    hasElevator: false,
    hasBrailleSignage: false,
    hasAudioAssistance: false,
    minRating: 0,
    maxDistance: 50
  });

  useEffect(() => {
    getCurrentLocation();
    fetchPlaces();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [places, filters, searchQuery]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location error:', error);
          
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  };

  const fetchPlaces = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/places');
      const data = await response.json();
      
      
      const enhancedPlaces: Place[] = [
        {
          id: 1,
          name: 'Accessible Eats Restaurant',
          type: 'restaurant',
          address: '123 Main St, Downtown',
          accessible: true,
          wheelchairAccessible: true,
          hasAccessibleRestrooms: true,
          hasRamps: true,
          hasElevator: false,
          hasBrailleSignage: true,
          hasAudioAssistance: false,
          rating: 4.5,
          reviews: [],
          distance: 0.3,
          coordinates: { lat: 40.7129, lng: -74.0058 },
          phoneNumber: '(555) 123-4567',
          website: 'https://accessibleeats.com',
          hours: 'Mon-Sun: 8AM-10PM'
        },
        {
          id: 2,
          name: 'Unity Church',
          type: 'church',
          address: '456 Oak Ave, Midtown',
          accessible: true,
          wheelchairAccessible: true,
          hasAccessibleRestrooms: true,
          hasRamps: true,
          hasElevator: true,
          hasBrailleSignage: false,
          hasAudioAssistance: true,
          rating: 4.8,
          reviews: [],
          distance: 0.8,
          coordinates: { lat: 40.7140, lng: -74.0070 },
          phoneNumber: '(555) 234-5678',
          hours: 'Services: Sun 9AM, 11AM'
        },
        {
          id: 3,
          name: 'Modern Art Museum',
          type: 'museum',
          address: '789 Culture Blvd, Arts District',
          accessible: true,
          wheelchairAccessible: true,
          hasAccessibleRestrooms: true,
          hasRamps: true,
          hasElevator: true,
          hasBrailleSignage: true,
          hasAudioAssistance: true,
          rating: 4.7,
          reviews: [],
          distance: 1.2,
          coordinates: { lat: 40.7150, lng: -74.0080 },
          phoneNumber: '(555) 345-6789',
          website: 'https://modernartmuseum.org',
          hours: 'Tue-Sun: 10AM-6PM'
        },
        {
          id: 4,
          name: 'Central Park',
          type: 'park',
          address: 'Central Park, Parkside',
          accessible: true,
          wheelchairAccessible: true,
          hasAccessibleRestrooms: true,
          hasRamps: true,
          hasElevator: false,
          hasBrailleSignage: false,
          hasAudioAssistance: false,
          rating: 4.3,
          reviews: [],
          distance: 0.5,
          coordinates: { lat: 40.7125, lng: -74.0055 },
          hours: '24/7'
        },
        {
          id: 5,
          name: 'City General Hospital',
          type: 'hospital',
          address: '321 Medical Center Dr',
          accessible: true,
          wheelchairAccessible: true,
          hasAccessibleRestrooms: true,
          hasRamps: true,
          hasElevator: true,
          hasBrailleSignage: true,
          hasAudioAssistance: true,
          rating: 4.2,
          reviews: [],
          distance: 2.1,
          coordinates: { lat: 40.7180, lng: -74.0090 },
          phoneNumber: '(555) 999-0000',
          hours: '24/7 Emergency'
        }
      ];
      
      setPlaces(enhancedPlaces);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = places.filter(place => {
      if (searchQuery && !place.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !place.address.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (filters.type && place.type !== filters.type) return false;
      if (filters.wheelchairAccessible && !place.wheelchairAccessible) return false;
      if (filters.hasAccessibleRestrooms && !place.hasAccessibleRestrooms) return false;
      if (filters.hasRamps && !place.hasRamps) return false;
      if (filters.hasElevator && !place.hasElevator) return false;
      if (filters.hasBrailleSignage && !place.hasBrailleSignage) return false;
      if (filters.hasAudioAssistance && !place.hasAudioAssistance) return false;
      if (place.rating < filters.minRating) return false;
      if (place.distance > filters.maxDistance) return false;
      
      return true;
    });

   
    filtered.sort((a, b) => a.distance - b.distance);
    setFilteredPlaces(filtered);
  };

  const getPlaceIcon = (type: string) => {
    const icons = {
      restaurant: '🍽️',
      church: '⛪',
      museum: '🏛️',
      park: '🌳',
      hospital: '🏥',
      library: '📚',
      shopping: '🛍️',
      entertainment: '🎬'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const getAccessibilityScore = (place: Place) => {
    const features = [
      place.wheelchairAccessible,
      place.hasAccessibleRestrooms,
      place.hasRamps,
      place.hasElevator,
      place.hasBrailleSignage,
      place.hasAudioAssistance
    ];
    return features.filter(Boolean).length;
  };

  const addReview = async (placeId: number, reviewData: Partial<Review>) => {
    try {
      
      const newReview: Review = {
        id: Date.now(),
        userId: 'current-user',
        userName: 'Current User',
        rating: reviewData.rating || 5,
        comment: reviewData.comment || '',
        accessibilityNotes: reviewData.accessibilityNotes || '',
        timestamp: new Date(),
        helpful: 0
      };

      setPlaces(prev => prev.map(place => 
        place.id === placeId 
          ? { ...place, reviews: [...place.reviews, newReview] }
          : place
      ));
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8f9fa',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', color: '#333' }}>
          Accessible Places
        </h1>
        
        
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Search places, addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 50px 12px 16px',
              border: '1px solid #ddd',
              borderRadius: '25px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <div style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px'
          }}>
            🔍
          </div>
        </div>

        
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '8px 16px',
            background: showFilters ? '#007ACC' : '#f0f0f0',
            color: showFilters ? 'white' : '#333',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🎛️ Filters {filteredPlaces.length !== places.length && `(${filteredPlaces.length})`}
        </button>
      </div>

      
      {showFilters && (
        <div style={{
          padding: '16px',
          background: 'white',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Place Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="">All Types</option>
                <option value="restaurant">Restaurants</option>
                <option value="church">Churches</option>
                <option value="museum">Museums</option>
                <option value="park">Parks</option>
                <option value="hospital">Hospitals</option>
                <option value="library">Libraries</option>
                <option value="shopping">Shopping</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>

            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Required Features
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { key: 'wheelchairAccessible', label: 'Wheelchair Accessible' },
                  { key: 'hasAccessibleRestrooms', label: 'Accessible Restrooms' },
                  { key: 'hasRamps', label: 'Ramps' },
                  { key: 'hasElevator', label: 'Elevators' },
                  { key: 'hasBrailleSignage', label: 'Braille Signage' },
                  { key: 'hasAudioAssistance', label: 'Audio Assistance' }
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={filters[key as keyof Filter] as boolean}
                      onChange={(e) => setFilters({...filters, [key]: e.target.checked})}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '14px' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Minimum Rating
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '12px', color: '#666' }}>
                {filters.minRating} stars and above
              </div>
            </div>

            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Maximum Distance
              </label>
              <input
                type="range"
                min="0.1"
                max="50"
                step="0.1"
                value={filters.maxDistance}
                onChange={(e) => setFilters({...filters, maxDistance: parseFloat(e.target.value)})}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '12px', color: '#666' }}>
                Within {filters.maxDistance} miles
              </div>
            </div>
          </div>
        </div>
      )}

      
      <div style={{ padding: '16px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
            <div>Loading accessible places...</div>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
            <div>No places found matching your criteria</div>
            <button
              onClick={() => {
                setFilters({
                  type: '',
                  wheelchairAccessible: false,
                  hasAccessibleRestrooms: false,
                  hasRamps: false,
                  hasElevator: false,
                  hasBrailleSignage: false,
                  hasAudioAssistance: false,
                  minRating: 0,
                  maxDistance: 50
                });
                setSearchQuery('');
              }}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: '#007ACC',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  ':hover': { transform: 'translateY(-2px)' }
                }}
                onClick={() => setSelectedPlace(place)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '24px' }}>{getPlaceIcon(place.type)}</div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
                        {place.name}
                      </h3>
                      <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
                        {place.address}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '16px' }}>⭐</span>
                      <span style={{ fontWeight: 'bold' }}>{place.rating}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {place.distance} mi away
                    </div>
                  </div>
                </div>

                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {place.wheelchairAccessible && (
                    <span style={{
                      padding: '4px 8px',
                      background: '#e8f5e8',
                      color: '#2e7d2e',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ♿ Wheelchair Access
                    </span>
                  )}
                  {place.hasAccessibleRestrooms && (
                    <span style={{
                      padding: '4px 8px',
                      background: '#e8f5e8',
                      color: '#2e7d2e',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      🚻 Accessible Restrooms
                    </span>
                  )}
                  {place.hasRamps && (
                    <span style={{
                      padding: '4px 8px',
                      background: '#e8f5e8',
                      color: '#2e7d2e',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      🚧 Ramps
                    </span>
                  )}
                  {place.hasBrailleSignage && (
                    <span style={{
                      padding: '4px 8px',
                      background: '#e8f5e8',
                      color: '#2e7d2e',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ⠃ Braille
                    </span>
                  )}
                  {place.hasAudioAssistance && (
                    <span style={{
                      padding: '4px 8px',
                      background: '#e8f5e8',
                      color: '#2e7d2e',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      🔊 Audio Help
                    </span>
                  )}
                </div>

                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>Accessibility Score:</span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '16px',
                          height: '4px',
                          background: i < getAccessibilityScore(place) ? '#00BFA6' : '#e0e0e0',
                          borderRadius: '2px'
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00BFA6' }}>
                    {getAccessibilityScore(place)}/6
                  </span>
                </div>

                {place.hours && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    🕒 {place.hours}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setSelectedPlace(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '32px' }}>{getPlaceIcon(selectedPlace.type)}</div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>{selectedPlace.name}</h2>
                  <p style={{ margin: '4px 0 0 0', color: '#666' }}>{selectedPlace.address}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>⭐</span>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{selectedPlace.rating}</span>
                <span style={{ color: '#666' }}>({selectedPlace.reviews.length} reviews)</span>
              </div>
              <div style={{ color: '#666' }}>
                📍 {selectedPlace.distance} miles away
              </div>
            </div>

            
            <div style={{ marginBottom: '20px' }}>
              {selectedPlace.phoneNumber && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>📞 Phone:</strong>{' '}
                  <a href={`tel:${selectedPlace.phoneNumber}`} style={{ color: '#007ACC' }}>
                    {selectedPlace.phoneNumber}
                  </a>
                </div>
              )}
              {selectedPlace.website && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>🌐 Website:</strong>{' '}
                  <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer" style={{ color: '#007ACC' }}>
                    Visit Website
                  </a>
                </div>
              )}
              {selectedPlace.hours && (
                <div>
                  <strong>🕒 Hours:</strong> {selectedPlace.hours}
                </div>
              )}
            </div>

            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Accessibility Features</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {[
                  { key: 'wheelchairAccessible', label: 'Wheelchair Accessible', icon: '♿' },
                  { key: 'hasAccessibleRestrooms', label: 'Accessible Restrooms', icon: '🚻' },
                  { key: 'hasRamps', label: 'Ramps Available', icon: '🚧' },
                  { key: 'hasElevator', label: 'Elevator Access', icon: '🛗' },
                  { key: 'hasBrailleSignage', label: 'Braille Signage', icon: '⠃' },
                  { key: 'hasAudioAssistance', label: 'Audio Assistance', icon: '🔊' }
                ].map(({ key, label, icon }) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      background: selectedPlace[key as keyof Place] ? '#e8f5e8' : '#f5f5f5',
                      borderRadius: '8px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{icon}</span>
                    <span style={{
                      fontSize: '12px',
                      color: selectedPlace[key as keyof Place] ? '#2e7d2e' : '#666',
                      fontWeight: selectedPlace[key as keyof Place] ? 'bold' : 'normal'
                    }}>
                      {label}
                    </span>
                    <span style={{ marginLeft: 'auto' }}>
                      {selectedPlace[key as keyof Place] ? '✅' : '❌'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedPlace.address)}`, '_blank')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#007ACC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                🗺️ Get Directions
              </button>
              <button
                onClick={() => {
                  if (selectedPlace.phoneNumber) {
                    window.open(`tel:${selectedPlace.phoneNumber}`);
                  }
                }}
                disabled={!selectedPlace.phoneNumber}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: selectedPlace.phoneNumber ? '#00BFA6' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: selectedPlace.phoneNumber ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                📞 Call
              </button>
            </div>

            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Reviews & Accessibility Notes</h3>
                <button
                  style={{
                    padding: '6px 12px',
                    background: '#FFC107',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Add Review
                </button>
              </div>
              
              {selectedPlace.reviews.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  color: '#666'
                }}>
                  No reviews yet. Be the first to share your accessibility experience!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedPlace.reviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        padding: '12px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        borderLeft: '3px solid #007ACC'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 'bold' }}>{review.userName}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>⭐</span>
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                        {review.comment}
                      </div>
                      {review.accessibilityNotes && (
                        <div style={{ 
                          padding: '8px', 
                          background: '#e8f4fd', 
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: '#0066cc'
                        }}>
                          <strong>♿ Accessibility Note:</strong> {review.accessibilityNotes}
                        </div>
                      )}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px',
                        fontSize: '11px',
                        color: '#666'
                      }}>
                        <span>{review.timestamp.toLocaleDateString()}</span>
                        <span>👍 {review.helpful} helpful</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Places;