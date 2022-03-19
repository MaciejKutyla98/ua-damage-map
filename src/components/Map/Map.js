import React, {useEffect, useState} from "react";
import ReactMapGL from "react-map-gl";
import {useDispatchMap} from "../../hooks/mapHook";
import {Markers} from "../Markers/Markers";
import {fetchData} from "../FetchData/FetchData";

export const Map = () => {
    const mapDispatch = useDispatchMap();

    const [mapViewport, setMapViewport] = useState({
        height: "100vh",
        width: "100wh",
        longitude: 31.2858,
        latitude: 49.0139,
        zoom: 6
    });

    // useEffect(() => {
    //     fetchData()
    // });

    return (
        <ReactMapGL
            {...mapViewport}
            mapboxApiAccessToken="pk.eyJ1IjoibWFjaWVqbzExNyIsImEiOiJjbDBwZHlrOGMxeGk0M2N1bzU5Z2V1Yjh3In0.5K0DGY1wdACaDKut7kM2Zw"
            mapStyle="mapbox://styles/mapbox/streets-v11"
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