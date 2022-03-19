import React, {useCallback, useEffect, useRef, useState} from "react";
import cn from 'classnames';
import ReactMapGL, {Marker} from "react-map-gl";
import {fetchData} from "../FetchData/FetchData";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Geocoder from 'react-map-gl-geocoder'
import {Modal} from "../Modal/Modal";
import {MarkerIcon} from '../MarkerIcon/MarkerIcon';

import styles from './Map.module.scss';
import {DamageDetailsDrawer} from '../DamageDetailsDrawer/DamageDetailsDrawer';

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

    const [currentDamageDetails, setCurrentDamageDetails] = useState();

    const mapRef = useRef();
    const geocoderContainerRef = useRef();

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
        fetchData().then((data)=>{
            setFetchedData(data)
        })
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
      <>
        <div ref={geocoderContainerRef} className={cn(styles.geocoderContainer, {[styles.geocoderContainerHidden]: !!currentDamageDetails})} />
        <ReactMapGL
            ref={mapRef}
            {...mapViewport}
            mapboxApiAccessToken="pk.eyJ1IjoibWFjaWVqbzExNyIsImEiOiJjbDBwZHlrOGMxeGk0M2N1bzU5Z2V1Yjh3In0.5K0DGY1wdACaDKut7kM2Zw"
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onViewportChange={setMapViewport}
            onClick={({lngLat}) => {
                setLngLat(lngLat);
                showModal()
            }}
        >
            {fetchedData?.map((damageReport) => {
                const variant = {
                    worksCorrectly: 'good',
                    worksPartially: 'moderate',
                    doesNotWork: 'bad'
                }[damageReport.damageDegree];

                return <Marker
                  key={damageReport.id}
                  latitude={damageReport.latitude}
                  longitude={damageReport.longitude}
                >
                    <MarkerIcon
                      variant={variant}
                      onClick={(e) => {
                         setCurrentDamageDetails(damageReport);
                      }}
                    />
                </Marker>;
            })}
            <Geocoder
                mapRef={mapRef}
                containerRef={geocoderContainerRef}
                onViewportChange={handleGeocoderViewportChange}
                mapboxApiAccessToken='pk.eyJ1IjoibWFjaWVqbzExNyIsImEiOiJjbDBwZHlrOGMxeGk0M2N1bzU5Z2V1Yjh3In0.5K0DGY1wdACaDKut7kM2Zw'
                position="top-left"
                onClick={() => {
                    console.log('test')
                }}
            />
            <Modal
                isModalVisible={isModalVisible}
                showModal={showModal}
                handleOk={handleOk}
                handleCancel={handleCancel}
                lngLat={lngLat}
            />
        </ReactMapGL>
          <DamageDetailsDrawer
            visible={!!currentDamageDetails}
            onClose={() => {
                setCurrentDamageDetails(undefined);
            }}
            damageDetails={currentDamageDetails}
          />
          </>
    );
}