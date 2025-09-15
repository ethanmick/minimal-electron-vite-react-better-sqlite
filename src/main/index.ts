import Database from 'better-sqlite3'
import { app, BrowserWindow } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

const isDev = !app.isPackaged // reliable dev/prod switch.  [oai_citation:2‡Electron](https://electronjs.org/docs/latest/api/app?utm_source=chatgpt.com)

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isDev) {
    const url = process.env.VITE_DEV_SERVER_URL ?? 'http://localhost:5173'
    win.loadURL(url).finally(() => {
      win.show()
      win.webContents.openDevTools({ mode: 'detach' })
    })
  } else {
    const indexHtml = path.join(
      app.getAppPath(),
      'renderer',
      'dist',
      'index.html'
    )
    win.loadFile(indexHtml).finally(() => win.show())
  }
}

function initDb() {
  const dbDir = app.getPath('userData')
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })
  const dbPath = path.join(dbDir, 'app.db')

  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.prepare('CREATE TABLE IF NOT EXISTS messages (text TEXT)').run()
  db.prepare('INSERT INTO messages (text) VALUES (?)').run(
    'hello from better-sqlite3'
  )
  const row = db.prepare('SELECT text FROM messages LIMIT 1').get()
  console.log('Selected row:', row)
  db.close()
}

app.whenReady().then(() => {
  initDb()
  createWindow()
  app.on(
    'activate',
    () => BrowserWindow.getAllWindows().length === 0 && createWindow()
  )
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
