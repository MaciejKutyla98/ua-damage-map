import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {MapProvider} from "./hooks/mapHook";
import {Map} from "./components/Map/Map";
import { Layout } from './components/Layout/Layout';


ReactDOM.render(
    <MapProvider>
      <Layout>
        <Map />
      </Layout>
    </MapProvider>,
    document.getElementById("root")
);

