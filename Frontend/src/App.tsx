import {BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Navbar from './components/Navbar'

function App() {
    return (
      <BrowserRouter> 
      <Navbar/>
        <Routes>
          <Route path='/' element ={<Home/>}></Route>
          <Route path='/login' element ={<Login/>}></Route>
          <Route path='/register' element ={<Register/>}></Route>
        </Routes>
      </BrowserRouter>
    )
}

export default App
