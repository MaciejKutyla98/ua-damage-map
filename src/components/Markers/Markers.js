import React, { Fragment } from "react";
import { Marker } from "react-map-gl";
import {useStateMap} from "../../hooks/mapHook";
import './Markers.module.scss'

export const Markers = () => {
    const { markers } = useStateMap();
    return (
        <Fragment>
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    offsetTop={0}
                    offsetLeft={0}
                    latitude={marker[1]}
                    longitude={marker[0]}
                >
                    <span className="lnr lnr-map-marker"></span>
                </Marker>
            ))}
        </Fragment>
    );
};