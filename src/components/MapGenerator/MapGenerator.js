import React, { useRef, useEffect, useState } from 'react';
import * as mapboxgl from 'mapbox-gl';
import styles from './MapGenerator.module.scss'
export const MapGenerator = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFjaWVqbzExNyIsImEiOiJjbDBwZHlrOGMxeGk0M2N1bzU5Z2V1Yjh3In0.5K0DGY1wdACaDKut7kM2Zw';

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(31.2858);
    const [lat, setLat] = useState(49.0139);
    const [zoom, setZoom] = useState(7);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
        <div>
            <div className={styles.sidebar}>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className={styles.mapContainer} />
        </div>
    );
}