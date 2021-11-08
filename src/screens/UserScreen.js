import React, { useEffect, useState, useRef } from "react"

import {StatusBar, Platform, Image} from 'react-native'
import styled from 'styled-components/native';
import DepartureInformation from '../components/DepartureInformation';

import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps"
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions"
import Geolocation from "react-native-geolocation-service"


import Geocoder from 'react-native-geocoding';
import {usePlace} from '../context/PlacesManager';
import {GOOGLE_MAPS_API_KEY} from '../utils/constants';

// Import icon image
import marker from '../assets/icons-marker.png';

// Import MenuButtonLeft style
import {customStyleMap, MenuButtonLeft} from '../styles';
import FeatherIcon from 'react-native-vector-icons/Feather';

// Import BookingInformation and useShowState custom hook
import BookingInformation from '../components/BookingInformation';
import {useShowState} from '../hooks';

import {fetchRoute} from '../utils'

Geocoder.init(GOOGLE_MAPS_API_KEY, {language: 'es'});

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;
const mapContainer = {
  flex: 7,
};

// Create Styled component.
// This component its almost right in the middle of our Emulator.
// We have to play a bit with the margin-top property.
const FixedMarker = styled.View`
  left: 50%;
  margin-left: -16px;
  margin-top: -125px;
  position: absolute;
  top: 50%;
`;
// This will be the marker Size
const markerStyle = {
  height: 36,
  width: 36,
};

const UserScreen = ({navigation}) => {

  const [location, setLocation] = useState(null)

  const {
    place: {currentPlace, destinationPlace}, 
    dispatchPlace,
  } = usePlace();

  // Create a local state using the custom Hook
  const [showBooking, toggleShowBookingViews] = useShowState(false);

  const [polilyneCoordinates, setPolilyneCoordinates] = useState([]);
  const mapRef = useRef(null);

  const handleLocationPermission = async () => {
    let permissionCheck = ""
    if (Platform.OS === "ios") {
      permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)

      if (permissionCheck === RESULTS.DENIED) {
        const permissionRequest = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        )
        permissionRequest === RESULTS.GRANTED
          ? console.warn("Location permission granted.")
          : console.warn("Location perrmission denied.")
      }
    }

    if (Platform.OS === "android") {
      permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)

      if (permissionCheck === RESULTS.DENIED) {
        const permissionRequest = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        )
        permissionRequest === RESULTS.GRANTED
          ? console.warn("Location permission granted.")
          : console.warn("Location perrmission denied.")
      }
    }
  }

  useEffect(() => {
    handleLocationPermission()
  }, [])

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        Geocoder.from({
          latitude: latitude,
          longitude: longitude,
        }).then(res => {
          // Destructure the response
          const {
            formatted_address,
            place_id,
            geometry: {
              location: {lat, lng},
            },
          } = res.results[0];
          // Update current location
          setLocation({latitude, longitude});
          // Dispatch action to SET_CURRENT_PLACE
          // This will update our place Context API.
          dispatchPlace({
            type: 'SET_CURRENT_PLACE',
            description: formatted_address,
            placeId: place_id,
            latitude: lat,
            longitude: lng,
          });
        });
      },
      error => {
        console.log(error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
  }, [dispatchPlace])

  // Add this function to update Location Place
 const onRegionChange = ({latitude, longitude}) => {
  // using Geocoder we will fetch new location information
  Geocoder.from({
    latitude,
    longitude,
  }).then(res => {
    const {
      formatted_address,
      place_id,
      geometry: {
        location: {lat, lng},
      },
    } = res.results[0];
  // Once we have a response we dispatch & update currentPlace
    dispatchPlace({
      type: 'SET_CURRENT_PLACE',
      description: formatted_address,
      placeId: place_id,
      latitude: lat,
      longitude: lng,
    });
  });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuButtonLeft
          onPress={() => navigation.navigate('Menu')}
          testID="modal-menu">
          <FeatherIcon name="menu" size={25} color="#000" />
        </MenuButtonLeft>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (currentPlace.placeId && destinationPlace.placeId) {
      fetchRoute(currentPlace.placeId, destinationPlace.placeId).then(
        results => {
          setPolilyneCoordinates(results);
          console.log(results)
          mapRef.current.fitToCoordinates(results, {
            edgePadding: {left: 20, right: 20, top: 40, bottom: 60},
          });
        },
      );
    }
  }, [currentPlace, destinationPlace.placeId]);

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      {location && (
        <MapView
          testID="map"
          ref={mapRef}
          style={mapContainer}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          
          onRegionChangeComplete={onRegionChange}
          showsUserLocation={true}
          customMapStyle={customStyleMap}
          paddingAdjustmentBehavior="automatic"
          showsMyLocationButton={true}
          showsBuildings={true}
          maxZoomLevel={17.5}
          loadingEnabled={true}
          loadingIndicatorColor="#fcb103"
          loadingBackgroundColor="#242f3e">

          {polilyneCoordinates.length > 1 && (
            <Polyline
              testID="route"
              coordinates={polilyneCoordinates}
              strokeWidth={3}
              strokeColor="#F4E22C"
            />
          )}

          {polilyneCoordinates.length > 1 && (
            <Marker
              testID="destination-marker"
              coordinate={polilyneCoordinates[polilyneCoordinates.length - 1]}
            />
          )}
        </MapView> 
      )}

      {destinationPlace.placeId === '' && (
        <FixedMarker testID="fixed-marker">
            <Image style={markerStyle} source={marker} />
        </FixedMarker>
      )}

      {showBooking ? (
        <BookingInformation />
      ) : (
        <DepartureInformation toggleShowBookingViews={toggleShowBookingViews} />
      )}
    </Container>
  );
};

export default UserScreen