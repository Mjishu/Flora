import React from 'react'
import './App.css'

function App() {
  const [counter,setCounter] = React.useState(0);

  function handleChange(): void{
      setCounter(prevCounter => prevCounter += 1)
  }
  return (
    <>
      <p>Welcome to flora</p>
      <button onClick={handleChange}>Fuck me up</button>
      <h1>I have been hit {counter} times</h1>
    </>
  )
}

export default App
