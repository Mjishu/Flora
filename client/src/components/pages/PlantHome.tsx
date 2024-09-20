import React from 'react'
import '../../App.css'
import { Card, ReverseCard } from '../general/Card';
import Navbar from '../general/Navbar';
import authService from '../../auth/authService';
import { UseUser } from "../user/userContext"

const AuthService = new authService();
interface Tree {
  id: number;
  image_url: string;
  common_name: string;
  scientific_name: string;
  genus: string;
  family: string;
  description: string;
  is_invasive: boolean;
}

export default function PlantHome() {
  const { currentUser, currentUserRef, userLoading } = UseUser();
  const [sePlantsNa, setsePlantsNa] = React.useState<Tree[] | null>(null);
  const [plantNumber, setPlantNumber] = React.useState(0)
  const [loading, setLoading] = React.useState(true);
  const [cardFlipped, setcardFlipped] = React.useState(false);
  const [arrows, setArrows] = React.useState({
    rightArrow: false,
    leftArrow: false,
  })

  React.useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { return console.log("You are not logged in") }

    fetch("/api/plants/na/south-east", { method: "GET", headers: { Authorization: token } }) //* adding the auth part made it break?
      .then(res => res.json()).then(data => setsePlantsNa(data)).catch(err => console.error(`error fetching plants: ${err}`))
      .finally(() => setLoading(false))
  }, [])

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") {
        flipCard();
      } else if (e.code === "ArrowRight") {
        handleKnownCard();
      } else if (e.code === "ArrowLeft") {
        handleUnknownCard();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cardFlipped, plantNumber])

  // React.useEffect(() => {
  //   if (!sePlantsNa) { return }

  //   const token = localStorage.getItem("token")
  //   if (token === null || !token) {
  //     console.error("token does not exist");
  //     return;
  //   }

  //   const fetchParams = {
  //     method: "post",
  //     headers: { Authorization: token, "Content-Type": "application/json" },
  //     body: JSON.stringify({ card_id: sePlantsNa[plantNumber].id })
  //   }

  //   fetch("/api/cards/is-ready", fetchParams)
  //     .then(res => res.json())
  //     .then(data => console.log(data)) //? !data.isReady && plantNumber + 1 
  //     .catch(err => console.error(`error fetching card status ${err}`))
  // }, [plantNumber, sePlantsNa]) //? not sure if i need these 2 dependencies

  if (userLoading || loading) {
    return <h1>App is loading</h1>
  }

  if (!sePlantsNa || sePlantsNa.length < 1) {
    return <h1>Cannot find data</h1>
  }

  function handleKnownCard() { //todo On fetch set authroization token here 
    const token = localStorage.getItem("token");

    if (token === null) {
      console.error("token does not exist");
      return;
    }

    if (!sePlantsNa) { return }

    const fetchParams = {
      method: "post",
      headers:
      {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ card_id: sePlantsNa[plantNumber].id, seen: true })
    }

    fetch("/api/cards/known", fetchParams)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(`error sending card back: ${err}`))

    setPlantNumber((prevNumber: number) => prevNumber + 1);
    if (plantNumber >= sePlantsNa.length - 1) {
      setPlantNumber(0)
    }
    setcardFlipped(false);
    setArrows(prevArrows => ({ ...prevArrows, rightArrow: false }));
  }

  function handleUnknownCard(): void {
    const token = localStorage.getItem("token");

    if (token == null) {
      console.error("Token does not exist");
      return;
    }

    if (!sePlantsNa) { return }

    const fetchParams = {
      method: "post",
      headers:
      {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ card_id: sePlantsNa[plantNumber].id, seen: false })
    }
    fetch("/api/cards/unknown", fetchParams)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(`error sending card back: ${err}`))

    setPlantNumber((prevNumber: number) => prevNumber + 1);
    if (plantNumber >= sePlantsNa.length - 1) {
      setPlantNumber(0)
    }
    setcardFlipped(false);
    setArrows(prevArrows => ({ ...prevArrows, leftArrow: false }));
  }

  function flipCard(): void {
    setcardFlipped(!cardFlipped)
  }

  return (
    <div >
      <Navbar />
      <h1>Plants</h1>
      {!cardFlipped ? <Card
        plantNumber={plantNumber}
        setPlantNumber={setPlantNumber}
        common_name={sePlantsNa[plantNumber].common_name}
        image={sePlantsNa[plantNumber].image_url}
        plantsLength={sePlantsNa.length}
        handleKnown={handleKnownCard}
        handleUnknown={handleUnknownCard}
        cardFlipped={flipCard}
      />
        :
        <ReverseCard
          plantNumber={plantNumber}
          setPlantNumber={setPlantNumber}
          common_name={sePlantsNa[plantNumber].common_name}
          scientific_name={sePlantsNa[plantNumber].scientific_name}
          genus={sePlantsNa[plantNumber].genus}
          family={sePlantsNa[plantNumber].family}
          plantsLength={sePlantsNa.length}
          handleKnown={handleKnownCard}
          handleUnknown={handleUnknownCard}
          cardFlipped={flipCard}
          description={sePlantsNa[plantNumber].description}
          is_invasive={sePlantsNa[plantNumber].is_invasive}
        />
      }

    </div>
  )
}


