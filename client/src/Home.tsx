import React from 'react'
import './App.css'
import { Card, ReverseCard } from './components/Card';
import Navbar from './components/Navbar';
import authService from './auth/authService';
import { UseUser } from "./components/user/userContext"

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

function Home() {
  const { currentUser, currentUserRef, userLoading } = UseUser();
  const [sePlantsNa, setsePlantsNa] = React.useState<Tree[] | null>(null);
  const [plantNumber, setPlantNumber] = React.useState(0)
  const [displayUser, setdisplayUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [cardFlipped, setcardFlipped] = React.useState(false);
  const [arrows, setArrows] = React.useState({
    rightArrow: false,
    leftArrow: false,
  })

  React.useEffect(() => {
    fetch("/api/plants/northAmerica/southEast")
      .then(res => res.json())
      .then(data => setsePlantsNa(data))
      .catch(err => console.error(`error fetching florida trees: ${err}`)) //network error?
      .finally(() => setLoading(false))
  }, [])

  // s:OJVhteYTR1nZqEAZ8UQm2MXcyzUnhfF8.QpQHKwdA6l1vsTaRw6mrBu7t5igR2Zw6wEnwKGMFGkI
  //s:OJVhteYTR1nZqEAZ8UQm2MXcyzUnhfF8.QpQHKwdA6l1vsTaRw6mrBu7t5igR2Zw6wEnwKGMFGkI
  React.useEffect(() => {
    if (!sePlantsNa) { return }

    const token = localStorage.getItem("token")
    if (token === null || !token) {
      console.error("token does not exist");
      return;
    }

    const fetchParams = {
      method: "post",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ card_id: sePlantsNa[plantNumber].id })
    }

    fetch("/api/cards/is-ready", fetchParams)
      .then(res => res.json())
      .then(data => console.log(data)) //? !data.isReady && plantNumber + 1 
      .catch(err => console.error(`error fetching card status ${err}`))
  }, [plantNumber, sePlantsNa]) //? not sure if i need these 2 dependencies

  React.useEffect(() => {
    function handleCardFlip(e: KeyboardEvent): void {
      if (e.code === "Space" || e.key === " ") {
        setcardFlipped(prevSpace => !prevSpace)
      }
    }
    document.addEventListener("keydown", handleCardFlip);

    return () => {
      document.removeEventListener("keydown", handleCardFlip)
    }
  }, [])

  React.useEffect(() => {
    function handleArrow(e: KeyboardEvent): void {
      if (e.code === "ArrowLeft") {
        setArrows(prevArrows => ({
          ...prevArrows, leftArrow: true
        }))
      } else if (e.code === "ArrowRight") {
        setArrows(prevArrows => ({
          ...prevArrows, rightArrow: true
        }))
      }
    }
    document.addEventListener("keydown", handleArrow);

    return () => {
      document.removeEventListener("keydown", handleArrow);
    }
  }, [])

  React.useEffect(() => {
    if (arrows.leftArrow) {
      handleUnknownCard();
      setArrows(prevArrows => ({ ...prevArrows, leftArrow: false }))
    } else if (arrows.rightArrow) {
      handleKnownCard();
      setArrows(prevArrows => ({ ...prevArrows, rightArrow: false }))
    }
  }, [arrows])

  if (loading) {
    return <h1>App is loading</h1>
  }

  if (!sePlantsNa || sePlantsNa.length < 1) {
    return <h1>Cannot find data</h1>
  }

  function checkSignedIn() {
    setdisplayUser(currentUser?.username)
    console.log(`current user is ${JSON.stringify(currentUser)}`)
  }

  function handleKnownCard(): void { //todo On fetch set authroization token here 
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
  }

  function flipCard(): void {
    setcardFlipped(!cardFlipped)
  }

  return (
    <>
      <Navbar />
      <p>Welcome to flora</p>
      <button onClick={checkSignedIn}>Check logged in status</button>
      <button onClick={() => AuthService.logout()}>Logout</button>
      {displayUser && <h2>Your username is {displayUser}</h2>}
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

    </>
  )
}

export default Home
