import { useState } from 'react'
import './App.css'
import CentipedeGame from './CentipideGame'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <CentipedeGame/>
      </div>
    </>
  )
}

export default App
