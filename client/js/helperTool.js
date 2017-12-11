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
                console.log(res)
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
    xhttp.open("POST", "https://h-starter-dawahent.c9users.io/");
    xhttp.send(JSON.stringify(toSend));
}

function hey(argument) {
    let temp = document.getElementById("usrSectionTest")
    if(temp.style.height === "0px" || temp.style.height === ""){
        temp.style.height = "250px"
    }else{
        temp.style.height = "0"
    }
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
