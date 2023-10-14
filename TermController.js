class TermController
{
  languages = {};
  textFile = null;
  termIndexes = [];
  termConfig = null;

  constructor(termsConfig)
  {
    this.termConfig = termsConfig;

    this.buildTable();
    this.createFileSaveEventListener();
  }

  /**
   * Carrega os arquivos de termos
   * @param string filename
   */
  async loadFiles(filename)
  {
    const file = await fetch(filename);
    const json = await file.json();

    return json;
  }

  /**
   * Gera a url de download do arquivo modificado
   * @param string text
   */
  async makeTextFile(text)
  {
    const filename = `${selectedLanguage.toLowerCase()}.json`
    const file = await this.loadFiles(filename);

    const newIndex = String(Number(Object.keys(file).slice(-1)) + 1);

    if (Number(this.termIndexes.slice(-1)) <= Number(newIndex)) {
      this.termIndexes.push(newIndex);
    }

    file[String(Number(Object.keys(file).slice(-1)) + 1)] = text;

    const data = new Blob([JSON.stringify(file)], {type: 'application/json'});

    if (this.textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    return window.URL.createObjectURL(data);
  }

  /**
   * Constrói a tabela de termos
   */
  async buildTable()
  {
    const files = [];
    const headers = [];

    for (const termConfig of this.termConfig) {
      const header = this.buildTableColumnsHeader(termConfig.language);
      headers.push(header);

      const file = await this.loadFiles(termConfig.file);
      files.push(file);

      this.languages[termConfig.language] = file;
    }

    this.createLine(headers, files, this.getIndexes(files));
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
  getIndexes(languages)
  {
    for (let language of languages) {
      const objectKeys = Object.keys(language);

      if (objectKeys.length > this.termIndexes.length) {
        this.termIndexes = objectKeys;
      }
    }

    return this.termIndexes;
  }

  /**
   * Cria uma linha da tabela de termos
   * @param Array elements
  */
  buildTableLine(elements)
  {
    for (let element of elements) {
      document.getElementById("terms").appendChild(this.buildTableColumns(element));
    }
  }

  /**
   * Cria o header da tabela de termos
   * @param Array elements
   */
  buildTableHeader(elements)
  {
    for (let element of elements) {
      document.getElementById("terms-header").appendChild(element);
    }
  }

  /**
   * Cria uma coluna na tabel de termos
   * @param Object data
   * @return HTMLTableRowElement
   */
  buildTableColumns(data)
  {
    let line = document.createElement('tr');
    let indexCol = document.createElement('td');
    indexCol.innerHTML = data.index;
    line.appendChild(indexCol);

    for (let term of data.terms) {
      let column = document.createElement('td');

      column.innerHTML = term || '';

      line.appendChild(column);
    }

    return line;
  }

  /**
   * Cria uma das colunas do header da tabela de termos
   * @param String data
   * @return HTMLTableCellElement
   */
  buildTableColumnsHeader(data)
  {
    let column = document.createElement('th');
    column.innerHTML = `Termos ${data}`;

    column.addEventListener('click', () => {
      selectedLanguage = data;

      document.getElementById('create').style.display = '';
      document.getElementById('textbox').style.display = '';
      document.getElementById('textbox').placeholder = `Inclua um novo termo para o idioma ${selectedLanguage}`;
    });

    return column;
  }

  /**
   * Cria o evento que será executado ao clicar em salvar na tela de inclusão do termo
   * @return void
   */
  async createFileSaveEventListener()
  {
    const create = document.getElementById('create');
    const textBox = document.getElementById('textbox');

    create.addEventListener('click', async() => {
      const link = document.createElement('a');
      const file = await this.makeTextFile(textBox.value);

      link.setAttribute('download', `${selectedLanguage.toLowerCase()}.json`);
      link.href = file;

      link.click();
    });
  }
}