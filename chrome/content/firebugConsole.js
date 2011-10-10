function FBC(){
    var temp;
    if(typeof Firebug === "undefined"){
        temp = console;
    }
    else{
        temp = Firebug.Console || console;
    }
    return temp;
}

