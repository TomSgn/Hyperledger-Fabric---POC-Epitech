import Topbar from './components/Navbar/Navbar'
import Card from "./components/Quotes/Card";

function App() {
  return (
    <body>
      <Topbar />
      <div className='mt-40 flex-row '>
          <Card/>
          <br />
      </div>
      <div>
      </div>
    </body>
  );
}

export default App
