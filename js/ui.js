// UI Changer Class
// UI Changer needs to be feed a value of an ID 
// It will then change the UI using the method selected
// Methods will be :
// 1. Hide
// 2. Show
// 3. Change Text
// 4. Get Value/Text
// Return the document.getElementById(id)

class UIChanger {
    constructor(id){
        this.id = id;
    }
    
    hide(){
        document.getElementById(this.id).hidden = true;
    }
    show(){
        document.getElementById(this.id).hidden = false;
    }
    setHTML(text){
        document.getElementById(this.id).innerHTML = text;
    }
    getValue(){
        return document.getElementById(this.id).value;
    }
    getText(){
        return document.getElementById(this.id).innerHTML;
    }
    removeClass(className){
        document.getElementById(this.id).classList.remove(className);
    }
    addClass(className){
        document.getElementById(this.id).classList.add(className);
    }
    getOptionText(){
        return document.getElementById(this.id).options[document.getElementById(this.id).selectedIndex].text;
    }
    setFunction($function){
        // Change the function of the button
        document.getElementById(this.id).setAttribute('onclick', $function);
    }

}


