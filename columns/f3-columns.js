(function() {
  let offerArray = [];
  $('.offer-single-container').map(function() {
    offerArray.push(new (function(value) {
      this.resize = function() {
        this.offerSinglesArray.map(function() {
          this.h = this.t.height();
        });
        this.h = 0;
        for (let item of this.offerSinglesArray) {
          this.h += item.h;
        }

        let flag = false;
        let sum = 0;
        for (let item of this.offerSinglesArray) {
          if (flag) {
            if (item.column !== 1) {
              $(value)
                .find('.offer-single-container-column2')
                .append(item.t);

              item.column = 1;
            }
          }
          else {
            if (item.column !== 0) {
              $(value)
                .find('.offer-single-container-column1')
                .append(item.t);

              item.column = 0;
            }
          }
          sum += item.h;
          if (!flag && sum > this.h / 2) {
            flag = true;
          }
        }
      };
      this.offerSinglesArray = $(value)
        .find('.offer-single')
        .map(function() {
          return {
            t: $(this),
            h: 0,
            column: 0,
          };
        });
    })(this));
  });

  window.addEventListener('layoutChange', function() {
    offerArray.map(function(value) {
      value.resize();
    });
  });
})();
