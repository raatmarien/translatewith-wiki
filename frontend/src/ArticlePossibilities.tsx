import React from 'react';
import Card from 'react-bootstrap/Card';

interface Props {
  articles?: Article[];
};

interface State {
};

export interface Article {
  title: string;
  language: Language;
  imageUrl?: url;
};


export class ArticlePossibilities extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = {};
  }

  render() {
    let cardStyle = { minWidth: '20rem', maxWidth: '100%'};
    if (this.props.articles && this.props.articles.length > 0) {
      return (
        <div className="article-possibilities">
          <Card style={cardStyle} className="mb-3">
            <Card.Header>
              <Card.Title>Did you mean?</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>Something</Card.Text>
            </Card.Body>
          </Card>
        </div>);
    } else if (this.props.articles) {
      return (
        <div className="article-possibilities">
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <Card.Title>No results found</Card.Title>
            </Card.Body>
          </Card>
        </div>);
    } else {
      return (
        <div className="article-possibilities">
        </div>);
    }
  }
}

export default ArticlePossibilities;
