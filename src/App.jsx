import { useEffect, useRef, useState } from "react";

import logoImg from "./assets/logo.png";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import Modal from "./components/Modal.jsx";
import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import { sortPlacesByDistance } from "./loc.js";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(() => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude,
      );

      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current),
    );
    setIsOpen(false);
  }

  return (
    <>
      <Modal open={isOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header className="mx-auto flex w-full max-w-7xl flex-col items-center gap-5 px-4 py-8 text-center sm:px-6 md:flex-row md:justify-between md:text-left lg:px-8">
        <div className="flex items-center gap-4">
          <img
            className="h-14 w-14 object-contain"
            src={logoImg}
            alt="Stylized globe"
          />
          <h1 className="m-0 text-3xl font-bold tracking-wider sm:text-4xl">
            PlacePicker
          </h1>
        </div>
        <p className="m-0 max-w-[38ch] text-base">
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.8fr)] lg:gap-7 lg:px-8">
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={AVAILABLE_PLACES}
          fallbackText="Sorted by distance from your current location."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
