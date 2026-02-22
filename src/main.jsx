import { createRoot } from 'react-dom/client'
import './index.css'
import Routers from './Components/RouterComponents/Routers.jsx'
import Context from './Components/Context.jsx'

createRoot(document.getElementById('root')).render(
  <Context>
    <Routers/>
  </Context>
)
