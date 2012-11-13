// Wait until the document is ready
$(function() {
    "use strict";
    // Fade the page in because it looks cool
    $('#fadePage').fadeIn(2000);
    // Render the "Add your API Key" form
    var apiKeyForm = '<form class="apiForm">' + '<legend>Enter your API Key</legend>' + '<input type="text" id="apiKey" class="span12" placeholder="e.g. ab12c34d5678efgh90123i45678j90k1">' + '<span class="help-block">You can find your access key <a href="https://shrinkonce.com/index.php?menu=usercp#tools" target="blank">here.</a></span>' + '<button id="saveAPIKey" class="btn btn-info btn-large btn-block">Save</button>' + '</form>';

    // Render the "Add a link or two or more" form
    var apiLinkForm = '<form class="apiForm">' + '<legend>Add a link or two... or more.</legend>' + '<button id="add" class="btn btn-large">Add</button>' + '<button id="remove" class="btn btn-large">Remove</button>' + '<button id="reset" class="btn btn-large">Reset</button>' + '<button id="submitLinks" class="btn btn-info btn-large">Submit</button>' + '<hr />' + '<div id="linkForm">' + '</div>' + '</form>';

    // Display the user's API key and the link form if the API key is set
    if (localStorage.length > 0) {
        $('<div class="alert alert-success">Your API token is <b>' + localStorage.getItem('apiKey') + '</b>. If this key is incorrect, click <a href="" class="resetLocalStorage">here</a>.</div>').appendTo('.flashAlert').fadeIn('slow');
        $(apiLinkForm).fadeIn('slow').appendTo('.mainFormContent');
    }
    // Otherwise, show them the API key entry form
    else {
        $('<div class="alert">You have not yet entered your API token. Add it below, and it will be persisted in memory.</div>').appendTo('.flashAlert').fadeIn('slow');
        $(apiKeyForm).fadeIn('slow').appendTo('.mainFormContent');
    }
    // When the add button is clicked, add a textbox to the link form
    var i = $('#linkForm input').size() + 1;
    $(document).on('click', '#add', function(e) {
        e.preventDefault();
        $('<input type="text" id="inputLink' + i + '" class="shrinklink span12" placeholder="http://google.com">').fadeIn('slow').appendTo('#linkForm');
        i++;
        return false;
    });
    // When the remove button is clicked, remove the last textbox from the link form
    $(document).on('click', '#remove', function(e) {
        e.preventDefault();
        if (i > 1) {
            $('.shrinklink:last').fadeOut('normal', function() {
                $(this).remove();
            });
            i--;
        }
        return false;
    });
    // When the reset button is clicked, remove all textboxes from the link form
    $(document).on('click', '#reset', function(e) {
        e.preventDefault();
        while (i > 1) {
            $('.shrinklink:last').remove();
            i--;
        }
        return false;
    });
    // When the save button is clicked, save the API key to local storage
    $(document).on('click', '#saveAPIKey', function(e) {
        e.preventDefault();
        // check if the API key was actually set, if it was, render the link form
        if ($('#apiKey').val().length > 0) {
            localStorage.setItem('apiKey', $('#apiKey').val());
            $('.alert').fadeOut('slow', function() {
                var div = $('<div class="alert alert-success">Your API token is <b>' + localStorage.getItem('apiKey') + '</b>. If this key is incorrect, click <a href="" class="resetLocalStorage">here</a>.</div>').hide();
                $(this).replaceWith(div);
                $('.alert').fadeIn('slow');
            });
            $('.apiForm').fadeOut('slow', function() {
                var div = $(apiLinkForm).hide();
                $(this).replaceWith(div);
                $('.apiForm').fadeIn('slow');
            });
        }
        // Otherwise, tell them they have not entered the API key
        else {
            $('.alert').fadeOut('slow', function() {
                var div = $('<div class="alert alert-error">You did not enter your API key! Please enter it below.</div>').hide();
                $(this).replaceWith(div);
                $('.alert').fadeIn('slow');
            });
        }
        return false;
    });
    // Allow them to reset the API key if they entered it incorrectly
    $(document).on('click', '.resetLocalStorage', function(e) {
        e.preventDefault();
        localStorage.clear();
        location.reload();
        return false;
    });
    // When the submit button is clicked, make an API request for each URL
    $(document).on('click', '#submitLinks', function(e) {
        e.preventDefault();
        $('.apiForm').hide('slow');
        var $items = $('.apiForm');
        var links = [];
        $items.each(function() {
            var $inputs = $(this).find('input');
            $inputs.each(function() {
                links.push($(this));
            });
        });
        // Set the paramaters for use in constructing the API request
        var usersApiKey = localStorage.getItem('apiKey');
        var urlPrepend = 'https://shrinkonce.com/api.php?key=';
        var urlMiddle = '&action=shrink&url=';
        var urlAppend = '&is_ppd=0';
        // Fetch each link, construct each one into an API request, and store in an array
        var yqlResult = function() {
            $.queryYQL(statement, function(data) {
                var r = data.query.results.body.p.toString();
                // Add the returned object as a string to the list of links
                $('<li>' + r + '</li>').fadeIn('slow').appendTo('.listLinks');
            });
        };
        for (var i = 0; i < links.length; i++) {
            var linkValue = $(links[i]).val();
            var linkConstructed = [];
            linkConstructed[i] = urlPrepend + usersApiKey + urlMiddle + linkValue + urlAppend;
            var url = linkConstructed[i];
            // Use YQL to fetch the raw data from the result of the request and return it as JSON
            var statement = 'select * from html where url="' + url + '"';
            yqlResult();
        }
    });
});