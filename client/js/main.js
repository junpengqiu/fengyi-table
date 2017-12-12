//initiation
var selectorValueSet;
var createdSelectorNum;
var lastReqPartNumbers;
init()

function init(){
    selectorValueSet = [];
    createdSelectorNum = 0;
    lastReqPartNumbers = [];
}

function removeLastSelector(){
    let theBlock = document.getElementById("selectorGroup");
    theBlock.removeChild(theBlock.lastChild)
    
    selectorValueSet.pop();
    createdSelectorNum--;
    if(createdSelectorNum == 0){
        document.getElementById("rmButton").style.display="none";
    }
}

function createSelector(){
    let selectorWrapper = document.createElement("DIV")
    selectorWrapper.style.margin = "5px 5px 5px 5px";
    selectorWrapper.style.display = "inline-block";
    
    let selectorToCreate = document.createElement("SELECT")
    appendOptionsToSelector(selectorToCreate )
    selectorToCreate.value="(empty)"
    
    let temp = createdSelectorNum;
    selectorToCreate.onchange = function(event){
        event.preventDefault();
        
        selectorValueSet[temp] = event.target.value;
    }
    
    selectorWrapper.appendChild(selectorToCreate)
    
    let theBlock = document.getElementById("selectorGroup");
    theBlock.appendChild(selectorWrapper)
    
    selectorValueSet[createdSelectorNum] = "(empty)"
    createdSelectorNum++;
    document.getElementById("rmButton").style.display="inline-block";
}

function appendOptionsToSelector(s){
    let op = document.createElement("OPTION")
    let opTxt = document.createTextNode("(empty)")
    op.value = "(empty)"
    op.appendChild(opTxt)
    s.appendChild(op)
    
    let setOfValue = ["Product Item Id", "Product Name", "Prepare by", "Date", "Rev", "Customer", "Verify by", "Page", "Part Number", "Item", "Level", "Usage", 
                    "Part Name", "Mtl Specification", "Unit", "Q\'ty\/Set", "Vendor", "Remark"];
    for (let i = 0; i < setOfValue.length; i++){
        let op = document.createElement("OPTION")
        let opTxt = document.createTextNode(setOfValue[i])
        op.value = setOfValue[i];
        op.appendChild(opTxt)
        s.appendChild(op)
    }
    
}


function switchButtonJoin(event){
    document.getElementById("join-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    
}

function switchButtonLogin(event){
    document.getElementById("login-form").style.display = "none";
    document.getElementById("join-form").style.display = "block";
}

