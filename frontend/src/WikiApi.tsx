import Language from './Language';
import {languages, top50Languages} from './LanguageList';

export interface Page {
  title: string;
  snippet: string;
  url: string;
  languages: Language[];
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

  private getImage(apiUrl : string, title : string, small?: boolean) : Promise<string> {
    // https://www.mediawiki.org/wiki/Extension:PageImages
    let options = this.baseOptions 
                + '&action=query&prop=pageimages&piprop=thumbnail'
                + '&pithumbsize=' + (small ? 58 : 500)
                + '&titles=' + title;
    return fetch(apiUrl + options)
      .then(res => res.json())
      .then(data => {
        let page = this.unwrapPages(data);
        if (page && page.thumbnail) {
          return page.thumbnail.source;
        }
        return '';
      });
   };

  private normalizeTitle(title : String) : string {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  private getLanguageSites() : string {
    let sites = top50Languages.map(l => l.value + 'wiki');
    let str = '';
    for (let i = 0; i < sites.length - 1; i++) {
      str += sites[i] + '|';
    }
    str += sites[sites.length - 1];
    return str;
  }

  private searchPagesAutoLanguage(search : string) : Promise<Page[]> {
    let findDescription = function(descriptions : any,
                                   languages : Language[]) : string {
      for (let i = 0; i < languages.length; i++) {
        if (descriptions[languages[i].value]) {
          return descriptions[languages[i].value].value;
        }
      }
      return '';
    }

    let apiUrl = 'https://www.wikidata.org/w/api.php';
    let normalizedTitle = this.normalizeTitle(search)
    let options = this.baseOptions + '&action=wbgetentities&props=sitelinks|descriptions'
                + '&sites=' + this.getLanguageSites()
                + '&titles=' + normalizedTitle;
    return fetch(apiUrl + options)
      .then(res => res.json())
      .then(data => {
        let keys = Object.keys(data.entities);
        let pages = []
        for (let i = 0; i < keys.length; i++) {
          let articleLinks = data.entities[keys[i]].sitelinks;
          if (articleLinks) {
            let wikis = Object.keys(articleLinks);
            let articleLanguages = []
            for (let j = 0; j < wikis.length; j++) {
              let article = articleLinks[wikis[j]];
              if (article.title === normalizedTitle) {
                let languageCode = article.site.replace('wiki', '');
                let language = languages.find(l => l.value === languageCode);
                if (language) articleLanguages.push(language);
              }
            }
            if (articleLanguages.length > 0) {
              pages.push({
                title: normalizedTitle,
                snippet: findDescription(
                  data.entities[keys[i]].descriptions,
                  articleLanguages),
                url: '',
                languages: articleLanguages,
              });
            }
          }
        }
        return pages;
      });
  }

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
            languages: [language],
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
    return this.getImage(apiUrl, title)
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
                + '&action=query&prop=langlinks&lllimit=500';
    let apiUrl = wikiUrl + '/w/api.php';
    return fetch(apiUrl + options + '&titles=' + title)
      .then(res => res.json())
      .then(data => {
        let languageTitles = [];
        let langlinks = this.unwrapPages(data).langlinks;
        for (let i = 0; langlinks && i < langlinks.length; i++) {
          let link = langlinks[i];
          let language = languages.find(l => l.value === link.lang);
          if (language) {
            languageTitles.push({
              language: language,
              title: link['*'],
            });
          }
        }
        return languageTitles;
      });
  };

  public findTermOptions(lang : Language, term : string) : Promise<any> {
    if (lang.value === 'auto') {
      return this.searchPagesAutoLanguage(term)
                 .then(pages => this.setState({articlePossibilities: pages}));
    } else {
      return this.searchPages(lang, term)
                 .then(pages => {
                   this.setState({articlePossibilities: pages});
                 });
    }
  }
  
  public wikiTranslate(inLang : Language, title : string, outLang : Language)
  : Promise<any> {
    if (inLang.value === outLang.value) {
      this.setState({outputTitle: title});
      return this.getExtraPageInfo(outLang, title);
    }

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

  private findThumbnailForPage(
    page: Page,
    callback: (p : Page) => void) {
    let wikiUrl = 'https://' + page.languages[0].value + '.wikipedia.org';
    let apiUrl = wikiUrl + '/w/api.php';
    return this.getImage(apiUrl, page.title, true)
      .then(imageUrl => {
        page.imageUrl = imageUrl;
        callback(page);
        return;
      })
      .catch(error => console.log(error));
  }

  public findThumbnailsForPages(
    pages: Page[],
    callback: (p : Page) => void) {
    pages.map(p => this.findThumbnailForPage(p, callback));
  }
}

export default WikiApi;
