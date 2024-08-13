import React from 'react'
import './App.css'
import Card from './components/Card';

interface Tree {
  id: number;
  common_name: string;
  slug: string;
  scientific_name: string;
  rank: string;
  family_common_name: string;
  genus_id: number;
  image_url: string;
  genus: string;
  family: string;
  [key: string]: any;
}

function Home() {
  const [floridaTrees, setFloridaTrees] = React.useState<Tree[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  //const trefleUrl = "https://trefle.io/api/v1/";

  React.useEffect(() => {
    //const url = `${trefleUrl}/plants?token=${import.meta.env.VITE_TREFLE_TOKEN}&filter[distribution]=florida&filter[plant_type]=tree`//url is ok when pasted to browser but it not calling
    fetch("/api/meow")
      .then(res => res.json())
      .then(data => setFloridaTrees(data))
      .catch(err => console.error(`error fetching florida trees: ${err}`)) //network error?
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <h1>App is loading</h1>
  }
  if (floridaTrees) {
    console.log(floridaTrees.length)
  } else {
    console.log("No trees")
  }

  return (
    <>
      <p>Welcome to flora</p>
      <Card cardName="white shrub" image="" description='Shrub of the white variety, takes multiple forms, most common is skully bunally' />
    </>
  )
}

export default Home
