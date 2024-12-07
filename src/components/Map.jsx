import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import Styles from "./Map.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCities } from "./context/CitiesContext";
import { useGeolocation } from "./hooks/useGeolocation";
import { UseUrlPosition } from "./hooks/useUrl";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [mapLat, mapLng] = UseUrlPosition();
  const {
    // eslint-disable-next-line
    isLoading: isLoadingPosition,
    position: geoLoacationPosition,
    getPosition,
  } = useGeolocation();

  useEffect(
    function () {
      if (mapLat && mapLng) {
        setMapPosition([mapLat, mapLng]);
      }
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geoLoacationPosition)
        setMapPosition([geoLoacationPosition.lat, geoLoacationPosition.lng]);
    },
    [geoLoacationPosition]
  );
  return (
    <div className={Styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {" "}
        {isLoadingPosition ? "...Loading" : "use your position"}
      </Button>
      <MapContainer
        center={mapPosition}
        // center={[mapLat, mapLng]}
        zoom={6}
        scrollWheelZoom={true}
        className={Styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        {/* <Marker position={mapPosition}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng} `),
  });
}

export default Map;
