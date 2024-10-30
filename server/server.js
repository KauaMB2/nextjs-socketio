const io=require("socket.io")(4000, {cors: {origin: "http://localhost:3000",
    method: ["GET", "POST"]
}})

io.on("connection", (socket)=>{
    console.log("A user connected.")
    socket.on("message", (message, roomName)=>{
        if(roomName.length){
            io.to(roomName).emit("message", message)
        }else{
            io.emit("message", message)
        }
    })
    socket.on("disconnect", ()=>{
        console.log("User disconnected.")
    })
    socket.on("joinRoom", (roomName)=>{
        console.log(`Join room: ${roomName}`)
        socket.join(roomName)
    })
})

