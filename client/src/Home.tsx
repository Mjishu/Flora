import React from 'react'
import './App.css'
import Card from './components/Card';

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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/florida-trees")
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

  const mappedTrees = floridaTrees?.map(tree => {
    return (
      <div key={tree.id}>
        <Card
          common_name={tree.common_name}
          image={tree.image_url}
        />
      </div>

    )
  })

  return (
    <>
      <p>Welcome to flora</p>
      {mappedTrees}
    </>
  )
}

export default Home
