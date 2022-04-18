import React from 'react';
import './App.scss';
import TranslateComponent from './TranslateComponent';
import ExplanationComponent from './ExplanationComponent';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <div className="App">
      <Navbar variant="dark" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand>TranslateWith.Wiki</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <TranslateComponent />
        <ExplanationComponent />
      </Container>
    </div>
  );
}

export default App;
