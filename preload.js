//For now I don't need to use it, right?

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipc', {
  tasks: (tasks) => ipcRenderer.send("tasks",tasks),
  saveTasks: (tasks) => ipcRenderer.send("saveTasks",tasks)
})