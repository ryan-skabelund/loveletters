import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Player from './components/Player';
import Server from './components/Server';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Player/>}></Route>
          <Route path="/server" element={<Server/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
