import React, {useCallback, useEffect, useRef, useState} from "react";
import ReactMapGL, {Marker} from "react-map-gl";
import {fetchData} from "../FetchData/FetchData";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Geocoder from 'react-map-gl-geocoder'
import {Modal} from "../Modal/Modal";

export const Map = () => {
    const [fetchedData, setFetchedData] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [lngLat, setLngLat] = useState(null)
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


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    useEffect(()=> {
        fetchData().then((data)=>{
            setFetchedData(data)
        })
    }, [])
    console.log(fetchedData)
    return (
        <ReactMapGL
            ref={mapRef}
            {...mapViewport}
            mapboxApiAccessToken="pk.eyJ1IjoibWFjaWVqbzExNyIsImEiOiJjbDBwZHlrOGMxeGk0M2N1bzU5Z2V1Yjh3In0.5K0DGY1wdACaDKut7kM2Zw"
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onViewportChange={setMapViewport}
            onClick={(x) => {
                setLngLat(x.lngLat);
                showModal()
            }}
        >
            {fetchedData?.map((_) => <Marker latitude={_.latitude} longitude={_.longitude}>
                <span className="lnr lnr-map-marker"></span>
            </Marker>)}
            <Geocoder
                mapRef={mapRef}
                onViewportChange={handleGeocoderViewportChange}
                mapboxApiAccessToken='pk.eyJ1IjoibWFjaWVqbzExNyIsImEiOiJjbDBwZHlrOGMxeGk0M2N1bzU5Z2V1Yjh3In0.5K0DGY1wdACaDKut7kM2Zw'
                position="top-left"
            />
            <Modal
                isModalVisible={isModalVisible}
                showModal={showModal}
                handleOk={handleOk}
                handleCancel={handleCancel}
                lngLat={lngLat}
            />
        </ReactMapGL>
    );
}