chrome.tabs.onUpdated.addListener(function(tab) {
    chrome.tabs.query({active: true}, function(tabs) {
        tabs.forEach(function(tab) {
            var repo = getRepoPath(tab.url);
            if (repo) {
                chrome.tabs.sendMessage(tab.id, {type: 'change-repo', repo: repo}, function(response) {});
            }
        });
    });
});

function getRepoPath(url) {
    var parser = document.createElement('a');
    parser.href = url;

    var chunks = parser.pathname.split('/');
    var path;
    if (chunks[1] == '_') {
        // This is an official repo
        path = '/' + chunks[2];
    } else if (chunks[1] == 'r' && chunks[2] == 'library') {
        // This is a special case of the common libraries
        path = '/' + chunks[3];
    } else if (chunks[1] == 'r') {
        // This is a repo of an organization
        path = '/' + chunks[2] + '/' + chunks[3];
    } else {
        path = null;
    }

    return path;
}
