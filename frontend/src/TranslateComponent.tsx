import React from 'react';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {WikiApi, Page} from './WikiApi';

import {LanguageSelector, Language} from './LanguageSelector';
import TermInput from './TermInput';
import TranslateOutput from './TranslateOutput';
import TranslateButton from './TranslateButton';
import { ArticlePossibilities } from './ArticlePossibilities';

interface Props {
}

interface State {
  api: WikiApi;

  inputTerm: string;
  inputLanguage: Language;
  outputLanguage: Language;

  translateStarted: boolean;

  articlePossibilities?: Page[];
  articleSelected: number;

  outputTitle?: string;
  outputUrl?: string;
  outputSnippet?: string;
  outputImageUrl?: string;
  outputRedirects?: string[];
}


class TranslateComponent extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = {
      api: new WikiApi(this.setState.bind(this)),
      inputTerm: '',
      inputLanguage: {value: 'nl', label: 'Dutch'},
      outputLanguage: {value: 'en', label: 'English'},
      translateStarted: false,
      articleSelected: 0,
    };
  }

  setInputLanguage(language : Language) {
    this.setState({inputLanguage: language});
  }

  setOutputLanguage(language : Language) {
    this.setState({outputLanguage: language});
  }

  setInputTerm(value : string) {
    this.setState({inputTerm: value});
  }

  setArticleSelected(value : number) {
    this.setState({articleSelected: value});
  }

  findOptions() {
    this.setState({
      translateStarted: true,
      articleSelected: 0,

      outputTitle: undefined,
      outputUrl: undefined,
      outputSnippet: undefined,
      outputImageUrl: undefined,
      outputRedirects: undefined,
    });
    
    this.state.api.findTermOptions(
      this.state.inputLanguage.value,
      this.state.inputTerm)
    .catch(error => console.log(error));
  }

  render() {
    let cardStyle = { minWidth: '20rem', maxWidth: '100%'};
    return (
      <div className="translate-component">
        <Row>
          <Col>
            <Card style={cardStyle} className="mb-3">
              <Card.Header>
                <Card.Title>Translate a concept or term from</Card.Title>

                <LanguageSelector
                  language={this.state.inputLanguage}
                  onChange={this.setInputLanguage.bind(this)}
                />
              </Card.Header>
              <Card.Body>
                <TermInput
                  value={this.state.inputTerm}
                  onChange={this.setInputTerm.bind(this)}
                />
                <br />
                <TranslateButton
                  onClick={this.findOptions.bind(this)}
                />
              </Card.Body>
            </Card>
            <ArticlePossibilities
              articles={this.state.articlePossibilities}
              selected={this.state.articleSelected}
              onChange={this.setArticleSelected.bind(this)}
            />
          </Col>

          <Col>
            <Card style={cardStyle} className="mb-3">
              <Card.Header>
                <Card.Title>Translate to</Card.Title>
                <LanguageSelector
                  language={this.state.outputLanguage}
                  onChange={this.setOutputLanguage.bind(this)}
                />
              </Card.Header>
              <Card.Body>
                <TranslateOutput
                  title={this.state.outputTitle}
                  url={this.state.outputUrl}
                  imageUrl={this.state.outputImageUrl}
                  snippet={this.state.outputSnippet}
                  redirects={this.state.outputRedirects}
                  
                  translateStarted={this.state.translateStarted}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TranslateComponent;
