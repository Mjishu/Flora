import React from 'react'
import '../App.css'
import { Card, ReverseCard } from '../components/general/Card';
import Navbar from '../components/general/Navbar';
import { UseUser } from "../components/user/userContext"
import { Link } from 'react-router-dom';
import style from "../styles/flash-card-holder.module.css"

interface Plant {
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
  const { userLoading } = UseUser();
  const [currentPlant, setcurrentPlant] = React.useState<Plant | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [cardFlipped, setcardFlipped] = React.useState<boolean>(false);
  const [direction, setDirection] = React.useState<string | undefined>(undefined)

  React.useEffect(() => console.log(`current plant: ${currentPlant?.common_name}`), [currentPlant])

  const getReadyCards = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) { return console.log("You are not logged in") }

      const response = await fetch("/api/plants/na/south-east", { method: "GET", headers: { Authorization: token } })
      const data = await response.json();

      if (data && data.length > 0) {
        setcurrentPlant(data[0]);
      } else {
        setcurrentPlant(null);
      }
      setLoading(false)
    } catch {
      console.error("Wasnt able to fetch ready cards")
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    getReadyCards()
  }, [getReadyCards])

  const flipCard = React.useCallback(() => {
    setcardFlipped(!cardFlipped)
  }, [cardFlipped])

  const handleCardAnswer = React.useCallback(async (known: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentPlant) return console.error("cannot answer card");

      const fetchParams = {
        method: "post",
        headers:
        {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ card_id: currentPlant.id, seen: known })
      }


      const response = await fetch(`/api/cards/${known ? "known" : "unknown"}`, fetchParams)

      if (!response.ok) {
        throw new Error(`Http status error: ${response.status}`)
      }

      setcardFlipped(false);
      setDirection(known ? "right" : "left");

      setcurrentPlant(null);

      await getReadyCards()
    } catch {
      return console.error("Could not fetch cards status")
    }
  }, [currentPlant, getReadyCards])

  const handleKnownCard = React.useCallback(async () => handleCardAnswer(true), [handleCardAnswer])
  const handleUnknownCard = React.useCallback(async () => handleCardAnswer(false), [handleCardAnswer])

  React.useEffect(() => { //* checks for user input
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") {
        flipCard();
      } else if (e.code === "ArrowRight") {
        handleKnownCard()
      } else if (e.code === "ArrowLeft") {
        handleUnknownCard()
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    setDirection(undefined)

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKnownCard, handleUnknownCard, flipCard])

  if (userLoading || loading) {
    return <h1>App is loading</h1>
  }


  return (
    <div >
      <Navbar />
      <div className={style.content}>

        {/* <h1>Plants</h1> */}
        <div className={style.card_board}>

          {
            !currentPlant ? (
              <h3>You have no more cards!</h3>
            ) : !cardFlipped ? (
              <Card
                common_name={currentPlant.common_name}
                image={currentPlant.image_url}
                handleKnown={handleKnownCard}
                handleUnknown={handleUnknownCard}
                cardFlipped={flipCard}
                cardDirection={direction}
              />
            ) : (
              <ReverseCard
                common_name={currentPlant.common_name}
                scientific_name={currentPlant.scientific_name}
                genus={currentPlant.genus}
                family={currentPlant.family}
                handleKnown={handleKnownCard}
                handleUnknown={handleUnknownCard}
                cardFlipped={flipCard}
                description={currentPlant.description}
                is_invasive={currentPlant.is_invasive}
                cardDirection={direction}

              />
            )
          }
          <Link to="/quiz">Plant Quiz</Link>
        </div>
      </div>
    </div>
  )
}


