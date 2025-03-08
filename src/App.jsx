import React from 'react'
import { Routes, Route } from 'react-router'
import CitiesScreen from './pages/CitiesScreen'
import CityDetailScreen from './pages/CityDetailScreen'

function App() {

  return (
    <Routes>
      <Route path="/">
        <Route index element={<CitiesScreen />} />
        <Route path="detail/:city" element={<CityDetailScreen />} />
      </Route>
    </Routes>
  )
}

export default App
