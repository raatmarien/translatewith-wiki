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
      inputLanguage: {value: 'auto', label: 'Detect language'},
      outputLanguage: {value: 'en', label: 'English'},
      translateStarted: false,
      articleSelected: 0,
    };
  }

  componentDidMount() {
    const savedInputLanguage = localStorage.getItem('inputLanguage');
    if (savedInputLanguage) {
      this.setState({
        inputLanguage: JSON.parse(savedInputLanguage)
      });
    } 
    const savedOutputLanguage = localStorage.getItem('outputLanguage');
    if (savedOutputLanguage) {
      this.setState({
        outputLanguage: JSON.parse(savedOutputLanguage)
      });
    }

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({oneColumn: window.innerWidth < 1200});
  }

  setInputLanguage(language : Language) {
    localStorage.setItem('inputLanguage', JSON.stringify(language));
    this.setState({inputLanguage: language}, () => {
      if (this.state.translateStarted) {
        this.findOptions();
      }
    });
  }

  setOutputLanguage(language : Language) {
    localStorage.setItem('outputLanguage', JSON.stringify(language));
    this.setState({outputLanguage: language}, () => {
      if (this.state.translateStarted) {
        if (this.state.articlePossibilities) {
          this.translate();
        } else {
          this.findOptions();
        }
      }
    });
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
      articlePossibilities: undefined,

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
        .then(() => {
          this.translate();
          if (this.state.articlePossibilities) {
            this.state.api.findThumbnailsForPages(
              this.state.articlePossibilities,
              this.addImageToArticlePossibility.bind(this));
          }
          return;
        })
        .catch(error => console.log(error));
  }

  addImageToArticlePossibility(page: Page) {
    if (this.state.articlePossibilities) {
      let updatePage = this.state.articlePossibilities
                           .find(p => p.title === page.title
                                 && p.languages[0].value === page.languages[0].value);
      if (updatePage) {
        updatePage.imageUrl = page.imageUrl;
      }
    }
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
        this.state.articlePossibilities[this.state.articleSelected].languages[0],
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
        autoDetectOn={this.state.inputLanguage.value === 'auto'}
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
                  addAuto={true}
                />
              </Card.Header>
              <Card.Body>
                <TermInput
                  value={this.state.inputTerm}
                  onChange={this.setInputTerm.bind(this)}
                  onKeyPress={(e : any) => {
                      if (e.key === 'Enter') {
                        this.findOptions();
                      }
                      return true;
                    }}
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
