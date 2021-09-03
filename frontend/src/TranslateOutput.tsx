import React from 'react';
import { PageInfo } from './TranslateComponent';
import Card from 'react-bootstrap/Card';


interface Props {
  info?: PageInfo
}

function TranslateOutput(props: Props) {
  let createSnippet = function() {
    if (props.info) {
      return { __html: props.info.snippet };
    } else {
      return { __html: '' }
    }
  }

  if (props.info) {
    return (
      <div className="translate-output">
        <Card.Title><a href={props.info.url}>{props.info.title}</a></Card.Title>

        {props.info.imageUrl && (
           <Card.Img variant="top" src={props.info.imageUrl} />)
        }

        <Card.Text><div dangerouslySetInnerHTML={createSnippet()} /></Card.Text>

        <b>Redirects:</b>
        <ul>
          {props.info.redirects.map((rd => (<li key={rd}>{rd}</li>)))}
        </ul>
      </div>
    );
  } else {
    return (<div className="translate-output"></div>);
  }
}

export default TranslateOutput;
