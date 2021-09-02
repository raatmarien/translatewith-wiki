import React from 'react';
import { PageInfo } from './TranslateComponent';


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
        <h2>Translation:</h2>
        <a href={props.info.url}>{props.info.title}</a>
        <br />
        <h3>Snippet:</h3>
        <div dangerouslySetInnerHTML={createSnippet()} />

        <br />
        <h3>Redirects:</h3>
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
