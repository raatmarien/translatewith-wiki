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

  translateStarted: boolean;

  outputTitle?: string;
  outputUrl?: string;
  outputSnippet?: string;
  outputImageUrl?: string;
  outputRedirects?: string[];
}

interface Page {
  title: string;
  snippet: string;
  url: string;
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

const getImage = function
(apiUrl : string,
 title : string) : Promise<string> {
   let options = baseOptions + '&action=query&prop=images&titles=' + title;
   return fetch(apiUrl + options)
     .then(res => res.json())
     .then(data => {
       let page = unwrapPages(data);
       let images = page.images;
       if (images.length > 0) {
         let options = baseOptions + '&action=query&prop=imageinfo&iiprop=url&titles=' + images[0].title;
         return fetch(apiUrl + options)
           .then(res => res.json())
           .then(data => {
             let page = unwrapPages(data);
             return page.imageinfo[0].url;
           });
       }
       return ''
     });
 };

const searchPage =
  function(wikiUrl : string, search : string)
  : Promise<Page> {
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
      });
  };

const getExtraPageInfo =
  function (wikiUrl : string, title : string, setState : any) {
    let apiUrl = wikiUrl + '/w/api.php';
    searchPage(wikiUrl, title)
      .then(page => {
        setState({
          outputTitle: page.title,
          outputUrl: page.url,
          outputSnippet: page.snippet,
        });
      });
    getRedirects(apiUrl, title)
      .then(redirects => {
        setState({outputRedirects: redirects});
      });
    getImage(apiUrl, title)
      .then(imageUrl => {
        setState({outputImageUrl: imageUrl});
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
 outLang : string,
 setState : any) : Promise<any> {
   let inApiUrl = 'https://' + inLang + '.wikipedia.org';
   let outApiUrl = 'https://' + outLang + '.wikipedia.org';
   return searchPage(inApiUrl, term)
     .then(page => {
       return getDifferentLangTitle(inApiUrl, page.title, outLang);
     })
     .then(translation => {
       setState({ outputTitle: translation });
       return getExtraPageInfo(outApiUrl, translation, setState);
     });
 };

class TranslateComponent extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = {
      inputTerm: '',
      inputLanguage: {value: 'nl', label: 'Dutch'},
      outputLanguage: {value: 'en', label: 'English'},
      translateStarted: false,
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
    this.setState({
      translateStarted: true,
      outputTitle: undefined,
      outputUrl: undefined,
      outputSnippet: undefined,
      outputImageUrl: undefined,
      outputRedirects: undefined,
    });
    return wikiTranslate(
      this.state.inputLanguage.value,
      this.state.inputTerm,
      this.state.outputLanguage.value,
      this.setState.bind(this))
      .catch(error => console.log(error));;
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
                  onClick={this.translate.bind(this)}
                />
              </Card.Body>
            </Card>
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
