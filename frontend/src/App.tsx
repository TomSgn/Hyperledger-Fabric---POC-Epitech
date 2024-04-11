import React from 'react';
import Topbar from './components/Navbar/Navbar';
import Card from "./components/Quotes/Card";
import Shop from './components/Shop/Shop';
import Products from '../public/product.json';  // Adjusted import path

function App() {
  return (
    <div>
      <Topbar />
      <div className='mt-40 flex flex-row'> 
          <Shop products={Products} />  
          <Card/>
      </div>
    </div>
  );
}

export default App;
