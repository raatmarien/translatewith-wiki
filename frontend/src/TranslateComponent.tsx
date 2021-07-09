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

class TranslateComponent extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = {
      inputTerm: '',
      inputLanguage: 'German',
      outputLanguage: 'English',
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
    this.setState({
      outputTerm: this.getOutputTerm()
    });
  }

  getOutputTerm() {
    return this.state.inputTerm;
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
