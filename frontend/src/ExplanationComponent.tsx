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

import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

interface Props {
}

interface State {
}

class ExplanationComponent extends React.Component<Props, State> {
  render() {
    let style = {maxWidth: "50rem", marginLeft: "auto", marginRight: "auto"};
    return (
      <Row className="explanation-component" >
        <div style={style}>
          <Card className="mt-3">
            <Card.Header>
              <Card.Title>
                What is this?
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                This website lets you translate complicated concepts between
                languages. It does this by finding corresponding Wikipedia
                articles for you and showing their translations. This often
                gives more accurate results than more general purpose techniques
                like Google Translate and DeepL.
              </Card.Text>

              <Card.Title>
                Why do I need this website?
              </Card.Title>

              <Card.Text>
                Because you want to translate terms accurately between
                languages. And the data contributed by volunteers on
                Wikipedia is the best and most accurate way to get
                these translations. It is possible to get these
                translations on Wikipedia itself, by searching an
                article and selecting a different language. But this
                website makes the process a lot faster and nicer.
              </Card.Text>

              <Card.Title>
                How can I access this quickly?
              </Card.Title>

              <Card.Text>
                Make a bookmark or an app shortcut! On PC simply press
                Ctrl+D or press CMD+D on Mac. On mobile click on the
                settings icon and select "Add to Home screen" or "Add
                page shortcut".
              </Card.Text>

              <Card.Title>
                How does this work?
              </Card.Title>

              <Card.Text>
                Great question! I use 
                the <a href="https://www.mediawiki.org/wiki/API:Main_page">MediaWiki API</a> to
                find the articles related to the term you want to translate. Then I use
                the language links of those articles to grab the right translation. If you
                are curious, read more about the project on <a
                href="https://marienraat.nl/blog/posts/translatewith-wiki/">my
                blog</a>. You can also see the complete source code on <a
                href="https://github.com/raatmarien/translatewith-wiki">Github</a>. There
                you can suggest new features or contribute your own code.
              </Card.Text>

              <Card.Title>
                Who made this?
              </Card.Title>

              <Card.Text>
                <a href="https://translatewith.wiki">TranslateWith.Wiki</a> was made by
                me, Marien! Check out more of my projects on <a
                                                               href="https://marienraat.nl">my
                  website</a> or <a href="https://github.com/raatmarien">my Github</a>.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Row>);
  }
}

export default ExplanationComponent;
