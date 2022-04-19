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
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
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
          <Alert variant="warning">
            This article isn't translated in your chosen language, but
            it is translated in the languages below. You can
            either select one of these above or select another article.

            <ul>
              {props.languageAlternatives.map(l => (<li key={l.value}>{l.label}</li>))}
            </ul>
          </Alert>
        </div>);
    } else {
      return (
        <div className="translate-output">
          <Alert variant="warning">
            This article isn't translated into any of our languages,
            select another one.
          </Alert>
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
