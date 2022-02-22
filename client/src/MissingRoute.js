import React from 'react';
import { Navigate } from 'react-router-dom';

const MissingRoute = () => <Navigate to={{pathname: '/login'}}/>

export default MissingRoute;