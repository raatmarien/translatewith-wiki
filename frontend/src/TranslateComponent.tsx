import React from 'react';
import {LanguageSelector, Language} from './LanguageSelector';
import TermInput from './TermInput';
import TranslateOutput from './TranslateOutput';
import TranslateButton from './TranslateButton';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface Props {
}

interface State {
  inputTerm: string;
  inputLanguage: Language;
  outputLanguage: Language;
  outputInfo?: PageInfo;
}

export interface PageInfo {
  title: string;
  snippet: string;
  url: string;
  redirects: string[];
}

const baseOptions = '?format=json&utf8=1&origin=*';

const getRedirects = function
(apiUrl : string,
 title : string) : Promise<string[]> {
   let options = baseOptions + '&action=query&prop=redirects&titles=' + title;
   return fetch(apiUrl + options)
     .then(res => res.json())
     .then(data => {
       let page = unwrapPages(data);
       let rs = page.redirects;
       let redirects = [];
       for (let i = 0; i < rs.length; i++) {
         redirects.push(rs[i].title);
       }
       return redirects;
     });
 };

const getPageInfo =
  function (wikiUrl : string, search : string) : Promise<PageInfo> {
    // https://www.mediawiki.org/wiki/API:Search
    let apiUrl = wikiUrl + '/w/api.php';
    let options = baseOptions + '&action=query&list=search';
    return fetch(apiUrl + options + '&srsearch=' + search)
      .then(res => res.json())
      .then(data => {
        let search = data['query']['search'];
        return {
          title: search[0].title,
          snippet: search[0].snippet,
          url: wikiUrl + '/wiki/' + search[0].title,
        };
      })
      .then(pageInfo => {
        return getRedirects(apiUrl, pageInfo.title)
          .then(redirects => {
            return {
              title: pageInfo.title,
              snippet: pageInfo.snippet,
              url: pageInfo.url,
              redirects: redirects
            };
          });
      });
  };

const unwrapPages = function(data : any) {
  let pages = data.query.pages;
  let pageId = Object.keys(pages)[0];
  return pages[pageId];
}

const getDifferentLangTitle = function
(wikiUrl : string,
 title : string,
 outLang : string) : Promise<string> {
   // https://www.mediawiki.org/wiki/API:Langlinks
   let options = baseOptions + '&action=query&prop=langlinks&lllang=' + outLang;
   let apiUrl = wikiUrl + '/w/api.php';
   return fetch(apiUrl + options + '&titles=' + title + '&llang=' + outLang)
     .then(res => res.json())
     .then(data => {
       console.log(unwrapPages(data));
       let langlinks = unwrapPages(data).langlinks;
       for (let i = 0; i < langlinks.length; i++) {
         if (langlinks[i].lang === outLang) {
           return langlinks[i]['*'];
         }
       }
     });
 };

const wikiTranslate = function
(inLang : string,
 term : string,
 outLang : string) : Promise<PageInfo> {
   let inApiUrl = 'https://' + inLang + '.wikipedia.org';
   let outApiUrl = 'https://' + outLang + '.wikipedia.org';
   return getPageInfo(inApiUrl, term)
     .then(pageInfo => {
       return getDifferentLangTitle(inApiUrl, pageInfo.title, outLang);
     })
     .then(translation => {
       return getPageInfo(outApiUrl, translation);
     });
 };

class TranslateComponent extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = {
      inputTerm: '',
      inputLanguage: {value: 'nl', label: 'Dutch'},
      outputLanguage: {value: 'en', label: 'English'},
      outputInfo: undefined,
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

  translate() {
    this.getOutputInfo()
      .then(outputInfo => this.setState({
        outputInfo: outputInfo
      }))
      .catch(error => console.log(error));;
  }

  getOutputInfo() {
    return wikiTranslate(
      this.state.inputLanguage.value,
      this.state.inputTerm,
      this.state.outputLanguage.value);
  }

  render() {
    let cardStyle = {width: '35rem'};
    return (
      <div className="translate-component">
        <Row>
          <Col>
            <Card style={cardStyle} className="mb-3" body>
              <Card.Title>Translate a concept or term from</Card.Title>

              <LanguageSelector
                language={this.state.inputLanguage}
                onChange={this.setInputLanguage.bind(this)}
              />
              <div className="mb-3 mt-3">
                <TermInput
                  value={this.state.inputTerm}
                  onChange={this.setInputTerm.bind(this)}
                />
              </div>
              <TranslateButton
                onClick={this.translate.bind(this)}
              />
            </Card>
          </Col>

          <Col>
            <Card style={cardStyle} className="mb-3">
              <Card.Header>
                <Card.Title>Translation to</Card.Title>
                <LanguageSelector
                  language={this.state.outputLanguage}
                  onChange={this.setOutputLanguage.bind(this)}
                />
              </Card.Header>
              <Card.Body>
                <TranslateOutput
                  info={this.state.outputInfo}
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
