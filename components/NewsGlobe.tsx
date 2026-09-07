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

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.35;
    globe.controls().enableZoom = true;
    globe.controls().minDistance = 180;
    globe.controls().maxDistance = 420;

    globe.pointOfView(
      {
        lat: 20,
        lng: 65,
        altitude: 2.2,
      },
      0,
    );
  }, []);

  return (
    <div className="relative flex h-[520px] w-full items-center justify-center lg:h-[600px]">
      <div className="absolute h-[390px] w-[390px] rounded-full bg-blue-500/20 blur-3xl lg:h-[500px] lg:w-[500px]" />

      <Globe
        ref={globeRef}
        width={620}
        height={620}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere
        atmosphereColor="#4f8cff"
        atmosphereAltitude={0.16}
        arcsData={connections}
        arcColor={() => "#5b8cff"}
        arcAltitudeAutoScale={0.35}
        arcStroke={0.8}
        arcDashLength={0.35}
        arcDashGap={1.2}
        arcDashInitialGap={() => Math.random()}
        arcDashAnimateTime={2200}
        pointsData={locations}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "#8ab4ff"}
        pointAltitude={0.03}
        pointRadius={0.5}
        pointsMerge
        showGraticules
        enablePointerInteraction
      />
    </div>
  );
}