chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (!$('#try-in-pwd').length) {
            $('section.secondary-top-bar-section ul').append('<li><a id="try-in-pwd" data-toggle="modal" data-target="#try-in-pwd-modal"><img src="' + chrome.extension.getURL('assets/images/button.png') + '" /></a></li>');
        }
    }
);
addDialog();

function addDialog() {
    var container = $('body').append('<div id="pwd-dialog"></div>');
    $('#pwd-dialog').load(chrome.extension.getURL('assets/html/dialog.html'));
}

angular.module('PWD', [])
    .controller('TryController', ['$scope', function($scope) {
        $scope.currentRepo = null;
        $scope.tags = [];

        chrome.storage.sync.get({
            pwdUrl: 'http://play-with-docker.com'
        }, function(opts) {
            $scope.pwdUrl = opts.pwdUrl;
        });

        var pwd = this;

        chrome.extension.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.type == 'change-repo') {
                    $scope.changeRepo(request.repo);
                } else if(request.type == 'change-opts') {
                    $scope.$apply(function() {
                        $scope.pwdUrl = request.opts.pwdUrl;
                    });
                }
            }
        );

        $scope.changeRepo = function(repo) {
            if (repo != $scope.currentRepo) {
                $scope.currentRepo = repo;
                $.get('https://api.github.com/repos/play-with-docker/stacks/contents' + repo)
                    .done(function(data) {
                        $scope.$apply(function() {
                            $scope.tags = data;
                        });
                    })
                    .fail(function(resp) {
                        if (resp.status == 404) {
                            $scope.$apply(function() {
                                $scope.tags = [];
                            });
                        } else {
                            console.error('Could not retrieve stack tags.');
                        }
                    });
            }
        }
    }]);

