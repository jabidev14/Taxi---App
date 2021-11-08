import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Prediction from '../Prediction';
import {PlaceContext} from '../../context/PlacesManager';

describe('<Prediction />', () => {
  test('is tappable', async () => {
    const place = {description: 'Domkyrkan', placeId: '123'};
    const mockToggleModal = jest.fn();
    const dispatchPlace = jest.fn();
    const {getByText} = render(
      <PlaceContext.Provider value={{place, dispatchPlace}}>
        <Prediction
          description={place.description}
          place_id={place.placeId}
          toggleModal={mockToggleModal}
        />
      </PlaceContext.Provider>,
    );

    fireEvent.press(getByText('Domkyrkan'));
    expect(dispatchPlace).toHaveBeenCalled();
    expect(mockToggleModal).toHaveBeenCalled();
  });
});