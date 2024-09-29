import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import { GameStateProvider } from './state/GameState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<GameStateProvider>
		<App/>
	</GameStateProvider>
);