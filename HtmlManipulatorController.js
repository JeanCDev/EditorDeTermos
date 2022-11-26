class HtmlManipulatorController extends FileManipulatorController
{
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
      column.innerHTML = term;

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

    return column;
  }

  /**
   * Cria o evento que será executado ao clicar em salvar na tela de inclusão do termo
   * @return void
   */
  createFileSaveEventListener()
  {
    const create = document.getElementById('create');
    const textBox = document.getElementById('textbox');
    this.makeTextFile(textBox.value);

    create.addEventListener('click', () => {
      const link = document.createElement('a');
      link.setAttribute('download', 'info.json');
      link.href = this.getTextFile();

      document.body.appendChild(link);

      // Espera o link ser adicionado ao documento
      window.requestAnimationFrame(function () {
        var event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
      });

    }, false);
  }
}