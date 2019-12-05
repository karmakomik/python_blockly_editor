const { app, BrowserWindow } = require('electron')

//From https://gist.github.com/tedmiston/5935757
var net = require('net');
var isSocketConnected = false;

var socket = net.createConnection(1337, '127.0.0.1');
console.log('Socket created.');
socket.on('data', function(data) {
  // Log the response from the HTTP server.
  console.log('RESPONSE: ' + data);
});
socket.on('connect', function() {
  // Manually write an HTTP request.
  isSocketConnected = true;
  //socket.write("Connected to PyBlockly");
});
socket.on('end', function() {
  isSocketConnected = false;
  console.log('Disconnected');
});
socket.on('error', function() {
  console.log('Connection error!');
});

/*var server = net.createServer(function(socket) {
  socket.write('Echo server Unni!\r\n');
  //socket.pipe(socket);

  socket.on('connect', function(data) {
    console.log('Connected with client');
    //client.destroy(); // kill client after server's response
  });

  socket.on('data', function(data) {
    console.log('Received data from client : ' + data);
    //client.destroy(); // kill client after server's response
  });

  socket.on('close', function(data) {
    console.log('Client closed connection');
    //client.destroy(); // kill client after server's response
  });

});

server.listen(1337, '127.0.0.1');*/

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1680,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    },
    frame:true
  })

  // and load the index.html of the app.
  win.loadFile('test.html')

  // Open the DevTools.
  win.webContents.openDevTools();

  win.autoHideMenuBar = true;

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

const { ipcMain } = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  if(isSocketConnected)
  {
    socket.write(arg);
  }
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
