import React, { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './authentication/AuthProvider';
import './App.css';
import RequireAuthProfile from './authentication/RequireAuthProfile';
import RequireAuth from './authentication/RequireAuth';
import Register from './components/Auth/Register';
import SignIn from './components/Auth/SignIn';
import Suggests from './components/Feed/Suggests/Suggests';
import 'tachyons';
// import MissingRoute from './MissingRoute';
import Feed from './components/Feed/Feed'
import Perfil from './components/Perfil/Perfil';
import Header from './components/Header/Header';
import EditAccount from './components/EditAccount/EditAccount';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<SignIn />} />

            <Route path='/' element={<RequireAuth><Header /></RequireAuth>}>
              <Route path=':username' element={
                <RequireAuthProfile>
                  <div className='app__container'>
                    <Perfil />
                  </div>
                </RequireAuthProfile>
              } />

              <Route path='accounts/edit' element={
                <RequireAuth>
                  <EditAccount />
                </RequireAuth>
              } />

              <Route path='explore/people' element={
                <RequireAuth>
                  <div className='feed_container'>
                    <Suggests />
                  </div>
                </RequireAuth>
              } />

              <Route path='' element={
                <RequireAuth>
                  <Feed />
                </RequireAuth>
              } />
            </Route>

          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default App;
