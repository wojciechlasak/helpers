function convert() {
  const input = $('#input').val();
  let svg = input;
  svg = svg.replace(/ {2,}/g, ' ');
  svg = svg.replace(/>( |\r|\n)+/g, '>\r\n');

  // polyline, polygon
  svg = svg.replace(
    /points="([0-9-., ]*)"/g,
    (match, p1) => {
      let first = true;
      let s = p1.replace(/([0-9-.]+), ?([0-9-.]+)/g, (match, p1, p2) => {
        if (first) {
          first = false;
          return `M${p1} ${p2}`;
        }
        return `L${p1} ${p2}`;
      });
      return `d="${s.replace(/[, ]+/g, ' ')}"`;
    }
  );
  svg = svg.replace(/(polyline|polygon)/g, 'path');

  // circle
  svg = svg.replace(/<circle([^>]*\/>)/g, (match, p1) => {
    const cx = parseFloat(match.match(/cx="([0-9.]*)"/)[1]);
    const cy = parseFloat(match.match(/cy="([0-9.]*)"/)[1]);
    const r = parseFloat(match.match(/r="([0-9.]*)"/)[1]);
    p1 = p1.replace(/(cx|cy|r)="[0-9.]*" ?/g, '');
    return `<path d="M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy + r / 1000}"${p1}`;
  });

  // line
  svg = svg.replace(/<line([^>]*\/>)/g, (match, p1) => {
    const x1 = parseFloat(match.match(/x1 ?= ?"([0-9.]*)"/)[1]);
    const x2 = parseFloat(match.match(/x2 ?= ?"([0-9.]*)"/)[1]);
    const y1 = parseFloat(match.match(/y1 ?= ?"([0-9.]*)"/)[1]);
    const y2 = parseFloat(match.match(/y2 ?= ?"([0-9.]*)"/)[1]);
    p1 = p1.replace(/(x1|x2|y1|y2)="[0-9.]*" ?/g, '');
    return `<path d="M${x1} ${y1} L ${x2} ${y2}"${p1}`;
  });

  $('#output').val(svg);
  $('#input-svg').html(input);
  $('#output-svg').html(svg);
}

$('#convert').on('click', convert);
