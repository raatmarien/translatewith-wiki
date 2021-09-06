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
            </Card.Body>
          </Card>
        </div>
      </Row>);
  }
}

export default ExplanationComponent;
