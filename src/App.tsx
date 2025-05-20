import { useEffect, useState } from 'react';
import * as Cesium from 'cesium';

function App() {
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initViewer = async () => {
      const terrainProvider = await Cesium.createWorldTerrainAsync();

      if (!isMounted) return;

      const viewerInstance = new Cesium.Viewer('cesiumContainer', {
        terrainProvider,
      });

      viewerInstance.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(127.0, 37.5, 1500000),
      });

      setViewer(viewerInstance);
    };

    initViewer();

    return () => {
      isMounted = false;
      if (viewer) {
        viewer.destroy();
      }
    };
  }, []);

  return (
    <div
      id="cesiumContainer"
      style={{ width: '100vw', height: '100vh', display: 'block' }}
    />
  );
}

export default App;
