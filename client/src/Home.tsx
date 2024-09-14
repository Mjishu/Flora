import React from 'react'
import './App.css'
import { Card, ReverseCard } from './components/Card';
import Navbar from './components/Navbar';
import authService from './auth/authService';

const AuthService = new authService();
interface Tree {
  id: number;
  common_name: string;
  scientific_name: string;
  rank: string;
  family_common_name: string;
  image_url: string;
  genus: string;
  family: string;
}

function Home() {
  const [floridaTrees, setFloridaTrees] = React.useState<Tree[] | null>(null);
  const [plantNumber, setPlantNumber] = React.useState(0)
  const [loggedIn, setLoggedIn] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [spacePressed, setSpacePressed] = React.useState(false);
  const [cardKnown, setCardKnown] = React.useState(false);
  const [arrows, setArrows] = React.useState({
    rightArrow: false,
    leftArrow: false,
  })

  React.useEffect(() => {
    fetch("/api/plants/florida-trees")
      .then(res => res.json())
      .then(data => setFloridaTrees(data))
      .catch(err => console.error(`error fetching florida trees: ${err}`)) //network error?
      .finally(() => setLoading(false))
  }, [])

  React.useEffect(() => {
    function handleCardFlip(e: KeyboardEvent): void {
      if (e.code === "Space" || e.key === " ") {
        setSpacePressed(prevSpace => !prevSpace)
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

  if (!floridaTrees || floridaTrees.length < 1) {
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
    if (!floridaTrees) { return }
    if (plantNumber >= floridaTrees.length - 1) {
      setPlantNumber(0)
    }
    setPlantNumber((prevNumber: number) => prevNumber + 1);
  }

  function handleUnknownCard(): void {
    if (!floridaTrees) { return }
    if (plantNumber >= floridaTrees.length - 1) {
      setPlantNumber(0)
    }
    setPlantNumber((prevNumber: number) => prevNumber + 1);
  }

  return (
    <>
      <Navbar />
      <p>Welcome to flora</p>
      <button onClick={checkSignedIn}>Check logged in status</button>
      <button onClick={() => AuthService.logout()}>Logout</button>
      <h2>{loggedIn}</h2>
      {!spacePressed ? <Card
        plantNumber={plantNumber}
        setPlantNumber={setPlantNumber}
        common_name={floridaTrees[plantNumber].common_name}
        image={floridaTrees[plantNumber].image_url}
        plantsLength={floridaTrees.length}
        handleKnown={handleKnownCard}
        handleUnknown={handleUnknownCard}
      />
        :
        <ReverseCard
          plantNumber={plantNumber}
          setPlantNumber={setPlantNumber}
          common_name={floridaTrees[plantNumber].common_name}
          image={floridaTrees[plantNumber].image_url}
          plantsLength={floridaTrees.length}
          handleKnown={handleKnownCard}
          handleUnknown={handleUnknownCard}
        />
      }

    </>
  )
}

export default Home
