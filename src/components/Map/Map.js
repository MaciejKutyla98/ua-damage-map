import React, { useState } from "react";
import ReactMapGL from "react-map-gl";
import {useDispatchMap} from "../../hooks/mapHook";
import {Markers} from "../Markers/Markers";

export const Map = () => {
    const mapDispatch = useDispatchMap();

    const [mapViewport, setMapViewport] = useState({
        height: "100vh",
        width: "100wh",
        longitude: 2.571606,
        latitude: 45.226913,
        zoom: 5
    });

    return (
        <ReactMapGL
            {...mapViewport}
            mapboxApiAccessToken="pk.eyJ1IjoibWFjaWVqbzExNyIsImEiOiJjbDBwZHlrOGMxeGk0M2N1bzU5Z2V1Yjh3In0.5K0DGY1wdACaDKut7kM2Zw"
            mapStyle="mapbox://styles/ernebuta/ck6l5q6me1dmn1ip74713pndm"
            onViewportChange={setMapViewport}
            onClick={x => {
                x.srcEvent.which === 1 &&
                mapDispatch({ type: "ADD_MARKER", payload: { marker: x.lngLat } });
            }}
        >
            <Markers />
        </ReactMapGL>
    );
}