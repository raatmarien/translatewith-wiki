import './ArticlePossibilities.scss';

import React from 'react';
import Card from 'react-bootstrap/Card';
import {Page} from './WikiApi';
import List from 'react-list-select'


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
    if (this.props.articles && this.props.articles.length > 0) {
      let listItems = [];
      for (let i = 0; i < this.props.articles.length; i++) {
        listItems.push(this.props.articles[i].title);
      }
      return listItems;
    }
    return [];
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
              <List
                items={this.getListItems()}
                selected={this.props.selected}
                multiple={false}
                onChange={this.props.onChange}
                />
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
