import {GOOGLE_MAPS_API_KEY} from './constants';

import PoliLyne from '@mapbox/polyline';

// This function will shorten the currentPlace description name
export const formatPlaceName = placeName => placeName && placeName.split(",")[0]

// This function receive two arguments
export const APIPlaceAutocomplete = (destination, currentPlace) => {
  const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_MAPS_API_KEY}&input=${destination}&location=${currentPlace.latitude},${currentPlace.longitude}&radius=2000`;

  if (destination.length > 0) {
    return fetch(URL)
      .then(resp => resp.json())
      .catch(error => error);
  } else {
    return 'No destination Address provided';
  }
};

export const fetchRoute = async (originPlaceId, destinationPlaceId) => {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${originPlaceId}&destination=place_id:${destinationPlaceId}&key=${GOOGLE_MAPS_API_KEY}`,
    );
    const json = await res.json();
    if (!json.routes[0]) {
      return;
    }
    const points = PoliLyne.decode(json.routes[0].overview_polyline.points);
    const coordinates = points.map((point) => ({
      latitude: point[0],
      longitude: point[1],
    }));

    return coordinates;
  } catch (error) {
    console.log(error);
  }
};
