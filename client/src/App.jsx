import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './Components/Header.jsx'
import PrivateRoute from './Components/privateRoute.jsx'
import CreateListing from './pages/CreateListing.jsx'

const App = () => {
  return (
  <BrowserRouter>
     <Header/>
   <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/about' element={<About/>}/>
    <Route path='/sign-in' element={<Signin/>}/>
    <Route path='/sign-up' element={<Signup/>}/>
    <Route element={<PrivateRoute/>}>
    <Route path='/profile' element={<Profile/>}/>
    <Route path='/create-listing' element={<CreateListing/>}/>
    </Route>
   </Routes>
  </BrowserRouter>
  )
}

export default App
