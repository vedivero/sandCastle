import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import './cesium/widgets.css';
import * as Cesium from "cesium";
import ThreeDTilesFeatureStyling from './beginner/ThreeDTilesFeatureStyling.tsx';

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <ThreeDTilesFeatureStyling /> 
  </React.StrictMode>
);
