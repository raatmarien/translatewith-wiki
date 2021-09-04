import React from 'react';
import Card from 'react-bootstrap/Card';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Language from "./Language";

interface Props {
  languageAlternatives?: Language[];

  title?: string;
  url?: string;
  imageUrl?: string;
  snippet?: string;
  redirects?: string[];

  translateStarted: boolean;
}

function getTitle(props: Props) {
  return (<Card.Title>{props.title}</Card.Title>);
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
      <b>Other phrases that redirect to the same page:</b>
      <ul>
        {props.redirects.map((rd => (<li key={rd}>{rd}</li>)))}
      </ul>
    </div>);
}

function createSnippet(props : Props) {
  if (props.snippet) {
    return { __html: props.snippet + '... <a target="_blank" href="' + props.url +
                     '">Read more</a>'};
  } else {
    return { __html: '' }
  }
}

function TranslateOutput(props: Props) {
  if (props.languageAlternatives) {
    if (props.languageAlternatives.length > 0) {
      return (
        <div className="translate-output">
          This article isn't translated in your chosen language, but
          it is translated in the languages below. You can
          either select one of these above or select another article.

          <ul>
            {props.languageAlternatives.map(l => (<li key={l.value}>{l.label}</li>))}
          </ul>
        </div>);
    } else {
      return (
        <div className="translate-output">
          This article isn't translated into any of our languages,
          select another one.
        </div>);
    }
  } else if (props.title || props.imageUrl || props.snippet ||
      (props.redirects && props.redirects.length > 0)) {
    return (
      <div className="translate-output">
        {props.title && getTitle(props)}

        {props.imageUrl && getImage(props)}

        {props.snippet && getSnippet(props)}

        {props.redirects && props.redirects.length > 0 && getRedirects(props)}
      </div>
    );
  } else if (props.translateStarted) {
    return (
      <div className="text-center">
        <Loader
          type="TailSpin"
          color="#00BFFF"
          height={60}
          width={60}
        /></div>);
  } else {
    return (<div className="translate-output">
        <Card.Title>Input some text and press translate</Card.Title>
    </div>);
  }
}

export default TranslateOutput;
