function skip(coefficient, callback) {
    chrome.tabs.executeScript(null, {
        code: 'var coefficient = ' + coefficient
    }, function() {
        chrome.tabs.executeScript(null, {file: "skipper.js"});
    });
    callback();
}

chrome.commands.onCommand.addListener(function(command) {
    if (command == "leftSkip") {
        skip(-1);
    } else if (command == "rightSkip") {
        skip(1);
    }
});
