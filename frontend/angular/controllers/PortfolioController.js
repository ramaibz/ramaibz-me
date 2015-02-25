angular
  .module('ramaibz')
  .controller('PortfolioController', portfolioController);

function portfolioController(PortfolioFactory, $scope) {
  var vm = this;

  function getThumbnail(rawData) {
    var raw = rawData;
    var thumbData = [];
    for(var i = 0; i < raw.length; i++) {
      thumbData.push(raw[i].replace('imgs', 'thumbnail'));
    }
    return thumbData;
  }

  var oldIndex;
  vm.getPhoto = function(subject, index, obj) {
    if(subject[index] !== oldIndex) {
      $scope.bool = false;
      vm.photo = subject[index];
      oldIndex = vm.photo;
    }

    $('div.thumbnail').removeClass('active-thumbnail');
    $(obj.currentTarget).addClass('active-thumbnail');
  }

  $scope.$watch('index', function() {
    $('.thumbnail').removeClass('active-thumbnail');
    vm.photo = ' ';
  })
  PortfolioFactory.getPortfolio().then(function(data) {
    vm.flx = {
      name: data.FLX.name,
      url: data.FLX.url,
      imgs: data.FLX.imgs,
      thumb: getThumbnail(data.FLX.imgs)
    }

    vm.pkjkt = {
      name: data.PKJKT.name,
      url: data.PKJKT.public.url,
      public: {
        imgs: data.PKJKT.public.imgs.public,
        thumbs: getThumbnail(data.PKJKT.public.imgs.public)
      },
      jamnas: {
        imgs: data.PKJKT.public.imgs.specific,
        thumbs: getThumbnail(data.PKJKT.public.imgs.specific)
      },
      internal: {
        imgs: data.PKJKT.internal.imgs,
        thumbs: getThumbnail(data.PKJKT.internal.imgs)
      }
    }

    vm.uwo = {
      name: data.UWO.name,
      f: {
        imgs: data.UWO.f.imgs,
        thumbs: getThumbnail(data.UWO.f.imgs)
      },
      skw: {
        imgs: data.UWO.SKW.imgs,
        thumbs: getThumbnail(data.UWO.SKW.imgs)
      },
      hik: {
        imgs: data.UWO.HIK.imgs,
        thumbs: getThumbnail(data.UWO.HIK.imgs)
      }
    }

    vm.mas = {
      name: data.MAS.name,
      url: data.MAS.url
    }

  });
}
