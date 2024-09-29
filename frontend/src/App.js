import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Player from './endpoints/player/Player';
import Observer from './endpoints/observer/Observer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Player/>}></Route>
        <Route path="/observer" element={<Observer/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
