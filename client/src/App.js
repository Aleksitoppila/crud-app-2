import { BrowserRouter, Routes, Route } from 'react-router-dom/dist/index.d.mts'
import { Home } from './pages/Home'
import { Projects } from './pages/Projects'
import { UsersManagement } from './pages/Users'
import { ProjectManagement } from './pages/ProjectById'
import { Navbar } from './components/navbar/navbar'
import { Login } from './pages/Login'
import { Logout } from './pages/Logout'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
      <div className="pages">
        <Routes>
          <Route 
          path='/'
          element={<Home />} 
          />
          <Route
          path='/login'
          element={<Login />} 
          />
          <Route 
          path='/logout'
          element={<Logout />} 
          />
          <Route 
          path='/projects'
          element={<Projects />} 
          />
          <Route
          path={'/projects/:id'}
          element={<ProjectManagement />} 
          />
          <Route
          path='/users'
          element={<UsersManagement />} 
          />
        </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App