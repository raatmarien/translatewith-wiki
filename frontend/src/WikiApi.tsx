import {Language, languages} from './Language';

export interface Page {
  title: string;
  snippet: string;
  url: string;
  language: Language;
  imageUrl?: string;
}

interface LanguageTitle {
  language: Language;
  title: string;
}

export class WikiApi {
  setState : any;
  baseOptions: string;

  constructor(setState : any) {
    this.setState = setState;
    this.baseOptions = '?format=json&utf8=1&origin=*';
  }

  private getRedirects(apiUrl : string, title : string) : Promise<string[]> {
    let options = this.baseOptions
                + '&action=query&prop=redirects&titles=' + title;
    return fetch(apiUrl + options)
      .then(res => res.json())
      .then(data => {
        let page = this.unwrapPages(data);
        let rs = page.redirects;
        if (rs) {
          let redirects = [];
          for (let i = 0; i < rs.length; i++) {
            redirects.push(rs[i].title);
          }
          return redirects;
        }
        return [];
      });
   };

  private notStandardImage(image : any) : boolean {
    return image.title !== 'File:Commons-logo.svg';
  }

  private getImage(apiUrl : string, title : string) : Promise<string> {
    let options = this.baseOptions + '&action=query&prop=images&titles=' + title;
    return fetch(apiUrl + options)
      .then(res => res.json())
      .then(data => {
        let page = this.unwrapPages(data);
        let images = page.images.filter(this.notStandardImage);
        if (images.length > 0) {
          let options =
            this.baseOptions
            + '&action=query&prop=imageinfo&iiprop=url&titles='
            + images[0].title;
          return fetch(apiUrl + options)
            .then(res => res.json())
            .then(data => {
              let page = this.unwrapPages(data);
              return page.imageinfo[0].url;
            });
        }
        return ''
      });
   };

  private searchPages(language: Language, search : string) : Promise<Page[]> {
    let wikiUrl = 'https://' + language.value + '.wikipedia.org';
    let apiUrl = wikiUrl + '/w/api.php';
    let options = this.baseOptions + '&action=query&list=search';
    return fetch(apiUrl + options + '&srsearch=' + search)
      .then(res => res.json())
      .then(data => {
        let search = data['query']['search'];
        let pages = [];
        for (let i = 0; i < search.length; i++) {
          pages.push({
            title: search[i].title,
            snippet: search[i].snippet,
            url: wikiUrl + '/wiki/' + search[i].title,
            language: language,
          });
        }
        return pages;
      });
  }

  private searchPage(language : Language, search : string) : Promise<Page> {
    return this.searchPages(language, search)
               .then(pages => pages[0]);
  }

  private getExtraPageInfo(language : Language, title : string) {
    let wikiUrl = 'https://' + language.value + '.wikipedia.org';
    let apiUrl = wikiUrl + '/w/api.php';
    this.searchPage(language, title)
      .then(page => {
        this.setState({
          outputTitle: page.title,
          outputUrl: page.url,
          outputSnippet: page.snippet,
        });
      });
    this.getRedirects(apiUrl, title)
      .then(redirects => {
        this.setState({outputRedirects: redirects});
      });
    this.getImage(apiUrl, title)
      .then(imageUrl => {
        this.setState({outputImageUrl: imageUrl});
      });
  };

  private unwrapPages(data : any) {
    let pages = data.query.pages;
    let pageId = Object.keys(pages)[0];
    return pages[pageId];
  }

  private getDifferentLangTitles(wikiUrl : string, title : string)
  : Promise<LanguageTitle[]> {
    // https://www.mediawiki.org/wiki/API:Langlinks
    let options = this.baseOptions
                + '&action=query&prop=langlinks';
    let apiUrl = wikiUrl + '/w/api.php';
    return fetch(apiUrl + options + '&titles=' + title)
      .then(res => res.json())
      .then(data => {
        let languageTitles = [];
        let langlinks = this.unwrapPages(data).langlinks;
        for (let i = 0; i < langlinks.length; i++) {
          let language = languages.find(l => l.value === langlinks[i].lang);
          if (language) {
            languageTitles.push({
              language: language,
              title: langlinks[i]['*'],
            });
          }
        }
        return languageTitles;
      });
  };

  public findTermOptions(lang : Language, term : string) : Promise<any> {
    return this.searchPages(lang, term)
      .then(pages => {
        this.setState({articlePossibilities: pages});
      });
  }
  
  public wikiTranslate(inLang : Language, title : string, outLang : Language)
  : Promise<any> {
    let inApiUrl = 'https://' + inLang.value + '.wikipedia.org';
    return this.getDifferentLangTitles(inApiUrl, title)
               .then(langTitles => {
                 let correct = langTitles.find(lt => lt.language.value === outLang.value);
                 if (correct) {
                   this.setState({ outputTitle: correct.title });
                   return this.getExtraPageInfo(outLang, correct.title);
                 } else {
                   this.setState({
                     outputLanguageAlternatives
                     : langTitles.map(lt => lt.language)});
                   return undefined;
                 }
               });
  };
}

export default WikiApi;
