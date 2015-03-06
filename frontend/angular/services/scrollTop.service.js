angular
  .module('ramaibz')
  .service('ScrollTop', scrollTop);

function scrollTop() {
  var results = {};
  results.scroll = function(div, time, cb) {
    // $('html, body').animate({
    //   scrollTop: $(div).offset().top
    // }, time, function(){
    //   cb && cb();
    // });
  }

  return results;
}

angular
  .module('ramaibz')
  .factory('MovePage', movePage);

function movePage(ScrollTop) {
  var res = {};

  res.move = function(scope, elem, attrs, ngModel, onwhat) {
    var pageLength = elem.children('div.pages').size();
    var page = attrs.setpages; // get template attribute named 'setpages'
    var anim = false;
    var evt;
    ngModel.$setViewValue(0);
    attrs.$set('totalpages', pageLength);
    scope.totalpages = pageLength;

    ScrollTop.scroll(page + '0', 0);
    onwhat === 'keydown' ? elem.focus() : ''; // focus the div element to make sliding works
    elem.on(onwhat, function(event) {
      var index = ngModel.$viewValue;

      function apply(getIndex, slideType) {
        elem.children('div.pages').removeClass('slideUp slideDown isActive isActiveFirst');
        elem.find(page + index).addClass('isActive');
        elem.children(page + getIndex).addClass(slideType).on('animationend webkitAnimationEnd', function() {
          anim = false;
        })
      }

      function setPageAnim(getIndex, animClass) {
        anim = true;
        ngModel.$setViewValue(getIndex);
        apply(ngModel.$viewValue, animClass);
      }

      onwhat === 'keydown' ? evt = event.keyCode : '';
      onwhat === 'mousewheel DOMMouseScroll' ? evt = event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0 ? 38 : 40 : '';

      switch(evt) {
        case 38:
          if(!anim && index >= 1) {
            setPageAnim(index - 1, 'slideUp');
          }
          if(!anim && index === 0) {
            setPageAnim(pageLength - 1, 'slideUp')
          }
          event.preventDefault();
          break;
        case 40:
          if(!anim && index < (pageLength - 1)) {
            setPageAnim(index + 1, 'slideDown');
          }
          if(!anim && index === (pageLength - 1)) {
            setPageAnim(0, 'slideDown');
          }
          event.preventDefault();
          break;
      }
    })
  }

  return res;
}
