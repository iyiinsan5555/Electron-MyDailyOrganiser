//Frontend JavaScript only works with page. (vanilla --> js), cannot access to electron and node.js



//Load from localStorage

let tasks = JSON.parse(localStorage.getItem("tasks")) || [] ;

const taskObjectSimple = {
    name: "Do Homework",
    description: "Do your English homework on tuesday.",
    alarmTime: "12:00",
    importance: 2 ,
    id: "1998270502240124219"
} 


//Save to localStorage
function saveLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    //updating tasks so my backend can use them
    tasks = JSON.parse(localStorage.getItem("tasks"));
    ipc.tasks(tasks);
    console.log(tasks);
    console.log("send ipc from renderer")
}

console.log(tasks);
//Load elements from data 
if (tasks.length != 0) {
    tasks.forEach((taskObject) => {
        //Sending it to main(backend)
        ipc.tasks(tasks);
        //creatign DOM element
        createNewTaskElement(taskObject);
    });
}


function getNewTaskInfo() {

    const name = document.querySelector(".task-title").value;
    const description = document.querySelector(".task-description").value;
    const alarmTime = document.querySelector(".alarm-time").value;
    const importance = Number(document.querySelector(".important-scala-input").value);

    //Clearing inputs
    document.querySelector(".task-title").value = "";
    document.querySelector(".task-description").value = "";
    document.querySelector(".alarm-time").value = undefined;
    document.querySelector(".important-scala-input").value = 1;
    document.querySelector(".importance-scala-renderer").innerHTML = `Importance: 1`;

    if (name.trim().length === 0) {
        alert("Task Title Required!")
        return;
    };

    const newTaskInfo = {
        name,
        description,
        alarmTime,
        importance,
        id: Date.now(),
    };

    return newTaskInfo;
};


function createNewTaskElement(taskInfo) {
    const {name, description, alarmTime, importance, id} = taskInfo;

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("classic-task");
    taskDiv.classList.add("classic-task-animation");

    taskDiv.innerHTML = `
        <h3 class="title">${name}</h3>
        <p class="description">${description}</p>
        <div class="task-info">
            <p class="alarm-time">${alarmTime}</p> 
            <p class="imp-scala">Importance: ${"★".repeat(importance)}${"☆".repeat(5 - importance)}</p>
        </div>
        <button class="delete-btn">Delete</button>
    `;

    const classicTaskList = document.querySelector(".classic-task-list");
    classicTaskList.appendChild(taskDiv);

    // Animate
    setTimeout(() => taskDiv.classList.remove("classic-task-animation"), 500);

    // Delete button
    const lastDeleteBtn = taskDiv.querySelector(".delete-btn");
    lastDeleteBtn.addEventListener("click", () => {
        taskDiv.remove();
        const index = tasks.findIndex(t => t.id === id);
        if (index > -1) tasks.splice(index, 1);
        saveLocalStorage();
    });

};



//Handling a creating new task
const createTaskButton = document.querySelector(".plus-icon");

createTaskButton.addEventListener("click", () => {

    const taskInfo = getNewTaskInfo();

    if (!taskInfo) {
        return; //Don't do anything
    }

    //Creating it
    createNewTaskElement(taskInfo);

    //Saving it to data
    tasks.unshift(taskInfo);

    saveLocalStorage();
});


//Updating importance scala input
const impScalaInput = document.querySelector(".important-scala-input");
impScalaInput.addEventListener("input", (event)=> {
    document.querySelector(".importance-scala-renderer").innerHTML = `Importance: ${event.target.value}`;
});

