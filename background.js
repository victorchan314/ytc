document.addEventListener("DOMContentLoaded", function() {
    chrome.commands.onCommand.addListener(function(command) {
        if (command == "leftSkip") {
            chrome.runtime.sendMessage({coefficient: -1});
        } else if (command == "rightSkip") {
            chrome.runtime.sendMessage({coefficient: 1});
        }
    });
});
