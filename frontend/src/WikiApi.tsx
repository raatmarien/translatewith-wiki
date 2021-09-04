import Language from './Language';

export interface Page {
  title: string;
  snippet: string;
  url: string;
  language: Language;
  imageUrl?: string;
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
        let redirects = [];
        for (let i = 0; i < rs.length; i++) {
          redirects.push(rs[i].title);
        }
        return redirects;
      });
   };

  private getImage(apiUrl : string, title : string) : Promise<string> {
    let options = this.baseOptions + '&action=query&prop=images&titles=' + title;
    return fetch(apiUrl + options)
      .then(res => res.json())
      .then(data => {
        let page = this.unwrapPages(data);
        let images = page.images;
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

  private getDifferentLangTitle(wikiUrl : string, title : string, outLang : string)
  : Promise<string> {
    // https://www.mediawiki.org/wiki/API:Langlinks
    let options = this.baseOptions
                + '&action=query&prop=langlinks&lllang=' + outLang;
    let apiUrl = wikiUrl + '/w/api.php';
    return fetch(apiUrl + options + '&titles=' + title + '&llang=' + outLang)
      .then(res => res.json())
      .then(data => {
        let langlinks = this.unwrapPages(data).langlinks;
        for (let i = 0; i < langlinks.length; i++) {
          if (langlinks[i].lang === outLang) {
            return langlinks[i]['*'];
          }
        }
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
    return this.getDifferentLangTitle(inApiUrl, title, outLang.value)
               .then(translation => {
                 this.setState({ outputTitle: translation });
                 return this.getExtraPageInfo(outLang, translation);
               });
  };
}

export default WikiApi;
