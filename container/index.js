let counter = 0;
setInterval(() => {
    console.log(`[${new Date().toISOString()}] CONTAINER LOG: ${counter}`)
    counter++;
}, 2000)