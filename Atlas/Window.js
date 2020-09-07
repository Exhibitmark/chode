'use strict'

const { BrowserWindow } = require('electron')

const defaultProps = {
  frame: true,
  webPreferences: {devTools: true, nodeIntegration: true},
  transparent: false,
  width: 800,
  height: 500,
  fullscreen: false,
  show: true
}

class Window extends BrowserWindow {
  constructor ({ file, ...windowSettings }) {
    super({ ...defaultProps, ...windowSettings })
    this.loadFile(file)
    this.webContents.openDevTools()
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = Window