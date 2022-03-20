import React, {useCallback, useEffect, useRef, useState} from "react";
import cn from 'classnames';
import ReactMapGL, {Marker, FlyToInterpolator} from "react-map-gl";
import {fetchData} from "../FetchData/FetchData";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Geocoder from 'react-map-gl-geocoder'
import {Modal} from "../Modal/Modal";
import {MarkerIcon} from '../MarkerIcon/MarkerIcon';
import useSupercluster from 'use-supercluster';

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

    const bounds = mapRef?.current?.getMap().getBounds().toArray().flat();

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

    const points = fetchedData ? fetchedData.map(({latitude, longitude, id, damageDegree, description}) => ({
        type: 'Feature',
        properties: {
            id,
            damageDegree,
            description,
        },
        geometry:  {
            type: 'Point',
            coordinates:  [longitude, latitude]
        }
    })) : [];

    const { clusters, supercluster } = useSupercluster({
        points,
        bounds,
        zoom: mapViewport.zoom,
        options: {
            radius: 75,
            maxZoom: 20,
        }
    });

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
            {clusters.map((cluster, index) => {
                const [longitude, latitude] = cluster.geometry.coordinates;
                const properties = cluster?.properties;
                const isCluster = properties?.cluster;
                const pointCount = properties?.point_count;

                console.log('ppp', properties);

                const handleOnClick = () => {
                    if (isCluster) {
                        const expansionZoom = Math.min(
                          supercluster.getClusterExpansionZoom(cluster.id),
                          20
                        );
                        setMapViewport((previousMapViewport) => {
                            return ({
                                ...previousMapViewport,
                                longitude,
                                latitude,
                                zoom: expansionZoom,
                                transitionInterpolator: new FlyToInterpolator({
                                    speed: 2
                                }),
                                transitionDuration: 'auto'
                            });
                        });
                    }
                };

                if (isCluster) {
                    return <Marker
                      key={index}
                      latitude={latitude}
                      longitude={longitude}
                    >
                        <MarkerIcon
                          pointCount={pointCount}
                          onClick={() => {
                              handleOnClick();
                          }}
                        />
                    </Marker>;
                }

                const markerIconVariant = {
                    ['worksCorrectly']: 'bad',
                    ['worksPartially']: 'moderate',
                    ['doesNotWork']: 'good'
                }[properties.damageDegree];

                return <Marker
                  key={index}
                  latitude={latitude}
                  longitude={longitude}
                >
                    <MarkerIcon
                      variant={markerIconVariant}
                      onClick={() => {
                          handleOnClick()
                          setCurrentDamageDetails(properties);
                      }
                    }
                    />
                </Marker>;
            })}
            <Geocoder
                mapRef={mapRef}
                containerRef={geocoderContainerRef}
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