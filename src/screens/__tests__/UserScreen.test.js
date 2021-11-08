import React from "react"
import { render, waitFor, act } from "@testing-library/react-native"
import UserScreen from "../UserScreen"
// Import check from react-native-permissions
import { check } from "react-native-permissions"
// Import Geolocation also
import Geolocation from "react-native-geolocation-service"
import {PlaceContext} from '../../context/PlacesManager'
import Geocoder from 'react-native-geocoding'

describe('<UserScreen />', () => {
  const place = {
    currentPlace: {
      description: 'Keillers Park',
      placeId: 'abc',
      latitude: 57.7,
      longitude: 11.93,
    },
  };
  const dispatchPlace = jest.fn();
  // Mock navigation prop
  // Also declare the navigation prop when component render bellow
  // See how we mocked setOptions as a jest function.
  const navigation = {
    setOptions: jest.fn(),
  }
  test("should renders MapView and Marker with user current location", async () => {
    const { getByTestId } = render(
      <PlaceContext.Provider value={{ place, dispatchPlace }}>
        <UserScreen navigation={navigation} />
      </PlaceContext.Provider>
    )

    await waitFor(() => {
      expect(check).toHaveBeenCalledTimes(1);
      expect(Geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
      // Here. Add this line.
      // We're testing that Geocoder.from was called.
      // We also test the location from ./__mocks__/react-native-geocoding.js
      expect(Geocoder.from).toHaveBeenCalledWith({
        latitude: 57.7,
        longitude: 11.93,
      });
      expect(getByTestId('map')).toBeDefined();
    });
  });

  // Added a new test case for Context Providers
  test("should have called Context Providers", async () => {
    render(
      <PlaceContext.Provider value={{ place, dispatchPlace }}>
        <UserScreen navigation={navigation} />
      </PlaceContext.Provider>
    )

    // Here we await the fulfillment of setLocation({...})
    // This updates our local state
    await act(() => Promise.resolve())

    // Then we can add assertions. Once the promise was fulfill.
    // See how we test the disptachPlace action
    expect(dispatchPlace).toHaveBeenCalledWith({
      type: "SET_CURRENT_PLACE",
      description: "Lindholmen",
      placeId: "abc",
      latitude: 57.7,
      longitude: 11.93,
    })
  })

});