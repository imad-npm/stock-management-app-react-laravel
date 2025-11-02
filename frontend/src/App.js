import React from 'react';
import 'styles/css/main.css';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from 'routes/ProtectedRoute';
import Layout from 'layouts/Layout';
import {
  publicRoutes,
  routes,
} from "routes/routes";

function App() {
    return (
        <div className="">
            <Routes>
               {/* Public */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Authenticated User */}
      <Route element={<ProtectedRoute/>} >
              <Route element={<Layout />}>

        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        </Route>
      </Route>
            </Routes>
        </div>
    );
}

export default App;
