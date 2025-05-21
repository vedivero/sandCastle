import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

const ThreeDTilesFeatureStyling = () => {
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    const init = async () => {
      const viewer = new Cesium.Viewer("cesiumContainer", {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        animation: false,
        timeline: false,
        shouldAnimate: true,
      });

      viewerRef.current = viewer;

      // 초기 지구 전체 뷰 렌더링 (0,0 위치에서 줌아웃)
      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
      });

      try {
        const tileset = await Cesium.createOsmBuildingsAsync() as Cesium.Cesium3DTileset & {
          readyPromise: Promise<void>;
        };

        await tileset.readyPromise;
        console.log("타일셋 준비 완료");
        viewer.scene.primitives.add(tileset);

        // 타일셋 로드 후 뉴욕으로 부드럽게 이동
        let moved = false;
        const removeCallback = viewer.scene.postRender.addEventListener(() => {
          if (!moved) {
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(-74.002, 40.675, 3000),
              orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-30),
              },
              duration: 2,
              easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
            });
            moved = true;
            removeCallback(); // 이후 반복 방지
          }
        });
      } catch (error) {
        console.error("타일셋 로드 실패:", error);
      }
    };

    init();

    return () => {
      viewerRef.current?.destroy();
    };
  }, []);

  return (
    <div
      id="cesiumContainer"
      style={{ width: "100vw", height: "100vh", display: "block" }}
    />
  );
};

export default ThreeDTilesFeatureStyling;
