import React from 'react';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {WikiApi, Page} from './WikiApi';
import Language from './Language';

import LanguageSelector from './LanguageSelector';
import TermInput from './TermInput';
import TranslateOutput from './TranslateOutput';
import TranslateButton from './TranslateButton';
import { ArticlePossibilities } from './ArticlePossibilities';

interface Props {
}

interface State {
  api: WikiApi;
  oneColumn: boolean;

  inputTerm: string;
  inputLanguage: Language;
  outputLanguage: Language;

  translateStarted: boolean;

  articlePossibilities?: Page[];
  articleSelected: number;

  outputLanguageAlternatives?: Language[];
  
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
      oneColumn: false,
      inputTerm: '',
      inputLanguage: {value: 'nl', label: 'Dutch'},
      outputLanguage: {value: 'en', label: 'English'},
      translateStarted: false,
      articleSelected: 0,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({oneColumn: window.innerWidth < 1200});
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
    this.setState({articleSelected: value}, () => this.translate())
  }

  findOptions() {
    this.setState({
      translateStarted: true,
      articleSelected: 0,

      outputLanguageAlternatives: undefined,
      outputTitle: undefined,
      outputUrl: undefined,
      outputSnippet: undefined,
      outputImageUrl: undefined,
      outputRedirects: undefined,
    });
    
    this.state.api.findTermOptions(
      this.state.inputLanguage,
      this.state.inputTerm)
        .then(() => this.translate())
        .catch(error => console.log(error));
  }

  translate() {
    if (this.state.articlePossibilities &&
        this.state.articlePossibilities.length > this.state.articleSelected) {
      this.setState({
        translateStarted: true,

        outputLanguageAlternatives: undefined,
        outputTitle: undefined,
        outputUrl: undefined,
        outputSnippet: undefined,
        outputImageUrl: undefined,
        outputRedirects: undefined,
      });

      this.state.api.wikiTranslate(
        this.state.inputLanguage,
        this.state.articlePossibilities[this.state.articleSelected].title,
        this.state.outputLanguage)
          .catch(error => console.log(error));
    }
  }

  render() {
    let cardStyle = { minWidth: '20rem', maxWidth: '100%'};
    let possibilities = (
      <ArticlePossibilities
        articles={this.state.articlePossibilities}
        selected={this.state.articleSelected}
        onChange={this.setArticleSelected.bind(this)}
      />);
    return (
      <div className="translate-component">
        <Row>
          <Col>
            {this.state.oneColumn && possibilities}
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
            {!this.state.oneColumn && possibilities}
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
                  languageAlternatives={this.state.outputLanguageAlternatives}
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
