const socket =io();
console.log("NAMAN");

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
            const {latitude,longitude} = position.coords;
            socket.emit("send-location",{latitude,longitude});
    },
(err)=>{
    console.error(err)
},{
    enableHighAccuracy : true,
    maximumAge: 10000, // no caching
    timeout:30000,
}
);
}

const map=L.map("map").setView([0,0],10);

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Naman Mittal"
}).addTo(map);


const markers={

}; 

socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} =  data;

if(id===socket.id){
    map.setView([latitude,longitude]);

}

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer([markers[id]])
        delete markers[id];
    }
})