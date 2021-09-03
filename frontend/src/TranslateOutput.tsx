import React from 'react';
import Card from 'react-bootstrap/Card';


interface Props {
  title?: string;
  url?: string;
  imageUrl?: string;
  snippet?: string;
  redirects?: string[];
}

function getTitle(props: Props) {
  return (<Card.Title><a href={props.url}>{props.title}</a></Card.Title>);
}

function getImage(props: Props) {
  return (<Card.Img variant="top" src={props.imageUrl} />);
}

function getSnippet(props: Props) {
  return (<Card.Text dangerouslySetInnerHTML={createSnippet(props)}></Card.Text>);
}

function getRedirects(props: Props) {
  return props.redirects && (
    <div>
      <b>Redirects:</b>
      <ul>
        {props.redirects.map((rd => (<li key={rd}>{rd}</li>)))}
      </ul>
    </div>);
}

function createSnippet(props : Props) {
  if (props.snippet) {
    return { __html: props.snippet };
  } else {
    return { __html: '' }
  }
}

function TranslateOutput(props: Props) {

  if (props.title || props.imageUrl || props.snippet ||
      (props.redirects && props.redirects.length > 0)) {
    return (
      <div className="translate-output">
        {props.title && getTitle(props)}

        {props.imageUrl && getImage(props)}

        {props.snippet && getSnippet(props)}

        {props.redirects && props.redirects.length > 0 && getRedirects(props)}
      </div>
    );
  } else {
    return (<div className="translate-output">
        <Card.Title>Input some text and press translate</Card.Title>
    </div>);
  }
}

export default TranslateOutput;
