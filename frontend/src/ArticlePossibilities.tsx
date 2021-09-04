import './ArticlePossibilities.scss';

import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';

import List from 'react-list-select'

import {Page} from './WikiApi';

interface Props {
  articles?: Page[];
  selected: number;
  onChange: (val : number) => void;
};

interface State {
};

export class ArticlePossibilities extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = {};
  }

  getListItems() {
    let getSnippetHtml = function(snippet : string) {
      return { __html: snippet };
    };
    if (this.props.articles && this.props.articles.length > 0) {
      let listItems = [];
      for (let i = 0; i < this.props.articles.length; i++) {
        listItems.push((
          <ListGroup.Item>
            <div>
              {this.props.articles[i].title}
              {this.props.articles[i].languages.map(l => (
                 <Badge key={l.value} className="float-right" bg="secondary">
                   {l.value}
                 </Badge>))}
            </div>

            <div className="snippet small"
              dangerouslySetInnerHTML={getSnippetHtml(this.props.articles[i].snippet)} />
          </ListGroup.Item>
        ));
      }
      return listItems;
    }
    return [];
  }

  render() {
    let cardStyle = { minWidth: '20rem', maxWidth: '40rem'};
    if (this.props.articles && this.props.articles.length > 0) {
      return (
        <div className="article-possibilities">
          <Card style={cardStyle} className="mb-3">
            <Card.Header>
              <Card.Title>Did you mean?</Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <List
                  items={this.getListItems()}
                  selected={[this.props.selected]}
                  multiple={false}
                  onChange={this.props.onChange}
                />
              </ListGroup>
            </Card.Body>
          </Card>
        </div>);
    } else if (this.props.articles) {
      return (
        <div className="article-possibilities">
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <Alert variant="danger">
                No results found, did you select the right language?
              </Alert>
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
