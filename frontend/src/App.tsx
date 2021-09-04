import React from 'react';
import './App.scss';
import TranslateComponent from './TranslateComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <div className="App">
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand>WhatIsItCalled.In</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <TranslateComponent />
      </Container>
    </div>
  );
}

export default App;
