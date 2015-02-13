angular
  .module('ramaibz')
  .service('ScrollTop', scrollTop);

function scrollTop() {
  var results = {};
  results.scroll = function(div, time, cb) {
    $('html, body').animate({
      scrollTop: $(div).offset().top
    }, time, function(){
      cb && cb();
    });
  }

  return results;
}

angular
  .module('ramaibz')
  .factory('MovePage', movePage);

function movePage(ScrollTop) {
  var res = {};

  res.move = function(scope, elem, attrs, ngModel, onwhat) {
    var pageLength = elem.children().size();
    var page = attrs.setpages; // get template attribute named 'setpages'
    var anim = false;
    var evt;
    ngModel.$setViewValue(0);

    ScrollTop.scroll(page + '0', 0);
    onwhat === 'keydown' ? elem.focus() : ''; // focus the div element to make sliding works
    elem.on(onwhat, function(event) {
      var index = ngModel.$viewValue;

      function apply(getIndex) {
        ScrollTop.scroll(page + getIndex, 700, function() {
          anim = false;
        });
      }

      if(onwhat === 'keydown') { // detect key press
        evt = event.keyCode;
      }

      if(onwhat === 'mousewheel DOMMouseScroll') { // detect mouse scroll
        evt = event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0 ? 38 : 40 ;
      }

      switch(evt) {
        case 38:
          if(!anim && index >= 1) {
            anim = true;
            ngModel.$setViewValue(index - 1);
            apply(ngModel.$viewValue);
          }
          event.preventDefault();
          break;
        case 40:
          if(!anim && index < (pageLength - 1)) {
            anim = true;
            ngModel.$setViewValue(index + 1);
            apply(ngModel.$viewValue);
          }
          event.preventDefault();
          break;
      }
    })
  }

  return res;
}
