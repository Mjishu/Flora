import React from 'react'
import './App.css'
import Card from './components/Card';
import Navbar from './components/Navbar';

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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/plants/florida-trees")
      .then(res => res.json())
      .then(data => setFloridaTrees(data))
      .catch(err => console.error(`error fetching florida trees: ${err}`)) //network error?
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <h1>App is loading</h1>
  }



  return (
    <>
      <Navbar />
      <p>Welcome to flora</p>
      {floridaTrees && <Card
        plantNumber={plantNumber}
        setPlantNumber={setPlantNumber}
        common_name={floridaTrees[plantNumber].common_name}
        image={floridaTrees[plantNumber].image_url}
        plantsLength={floridaTrees.length}
      />}
    </>
  )
}

export default Home
