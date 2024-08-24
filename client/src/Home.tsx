import React from 'react'
import './App.css'
import Card from './components/Card';
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

  React.useEffect(() => {
    fetch("/api/plants/florida-trees")
      .then(res => res.json())
      .then(data => setFloridaTrees(data))
      .catch(err => console.error(`error fetching florida trees: ${err}`)) //network error?
      .finally(() => setLoading(false))
  }, [])

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

  if (loading) {
    return <h1>App is loading</h1>
  }

  return (
    <>
      <Navbar />
      <p>Welcome to flora</p>
      <button onClick={checkSignedIn}>Check logged in status</button>
      <button onClick={() => AuthService.logout()}>Logout</button>
      <h2>{loggedIn}</h2>
      {/*floridaTrees && <Card
        plantNumber={plantNumber}
        setPlantNumber={setPlantNumber}
        common_name={floridaTrees[plantNumber].common_name}
        image={floridaTrees[plantNumber].image_url}
        plantsLength={floridaTrees.length}
      />*/}
    </>
  )
}

export default Home
