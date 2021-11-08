import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

import {usePlace} from '../context/PlacesManager';

const Text = styled.Text`
  padding: 5px;
  font-size: 14px;
`;

export default function Prediction({description, place_id, toggleModal}) {
  const {dispatchPlace} = usePlace();
  return (
    <TouchableOpacity
      key={place_id}
      testID={`prediction-row-${place_id}`}
      onPress={() => {
        dispatchPlace({
          type: 'SET_DESTINATION_PLACE',
          description,
          placeId: place_id,
        });
        toggleModal();
      }}>
      <Text>{description}</Text>
    </TouchableOpacity>
  );
}