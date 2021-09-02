import React from 'react';
import LanguageSelector from './LanguageSelector';
import TermInput from './TermInput';
import TranslateOutput from './TranslateOutput';
import TranslateButton from './TranslateButton';

interface Props {
}

interface State {
  inputTerm: string;
  inputLanguage: string;
  outputLanguage: string;
  outputTerm: string;
}

const findPage =
  function (apiUrl : string, search : string) : Promise<string> {
    // https://www.mediawiki.org/wiki/API:Search
    let options = '?action=query&list=search&format=json&utf8=1&origin=*';
    return fetch(apiUrl + options + '&srsearch=' + search)
      .then(res => res.json())
      .then(data => {
        let search = data['query']['search'];
        if (search.length > 0) {
          return search[0]['title'];
        } else {
          return 'Not found';
        }
      });
  };

const getDifferentLangTitle = function
(apiUrl : string,
 title : string,
 outLang : string) : Promise<string> {
   // https://www.mediawiki.org/wiki/API:Langlinks
   let options = '?action=query&prop=langlinks&format=json&utf8=1&lllang=' + outLang + '&origin=*';
   return fetch(apiUrl + options + '&titles=' + title + '&llang=' + outLang)
     .then(res => res.json())
     .then(data => {
       let pages = data.query.pages;
       let pageId = Object.keys(pages)[0];
       let langlinks = pages[pageId].langlinks;
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
 outLang : string) : Promise<string> {
   let apiUrl = 'https://' + inLang + '.wikipedia.org/w/api.php';
   return findPage(apiUrl, term)
       .then(title => {
         return getDifferentLangTitle(apiUrl, title, outLang);
       })
 };

class TranslateComponent extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = {
      inputTerm: '',
      inputLanguage: 'de',
      outputLanguage: 'en',
      outputTerm: ''
    };
  }

  setInputLanguage(language : string) {
    this.setState({inputLanguage: language});
  }

  setOutputLanguage(language : string) {
    this.setState({outputLanguage: language});
  }

  setInputTerm(value : string) {
    this.setState({inputTerm: value});
  }

  translate() {
    this.getOutputTerm()
      .then(outputTerm => this.setState({
        outputTerm: outputTerm
      }))
      .catch(error => console.log(error));;
  }

  getOutputTerm() {
    return wikiTranslate(
      this.state.inputLanguage,
      this.state.inputTerm,
      this.state.outputLanguage);
  }

  render() {
    return (
      <div className="translate-component">
        <LanguageSelector
          language={this.state.inputLanguage}
          onChange={this.setInputLanguage.bind(this)}
        />
        <TermInput
          value={this.state.inputTerm}
          onChange={this.setInputTerm.bind(this)}
        />
        <TranslateButton
          onClick={this.translate.bind(this)}
        />

        <LanguageSelector
          language={this.state.outputLanguage}
          onChange={this.setOutputLanguage.bind(this)}
        />
        <TranslateOutput
          output={this.state.outputTerm}
        />
      </div>
    );
  }
}

export default TranslateComponent;
