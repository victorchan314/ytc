chrome.commands.onCommand.addListener(function(command) {
    command.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (command == "leftSkip") {
            chrome.tabs.sendMessage(tabs[0].id, {coefficient: -1});
        } else if (command == "rightSkip") {
            chrome.tabs.sendMessage(tabs[0].id, {coefficient: 1});
        }
    });
});
