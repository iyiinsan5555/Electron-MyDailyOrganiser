
const information = document.querySelector("#info");

information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`; // versions is a global variable created by me in preload.js


const func = async () => {
    const response = await versions.ping();
    console.log(response);
}

func();