import React from 'react'
import './App.css'
import { Card, ReverseCard } from './components/Card';
import Navbar from './components/Navbar';
import authService from './auth/authService';

const AuthService = new authService();
interface Tree {
  id: number;
  image_url: string;
  common_name: string;
  scientific_name: string;
  genus: string;
  family: string;
  description: string;
}

function Home() {
  const [sePlantsNa, setsePlantsNa] = React.useState<Tree[] | null>(null);
  const [plantNumber, setPlantNumber] = React.useState(0)
  const [loggedIn, setLoggedIn] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [cardFlipped, setcardFlipped] = React.useState(false);
  const [cardKnown, setCardKnown] = React.useState(false);
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

  React.useEffect(() => {
    if (!sePlantsNa) { return }
    console.log(`The plant number is: ${plantNumber}`)
    console.log(sePlantsNa[plantNumber])
  }, [plantNumber])


  if (loading) {
    return <h1>App is loading</h1>
  }

  if (!sePlantsNa || sePlantsNa.length < 1) {
    return <h1>Cannot find data</h1>
  }

  function checkSignedIn() {
    const token = localStorage.getItem("token");
    if (token == null) {
      console.error("token does not exist")
      return
    }
    const fetchParams = {
      method: "GET",
      headers: {
        "Authorization": token
      }
    }
    fetch("/api/users/protected", fetchParams)
      .then(res => res.json())
      .then(data => data.success && setLoggedIn(data.message))
      .catch(err => console.error(`Error fetching protected route ${err}`))
  }

  function handleKnownCard(): void {
    if (!sePlantsNa) { return }
    const fetchParams = {
      method: "post", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plantName: sePlantsNa[plantNumber].common_name, seen: true })
    }
    fetch("/api/cards/know", fetchParams)
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
    if (!sePlantsNa) { return }
    const fetchParams = {
      method: "post", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plantName: sePlantsNa[plantNumber].common_name, seen: false })
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
      <h2>{loggedIn}</h2>
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
        />
      }

    </>
  )
}

export default Home
