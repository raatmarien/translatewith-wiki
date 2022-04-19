// TranslateWith.Wiki - A web app to translate terms using Wikipedia
// language links

// Copyright (C) 2022 Marien Raat - mail@marienraat.nl

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import React from 'react';
import './App.scss';
import TranslateComponent from './TranslateComponent';
import ExplanationComponent from './ExplanationComponent';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <div className="App">
      <Navbar variant="light" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand>
            <img
              alt="The logo of TranslateWith.Wiki - two puzzle pieces with different characters"
              src="/img/logo.svg"
              width="80"
              className="d-inline-block align-top"
              />{' '}
            TranslateWith.Wiki</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <TranslateComponent />
        <ExplanationComponent />
      </Container>
      <footer>
        <a href="https://translatewith.wiki">TranslateWith.Wiki</a> is free and open source software!
        Report bugs or contribute at <a href="https://github.com/raatmarien/translatewith-wiki">the Github page</a>
      </footer>
    </div>
  );
}

export default App;
