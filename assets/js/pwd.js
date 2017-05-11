$(document).ready(function() {
    var chunks = window.location.pathname.split('/');
    var path;
    console.log(chunks);
    if (chunks[1] == '_') {
        // This is an official repo
        path = '/' + chunks[2];
    } else {
        // This is a repo of an organization
        path = '/' + chunks[2] + '/' + chunks[3];
    }

    $.get('https://api.github.com/repos/play-with-docker/stacks/contents' + path)
        .done(function(data) {
        })
        .fail(function() {
        });

    // $('section.secondary-top-bar-section ul').append('<li><a><img src="' + chrome.extension.getURL('assets/images/button.png') + '" /></a></li>');
});
