class FileManipulatorController
{
  textFile = null;

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
    const data = new Blob([text], {type: 'application/json'});

    // Caso esteja substituindo um arquivo já gerado é necessário
    // revogar a url manualmente para evitar memory leaks
    if (this.textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    this.textFile = window.URL.createObjectURL(data);
  }

  getTextFile()
  {
    return this.textFile;
  }
}