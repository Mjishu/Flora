import React from 'react'
import '../App.css'
import { Card, ReverseCard } from '../components/general/Card';
import Navbar from '../components/general/Navbar';
import { UseUser } from "../components/user/userContext"
import { Link } from 'react-router-dom';
import style from "../styles/flash-card-holder.module.css"

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
  const { currentUser, userLoading } = UseUser();
  const [sePlantsNa, setsePlantsNa] = React.useState<Tree[] | null>(null);
  const [plantNumber, setPlantNumber] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(true);
  const [cardFlipped, setcardFlipped] = React.useState<boolean>(false);
  const [cardAnswered, setCardAnswered] = React.useState<boolean>(false);
  const [direction, setDirection] = React.useState<string | undefined>(undefined)


  React.useEffect(() => {
    getReadyCards()
    setPlantNumber(0)
    setCardAnswered(false)
  }, [cardAnswered])

  React.useEffect(() => { console.log(`new plant is ${sePlantsNa}`) }, [cardAnswered])

  const flipCard = React.useCallback(() => {
    setcardFlipped(!cardFlipped)
  }, [cardFlipped])

  const handleKnownCard = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token === null) {
        console.error("token does not exist");
        return;
      }

      if (!sePlantsNa) { return console.error("issue with plants", sePlantsNa) }

      const fetchParams = {
        method: "post",
        headers:
        {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ card_id: sePlantsNa[plantNumber].id, seen: true })
      }

      await fetch("/api/cards/known", fetchParams)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(`error sending card back: ${err}`))

      // setPlantNumber((prevNumber: number) => prevNumber + 1);

      setcardFlipped(false);
      setDirection("right");
      setCardAnswered(true);
    } catch {
      return console.error("Could not fetch cards known")
    }
  }, [sePlantsNa])

  const handleUnknownCard = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("unknown called")

      if (token == null) {
        console.error("Token does not exist");
        return;
      }

      if (!sePlantsNa) { return console.error("issue with plants", sePlantsNa) }

      const fetchParams = {
        method: "post",
        headers:
        {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ card_id: sePlantsNa[plantNumber].id, seen: false })
      }
      await fetch("/api/cards/unknown", fetchParams)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(`error sending card back: ${err}`))

      // setPlantNumber((prevNumber: number) => prevNumber + 1);
      // if (plantNumber >= sePlantsNa.length - 1) {
      //   setPlantNumber(0)
      // }
      setcardFlipped(false);
      setCardAnswered(true);
      setDirection("left")
    } catch {
      return console.error("Could not send card to unknown")
    }

  }, [sePlantsNa])

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
  }, [cardFlipped, plantNumber, handleKnownCard, handleUnknownCard, flipCard])

  async function getReadyCards() {
    const token = localStorage.getItem("token")
    if (!token) { return console.log("You are not logged in") }

    await fetch("/api/plants/na/south-east", { method: "GET", headers: { Authorization: token } }) //*I need this to get recalled I think on every card flip, but right now its i + 1
      //* since i added cardFlipped as dependency, I think that this executes before it makes the api call for the known or unknown call
      .then(res => res.json()).then(data => {
        setsePlantsNa(data[0])
        setLoading(false)
      }).catch(err => console.error(`error fetching plants: ${err}`))
  }

  if (userLoading || loading) {
    return <h1>App is loading</h1>
  }

  if (!sePlantsNa) {
    return <h1>Cannot find data</h1>
  }

  return (
    <div >
      <Navbar />
      <div className={style.content}>

        {/* <h1>Plants</h1> */}
        <div className={style.card_board}>

          {
            sePlantsNa.length < 1 ? ( //* this currently solves the issue for no more cards, but this isn't very fool proof. It should just be < 1 and not needing <=
              <h3>You have no more cards!</h3>
            ) : !cardFlipped ? (
              <Card
                plantNumber={plantNumber}
                setPlantNumber={setPlantNumber}
                common_name={sePlantsNa[plantNumber].common_name}
                image={sePlantsNa[plantNumber].image_url}
                plantsLength={sePlantsNa.length}
                handleKnown={handleKnownCard}
                handleUnknown={handleUnknownCard}
                cardFlipped={flipCard}
                cardDirection={direction}
              />
            ) : (
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


