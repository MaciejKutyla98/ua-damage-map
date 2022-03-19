import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {MapProvider} from "./hooks/mapHook";
import {Map} from "./components/Map/Map";

ReactDOM.render(
    <MapProvider>
        <Map />
    </MapProvider>,
    document.getElementById("root")
);

