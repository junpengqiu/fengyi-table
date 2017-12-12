function extFromCookie(toExt){
    var temp = document.cookie;
    var varName = toExt + "=";
    var varNameIdx = temp.indexOf(varName);
    if(varNameIdx == "-1") return ""; //cookie parse error
    var endIdx = temp.indexOf(";",varNameIdx);
    if(endIdx == -1) endIdx = temp.length;
    return temp.substring(varNameIdx + varName.length, endIdx);
}

function regUsr(event) {
    event.preventDefault(); // If it is just a regular button triggering this function, you don't need to prevent the default event, a regular button won't submit the form, thus no page refresh.
    
    var usrName = document.getElementById("usrName").value
    var psw = document.getElementById("psw").value
    var pswRe = document.getElementById("re-psw").value
    var nickName = document.getElementById("nickName").value
    
    let checkResult = checkValidRegInput(usrName,psw,pswRe,nickName)
    if(checkResult !== ''){
        //error NOIMP
        return;
    }
    
    const actualData = {
        email : usrName,
        password : psw,
        nickName : nickName
    }

    var req = {
        action: "register",
        "actualData" : actualData
    }
    myAjax(req, function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            if(res.error !== null){
                // console.log(res)
                return;
            }else{
                document.cookie = `sid=${res.sid}; expires=${getExpires()}`;
                window.location.replace("/html/main.html");
            }
        }
    })
}
 		
function renderJoinBorder(){
    if(!!document.getElementById("join-form")){
        if(document.documentElement.clientWidth < 992){
            document.getElementById("join-form").style.borderRight = "";
            document.getElementById("join-form").style.borderBottom = ".0625rem solid #c1c0c0";
        }else{
            document.getElementById("join-form").style.borderRight = ".0625rem solid #c1c0c0";
            document.getElementById("join-form").style.borderBottom = "";
        }
    }
}

//my Ajax:
function myAjax(toSend,cb){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = cb;
    xhttp.open("POST", "https://fortune-table-dawahent.c9users.io/");
    xhttp.send(JSON.stringify(toSend));
}

function say(toSay){
    console.log(toSay)
}

function getExpires(){
    let d = new Date().getTime();
    let exp = new Date(d + 7666000000);
    return exp.toString();
}

function checkValidRegInput(usrName,psw,pswRe,nickName){
    if(psw !== pswRe)
        return "Password not confirm"
    return ''
}

function onChoseFile(event){
    event.preventDefault();
    
    let reader = new FileReader();
    let file = event.target.files[0];
    		
    reader.onloadend = () => {
        var jsToPass = {}
        jsToPass["action"] = "postExcel";
        jsToPass.actualData = reader.result;
        // console.log(jsToPass.actualData)
        myAjax(jsToPass,function(){
            if (this.readyState == 4 && this.status == 200){
                // console.log(JSON.parse(this.response))
                console.log("shangchuanwangbi")
            }
        })
    }
    		
    reader.readAsBinaryString(file)
}

function switchToTableMaker(event){
    event.preventDefault();
    
    let tbmk = document.getElementById("tableMaker")
    let upBom = document.getElementById("uploadBom")
    tbmk.style.display = "block";
    upBom.style.display = "none"
}

function switchToUploadBom(event){
    event.preventDefault();
    
    let tbmk = document.getElementById("tableMaker")
    let upBom = document.getElementById("uploadBom")
    tbmk.style.display = "none";
    upBom.style.display = "block"
    console.log("ff")
}

function onSelect(event) {
    event.preventDefault()
    // console.log(document.getElementById("myselect").value)
    
}

function makeTable(dt){
    //clear the made table
    let tableArea = document.getElementById("tableWrapper");
    while(tableArea.hasChildNodes()){
        tableArea.removeChild(tableArea.lastChild);
    }
    
    //make header
    // let headerRow = document.createElement("tr")
    // for(let i = 0; i < selectorValueSet.length; i++){
    //     let temp = document.createElement("th");
    //     temp.appendChild(document.createTextNode(selectorValueSet[i]))
    //     headerRow.appendChild(temp);
    // }
    // tableArea.appendChild(headerRow)
    
    //append data
    // console.log(lastReqPartNumbers)
    
    for(let i = 0; i < lastReqPartNumbers.length; i++){
        let dataRow = document.createElement("tr");
        for(let j = 0; j < selectorValueSet.length; j++){
            let temp = document.createElement("td");
            if(dt[lastReqPartNumbers[i]] && dt[lastReqPartNumbers[i]][selectorValueSet[j]]){
                temp.appendChild(document.createTextNode(dt[lastReqPartNumbers[i]][selectorValueSet[j]]))
            }else{
                temp.appendChild(document.createTextNode(" "))
            }
            dataRow.appendChild(temp)
        }
        tableArea.appendChild(dataRow)
    }
}

function onRequest(event){
    event.preventDefault()
    
    let toReq = document.getElementById("requestPartNumbers").value
    
    if(toReq === "") return;
    
    let temp = toReq.split(/(\r\n|\n|\r)/gm)
    
    let partNumbers = []
    for(let i = 0; i < temp.length; i++){
        if(temp[i] === "" || temp[i] === temp[1]) continue
        partNumbers.push(temp[i])
    }
    
    lastReqPartNumbers = partNumbers

    let req = {}
    req.action = "reqPartInfo";
    req.actualData = partNumbers;
    
    myAjax(req,function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            console.log(res.actualData)
            makeTable(res.actualData);
        }
    })
}