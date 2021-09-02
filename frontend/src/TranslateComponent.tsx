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

const wikiTranslate = function async
(inLang : string,
 term : string,
 outLang : string) : Promise<string> {
   let apiUrl = 'https://' + inLang + '.wikipedia.org/w/api.php';
   return findPage(apiUrl, term)
       .then(title => {
         let wikiBaseApi = 'https://www.wikidata.org/w/api.php';
         let options = '?action=wbgetentities&sites=' + inLang + 'wiki&format=json&utf8=1&origin=*';
         return fetch(wikiBaseApi + options + '&titles=' + title);
       })
       .then(res => res.json())
       .then(data => {
         let entities = data['entities'];
         let keys = Object.keys(entities);
         let id = '';
         for (let i = 0; i < keys.length; i++) {
           if (keys[i][0] === 'Q') {
             id = keys[i];
           }
         }
         return data['entities'][id]['labels'][outLang]['value'];
       });
}

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
