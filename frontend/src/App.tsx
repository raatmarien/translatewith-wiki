import React from 'react';
import './App.css';
import TranslateComponent from './TranslateComponent';

function App() {
  return (
    <div className="App">
      <TranslateComponent
        output="Hallo wereld!"
      />
    </div>
  );
}

export default App;
