import React, { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './authentication/AuthProvider';
import './App.css';
import RequireAuthProfile from './authentication/RequireAuthProfile';
import RequireAuth from './authentication/RequireAuth';
import Register from './components/Auth/Register';
import SignIn from './components/Auth/SignIn';
import 'tachyons';
import MissingRoute from './MissingRoute';
import Perfil from './components/Perfil/Perfil';
import Header from './components/Header/Header';
import EditAccount from './components/EditAccount/EditAccount';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<SignIn/>} />

            <Route path='/:username' element={
              <RequireAuthProfile>
                <Header />
                <div className='app__container'>
                  <Perfil />
                </div>
              </RequireAuthProfile>
            }/>

            <Route path='/accounts/edit' element={
              <RequireAuth>
                <Header />
                <EditAccount/>
              </RequireAuth>
            } />

            <Route path='/' element={<MissingRoute />} />

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
