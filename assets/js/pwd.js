addDialog();
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        setCurrentRepo(request.repo);
        if (!$('#try-in-pwd').length) {
            $('section.secondary-top-bar-section ul').append('<li><a id="try-in-pwd" data-toggle="modal" data-target="#try-in-pwd-modal"><img src="' + chrome.extension.getURL('assets/images/button.png') + '" /></a></li>');
        }
    }
);

function setCurrentRepo(repo) {
    var appElement = document.querySelector('[ng-app=PWD]');
    var $scope = angular.element(appElement).scope();
    if ($scope) {
        $scope.changeRepo(repo);
    }
}

function addDialog() {
    var container = $('body').append('<div id="pwd-dialog"></div>');
    $('#pwd-dialog').load(chrome.extension.getURL('assets/html/dialog.html'));
}

angular.module('PWD', [])
    .controller('TryController', ['$scope', function($scope) {
        $scope.currentRepo = null;
        $scope.tags = [];

        var pwd = this;

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

