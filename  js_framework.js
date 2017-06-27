//получение нужного списка объектов, иначе false 
//@str - селектор
function getElementByType(str){
    if(str.length){
     var element ;
        if(document.getElementsByTagName(str).length){
            element = document.getElementsByTagName(str);
                console.log('blockvzyat');
        } 
        
        if(str[0] === '#' && document.getElementById(str.substring(1))){
             element = document.getElementById(str.substring(1));
        } 
        if(str[0] === '.' && document.getElementsByClassName(str.substring(1)))
        {
            element = document.getElementsByClassName(str.substring(1));
        }

        if(element) return element;
    }
    return false;
}

//удаляет класс с именем @className из объектов @name, для указания конкретного элемента вводится @idel
 function removeClass(name, className, idel) {
    self = getElementByType(name);
     if(!(idel+1)){ 
     for (var i = self.length - 1; i >= 0; i--) {
      var pe = self[i];
             pe.classList.remove(className);
    }
    }
     else self[idel].classList.remove(className);
 }

////добавляет класс с именем @className в объекты @name, для указания конкретного элемента вводится @idel
 function addClass(name, className, idel) {
    self = getElementByType(name);
     if(!(idel+1)){ 
     for (var i = self.length - 1; i >= 0; i--) {
      var pe = self[i];
             pe.classList.add(className);
    }
    }
     else self[idel].classList.add(className);
 }

//переключает класс с именем @className в объектая @name, для указания конкретного элемента вводится @idel
 function switchClass(name, className, idel) {
    self = getElementByType(name);
     if(!(idel+1)){ 
     for (var i = self.length - 1; i >= 0; i--) {
      var pe = self[i];
             pe.classList.toggle(className);
    }
    }
     else self[idel].classList.toggle(className);
 }



