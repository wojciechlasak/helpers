let columnsCollection = [];

class Columns {
  constructor(element) {
    this.element = $(element);
    this.reorder = this.element.data('reorder') || false;
    this.columns = [];
    this.element
      .children('.single-column')
      .map((index, column) => {
        this.columns.push(new SingleColumn(column, this));
      });
    this.sections = [];
    this.element
      .find('.column-section')
      .map((index, section) => {
        this.sections.push(new SingleSection(section, this));
      });
  }

  reposition() {
    this.columns.map(column => {
      column.height = 0;
    });
    if (this.reorder) {
      const orderedSections = this.sections.slice().sort((a, b) => b.scrollItem.height - a.scrollItem.height);
      orderedSections.map(section => {
        const smallestColumn = this.getSmallestColumn();
        section.targetColumn = smallestColumn;
        smallestColumn.height += section.scrollItem.height;
      });
      this.sections.map(section => {
        section.targetColumn.element.append(section.element);
      });
    }
    else {
      let currentColumn = 0;
      const heightSum = this.getCombinedSectionHeight();
      this.sections.map(section => {
        if (this.columns[currentColumn].height + section.scrollItem.height / 2 > heightSum / this.columns.length) {
          if (currentColumn < this.columns.length - 1) currentColumn++;
        }
        this.columns[currentColumn].element.append(section.element);
        this.columns[currentColumn].height += section.scrollItem.height;
      });
    }
  }

  getSmallestColumn() {
    let min = Infinity;
    let minColumn;
    this.columns.map(column => {
      if (column.height < min) {
        min = column.height;
        minColumn = column;
      }
    });
    return minColumn;
  }

  getCombinedSectionHeight() {
    return this.sections.reduce((sum, section) => sum + section.scrollItem.height, 0);
  }
}

class SingleSection {
  constructor(element, parent) {
    this.element = $(element);
    this.parent = parent;
    this.scrollItem = createScrollItem(this.element);
  }
}

class SingleColumn {
  constructor(element, parent) {
    this.element = $(element);
    this.parent = parent;
    this.height = 0;
  }
}

$('.columns-container').map((index, element) => {
  columnsCollection.push(new Columns(element));
});

window.addEventListener('layoutChange', () => {
  columnsCollection.map(columns => columns.reposition());
});
