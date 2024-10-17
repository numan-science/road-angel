import React, { useEffect, useRef } from 'react';

const MapView = ({ latitude, longitude }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAdH9leMSBBkt-9tefOxsFJGKM6CC7KkmQ&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
        delete window.initMap;
      };
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const map = mapRef.current;
      const marker = markerRef.current;

      map.setCenter({ lat: latitude, lng: longitude });
      marker.setPosition({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const initMap = () => {
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
    });

    const marker = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: 'Marker',
    });

    mapRef.current = map;
    markerRef.current = marker;
  };

  return <div className="w-full h-96" ref={mapContainerRef}></div>;
};

export default MapView;