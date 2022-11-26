class TermController extends HtmlManipulatorController
{
  constructor(termsConfig)
  {
    super();

    this.buildTable(termsConfig);
    this.createFileSaveEventListener();
  }

  /**
   * Constrói a tabela de termos
   * @param Object termsConfig
   */
  async buildTable(termsConfig)
  {
    const files = [];
    const headers = [];

    for (const termConfig of termsConfig) {
      const header = this.buildTableColumnsHeader(termConfig.language);
      headers.push(header);

      const file = await this.loadFiles(termConfig.file);
      files.push(file);
    }

    this.createLine(headers, files, this.getIndexes(files[0]));
  }

  /**
   * Cria as linhas da tabela
   * @param Array headers
   * @param Array files
   * @param Array indexes
   */
  async createLine(headers, files, indexes)
  {
    const termsLines = [];

    for (let index of indexes) {
      let objLine = {index, terms: []}
      for (let file of files) {
        objLine.terms.push(file[index])
      }

      termsLines.push(objLine);
    }

    this.buildTableHeader(headers);
    this.buildTableLine(termsLines);
  }

  /**
   * Retorna os indices dos termos
   * @param Object obj
   * @return Number[]
   */
  getIndexes(obj)
  {
    return Object.keys(obj);
  }
}