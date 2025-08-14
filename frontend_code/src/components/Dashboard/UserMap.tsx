import { useRef, useState } from "react";

import { Map, Source, Layer, Popup } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import type { MapMouseEvent } from "mapbox-gl";
import type { FeatureCollection } from "geojson";

import { clusterLayer, unclusteredPointLayer } from './layer';
import { useTotalStore } from "../../store/total.store";
import { toast } from "sonner";

const UserMap = () => {
  const mapRef = useRef<MapRef>(null);
  const { locations } = useTotalStore() as {
    locations: { id: string; latitude: number; longitude: number }[],
  };
  const [popupInfo, setPopupInfo] = useState<{ coordinates: [number, number]; count: number } | null>(null);

  const handleCircleClick = (event: MapMouseEvent) => {
    const features = event.features;
    if (!features || features.length === 0) return;

    const feature = features[0];
    const pointCount = feature.properties?.point_count;

    if (pointCount) {
      if (feature.geometry?.type === "Point") {
        const coordinates = feature.geometry.coordinates as [number, number];
        setPopupInfo({
          coordinates: coordinates,
          count: pointCount,
        });
      } else {
        toast.warning("Feature geometry is not a Point type.");
      }
    }
  };

  const geojson: FeatureCollection = {
    type: "FeatureCollection",
    features: locations.map((location) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      properties: {
        id: location.id,
      },
    })),
  };

  return (
    <Map
      initialViewState={{
        latitude: 37.0902,
        longitude: -95.7129,
        zoom: 4
      }}
      style={{ height: '100%' }}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      interactiveLayerIds={[clusterLayer.id || 'defaultLayerId']}
      onClick={handleCircleClick}
      attributionControl={false}
      ref={mapRef}
    >
      <Source
        id="locations"
        type="geojson"
        data={geojson}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>

      {popupInfo && (
        <Popup
          longitude={popupInfo.coordinates[0]}
          latitude={popupInfo.coordinates[1]}
          closeOnClick={false}
          onClose={() => setPopupInfo(null)}
          style={{ paddingRight: '30px !important' }}
        >
          <div>
            <span className="text-base font-semibold" style={{ fontFamily: 'Satoshi' }}>Users Count : </span>
            <span className="text-base" style={{ fontFamily: 'Satoshi' }}>{popupInfo.count}</span>
          </div>
        </Popup>
      )}
    </Map>
  )
}

export default UserMap;