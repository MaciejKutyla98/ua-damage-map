import React, {useCallback, useEffect, useRef, useState} from "react";
import ReactMapGL, {Marker} from "react-map-gl";
import {useDispatchMap} from "../../hooks/mapHook";
import {Markers} from "../Markers/Markers";
import {fetchData} from "../FetchData/FetchData";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Geocoder from 'react-map-gl-geocoder'

export const Map = () => {
    const mapDispatch = useDispatchMap();

     const [fetchedData, setFetchedData] = useState();


    const [mapViewport, setMapViewport] = useState({
        height: "100vh",
        width: "100wh",
        longitude: 31.2858,
        latitude: 49.0139,
        zoom: 6
    });
    const mapRef = useRef();
    const handleViewportChange = useCallback(
        (newViewport) => setMapViewport(newViewport),
        []
    );

    const handleGeocoderViewportChange = useCallback(
        (newViewport) => {
            const geocoderDefaultOverrides = { transitionDuration: 1000 };

            return handleViewportChange({
                ...newViewport,
                ...geocoderDefaultOverrides
            });
        },
        []
    );

    useEffect(()=> {
        fetchData().then((data)=>{
            setFetchedData(data)
            //
        })
    }, [fetchedData])

    return (
        <ReactMapGL
            ref={mapRef}
            {...mapViewport}
            mapboxApiAccessToken="pk.eyJ1IjoibWFjaWVqbzExNyIsImEiOiJjbDBwZHlrOGMxeGk0M2N1bzU5Z2V1Yjh3In0.5K0DGY1wdACaDKut7kM2Zw"
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onViewportChange={setMapViewport}
            onClick={x => {
                x.srcEvent.which === 1 &&
                mapDispatch({ type: "ADD_MARKER", payload: { marker: x.lngLat } });
            }}
        >
            {fetchedData?.map((_) => <Marker latitude={_.latitude} longitude={_.longitude}>
                <span className="lnr lnr-map-marker"></span>
            </Marker>)}
            <Markers />
            <Geocoder
                mapRef={mapRef}
                onViewportChange={handleGeocoderViewportChange}
                mapboxApiAccessToken='pk.eyJ1IjoibWFjaWVqbzExNyIsImEiOiJjbDBwZHlrOGMxeGk0M2N1bzU5Z2V1Yjh3In0.5K0DGY1wdACaDKut7kM2Zw'
                position="top-left"
            />
        </ReactMapGL>
    );
}