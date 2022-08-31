function getCurrentTime(){
    var currentdate = new Date(); 
    var datetime = currentdate.getFullYear()+"-"
                    + (currentdate.getMonth()+1)+"-" 
                    + currentdate.getDate()+ " "
                    + currentdate.getHours()+":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds()+":"
                    + currentdate.getMilliseconds();

    return datetime;
}

function generateRandomLocation() {
    let x_lad = (Math.random() * (28.75195 - 28.55195) + 28.55195).toFixed(5);
    let y_long = (Math.random() * (77.33149 - 77.13149) + 77.13149).toFixed(5) ;
    return [parseFloat(x_lad), parseFloat(y_long)]
}

export {getCurrentTime, generateRandomLocation}