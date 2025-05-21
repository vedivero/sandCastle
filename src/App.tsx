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
        animation:false,
        timeline:false
      });

      viewerInstance.scene.camera.setView({
        destination:Cesium.Cartesian3.fromDegrees(0,0,20000000)
      });


      setTimeout(()=>{
        if(!navigator.geolocation){
          console.warn("GeoLocation을 지원하지 않습니다.");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position)=>{
            const { latitude, longitude } = position.coords;

            viewerInstance.camera.flyTo({
              destination:Cesium.Cartesian3.fromDegrees(longitude,latitude,100000),
              duration:2
            })
          },
          (error)=>{
            console.error("현재 위치를 가져오지 못했습니다.",error)
          }
        )

      },1000)


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
