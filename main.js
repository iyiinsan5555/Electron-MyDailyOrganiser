
const {app, BrowserWindow, ipcMain, Notification, Tray, Menu} = require("electron");
const schedule = require('node-schedule');

const path = require("node:path");

let taskArrayStorage = [];
let mainWindow, tray;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {preload: path.join(__dirname, "preload.js")}
    });

    mainWindow.loadFile("index.html");
}


app.on("ready", ()=> {
    ipcMain.on("tasks", (event, tasks)=> { createNotificationForTasks(tasks) })

    createWindow();
    createTray();
    interceptClose();
    handleWakeUp_Sleep();

    app.on('activate', () => { //Open a window if none are open (macOS)
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on("window-all-closed", ()=>{ //for macOS
    if (process.platform != "darwin") app.quit();
})


// Intercept close event
function interceptClose() {
    mainWindow.on("close", (event) => {
        console.log("debug line 38")
        if (!app.isQuitting) {
            console.log("debug line 40")
            event.preventDefault();
            mainWindow.hide();
        }
    })
}


function createTray() {
    //Creating system tray
    tray = new Tray("icon.png");
    const contextMenu = Menu.buildFromTemplate([
        {label: "Show", click: ()=> {mainWindow.show()}},
        {label: "Quit", click: ()=> {app.isQuitting = true; app.quit()}}
    ])

    tray.setToolTip("My app (TEST)");
    tray.setContextMenu(contextMenu);

    //Double click opens window
    tray.on("double-click", ()=>{
        mainWindow.show();
    })
}


function createNotificationForTasks(taskArray) { //It creates notification for all tasks in array
    taskArrayStorage.splice(0, taskArrayStorage.length);

    taskArray.forEach((task) => {

        taskArrayStorage.push(task);

        const { id, name, alarmTime } = task;

        if (!alarmTime) return;

        // alarmTime = "HH:MM" (24-hour)
        const [hour, minute] = alarmTime.split(":").map(Number);
        const now = new Date();
        const alarm = new Date();

        alarm.setHours(hour, minute, 0, 0);

        // if the time already passed today --> set for tomorrow
        if (alarm <= now) alarm.setDate(alarm.getDate() + 1);

        const delay = alarm - now;

        console.log(`Notification for "${name}" in ${delay / 1000}s`);

        setTimeout(() => {
            if (!taskArrayStorage.find(t => t.id === id)) return; //If we delete task then it will not run.

            new Notification({
                title: `Alarm for "${name}"`,
                body: `You set alarm for ${alarmTime} for your task "${name}"`,
                urgency: "critical",
                timeoutType: "never"
            }).show();


        }, delay);
    });
}


function handleWakeUp_Sleep() {
    // Wake up notification at 7:00 AM every day
    schedule.scheduleJob('0 7 * * *', () => {
        const wakeUpNotification = new Notification({
            title: "WAKE UP!",
            body: "Rise and shine!",
            urgency: "critical",
        });
        
        wakeUpNotification.show();
        console.log("Wake up notification shown at 7:00 AM");
    });

    // Sleep notification at 9:45 PM every day
    schedule.scheduleJob('45 21 * * *', () => {
        const sleepNotification = new Notification({
            title: "SLEEP TIME!",
            body: "Sweet dreams!",
            urgency: "critical",
        });
        
        sleepNotification.show();
        console.log("Sleep notification shown at 9:45 PM");
    });
    
    console.log("Wake up and sleep notifications scheduled");
}