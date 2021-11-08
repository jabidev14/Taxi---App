import React from "react"
import { render } from "@testing-library/react-native"
import MenuScreenModal from "../MenuScreenModal"

describe("<MenuScreenModal />", () => {
  // Mocking navigation object this time the 'navigate' function
  // Navigate function is responsible for pushing us to the next screen
  const navigation = {
    navigate: jest.fn(),
  }
  test("should render list of menu and Sign In/Sign Up button", () => {
    // navigation is a prop we defined
    const { getByTestId } = render(<MenuScreenModal navigation={navigation} />)

    // Here we use the testID we defined inside <MenuScreenModal />
    expect(getByTestId(/menuItem-Bookings/)).toBeDefined()
    expect(getByTestId(/menuItem-Receipts/)).toBeDefined()
    expect(getByTestId(/menuItem-Profile/)).toBeDefined()
    expect(getByTestId(/menuItem-Cards/)).toBeDefined()
    expect(getByTestId(/signInCheck-button/)).toBeDefined()
  })
})