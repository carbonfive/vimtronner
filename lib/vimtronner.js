var nc = require('ncurses');

// If Ctrl+C, let's clean up and exit as clean as possible
process.on('SIGINT', function() {
    nc.cleanup();
    process.exit();
});

// In case of coding errors, let's clean up screen before dumping error
process.on('uncaughtException',function(err) {
    nc.cleanup();
    console.log(err.stack);
    process.exit();
});

// Draw the main window
var win = new nc.Window();

// Width of the left window
var wLeft = 40;

// Draw one window
var win1 = new nc.Window(win.height,wLeft,0,0);

// Draw a second window
var win2 = new nc.Window(win.height,win.width-wLeft,0,wLeft);

// Let's draw a border and set a title
win1.frame('win1Title');
win2.frame('win2Title');

// Refresh all
nc.redraw();

var activeWin = win2;

var onKey = function(chr,chrCode,isKey) {
    // if TAB key is pressed, toggle focused window
    if (chrCode == 9) {
        if (activeWin == win1) {
            win2.top();
            activeWin = win2;
        } else {
            win1.top();
            activeWin = win1;
        }
        nc.redraw();
    } 
}

// Handler input char on each child windows
win2.on('inputChar',onKey);
win1.on('inputChar',onKey);
