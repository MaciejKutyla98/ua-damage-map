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
import { Button, notification } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

import styles from './Map.module.scss';
import {DamageDetailsDrawer} from '../DamageDetailsDrawer/DamageDetailsDrawer';

const initialMapViewport = {
    height: "100vh",
    width: "100wh",
    longitude: 31.2858,
    latitude: 49.0139,
    zoom: 6
};

export const Map = () => {
    const [fetchedData, setFetchedData] = useState();
    const [availablePoints, setAvailablePoints] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [lngLat, setLngLat] = useState(null)
    const [mapViewport, setMapViewport] = useState(initialMapViewport);

    const resetMapViewport = () => {
        setMapViewport((previousMapViewport) => ({
            ...previousMapViewport,
            ...initialMapViewport
        }))
    }

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

    const renderBackButton = () => availablePoints?.length ? (
      <Button
        icon={<RollbackOutlined />}
        onClick={() => {
            setAvailablePoints(undefined);
        }}
        className={styles.button}
      >Go back</Button>
    ): null;

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
    }, []);

    useEffect(() => {
        if (availablePoints?.length) {
            notification.open({
                message: 'We found new available locations',
                description:
                  'We hope you can use them all!',
            })
        }
    }, [availablePoints]);

    const dataToMap = availablePoints || fetchedData || [];

    const points = dataToMap.map(({latitude, longitude, id, damageDegree, description, placeName, placeCategory}) => {
        const isAvailablePoint = !id;
        return ({
            type: 'Feature',
            properties: {
                id,
                damageDegree,
                description,
                placeName,
                placeCategory,
                isAvailablePoint,
            },
            geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });
    });

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
          {renderBackButton()}
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
                const isAvailablePoint = properties?.isAvailablePoint;
                const isCluster = properties?.cluster;
                const pointCount = properties?.point_count;

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
                          isAvailablePoint={isAvailablePoint}
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
                      isAvailablePoint={isAvailablePoint}
                      onClick={() => {
                          handleOnClick()
                          setIsDrawerVisible(true);
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
                onClear={() => {
                    resetMapViewport();
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
            visible={isDrawerVisible && !!currentDamageDetails}
            onClose={() => {
                setCurrentDamageDetails(undefined);
            }}
            damageDetails={currentDamageDetails}
            bounds={bounds}
            onSetAvailablePoints={(points) => {
                setAvailablePoints(points);
                setIsDrawerVisible(false);
            }}
          />
          </>
    );
}