"use client";

import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";

const connections = [
  {
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 51.5072,
    endLng: -0.1276,
  },
  {
    startLat: 19.076,
    startLng: 72.8777,
    endLat: 40.7128,
    endLng: -74.006,
  },
  {
    startLat: 35.6762,
    startLng: 139.6503,
    endLat: 37.7749,
    endLng: -122.4194,
  },
  {
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 25.2048,
    endLng: 55.2708,
  },
  {
    startLat: -33.8688,
    startLng: 151.2093,
    endLat: 51.5072,
    endLng: -0.1276,
  },
  {
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 35.6762,
    endLng: 139.6503,
  },
];

const locations = [
  {
    lat: 28.6139,
    lng: 77.209,
    label: "India",
  },
  {
    lat: 51.5072,
    lng: -0.1276,
    label: "UK",
  },
  {
    lat: 40.7128,
    lng: -74.006,
    label: "USA",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    label: "Japan",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    label: "Singapore",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    label: "UAE",
  },
];

export default function NewsGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    const globe = globeRef.current;

    if (!globe) {
      return;
    }

    const controls = globe.controls();

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = true;
    controls.minDistance = 190;
    controls.maxDistance = 390;

    globe.pointOfView(
      {
        lat: 20,
        lng: 65,
        altitude: 2.45,
      },
      0,
    );
  }, []);

  return (
    <div className="news-globe relative flex h-[440px] w-full items-center justify-center lg:h-[480px]">
      <div className="absolute h-[330px] w-[330px] rounded-full bg-blue-500/20 blur-3xl lg:h-[430px] lg:w-[430px]" />

      <Globe
        ref={globeRef}
        width={480}
        height={480}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere
        atmosphereColor="#5b8cff"
        atmosphereAltitude={0.16}
        arcsData={connections}
        arcColor={() => "#70a7ff"}
        arcAltitudeAutoScale={0.32}
        arcStroke={0.75}
        arcDashLength={0.35}
        arcDashGap={1.1}
        arcDashInitialGap={() => Math.random()}
        arcDashAnimateTime={2400}
        pointsData={locations}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "#b8d4ff"}
        pointAltitude={0.035}
        pointRadius={0.55}
        pointsMerge
        showGraticules
        enablePointerInteraction
      />

      <style jsx global>{`
        .news-globe canvas {
          cursor: grab !important;
        }

        .news-globe canvas:active {
          cursor: grabbing !important;
        }
      `}</style>
    </div>
  );
}