//initiation
init()

function init(){
    // renderJoinBorder()
    // loginChecker()
}

function onChoseFile(event){
    event.preventDefault();
    
    let reader = new FileReader();
    let file = event.target.files[0];
    		
    reader.onloadend = () => {
        var jsToPass = {}
        jsToPass.action = "imgtest";
        jsToPass.actualData = reader.result;
        myAjax(JSON.stringify(jsToPass),function(){
            if (this.readyState == 4 && this.status == 200){
                console.log(JSON.parse(this.response))
            }
        })
    }
    		
    reader.readAsDataURL(file)
}

function switchButtonJoin(event){
    document.getElementById("join-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    
}

function switchButtonLogin(event){
    document.getElementById("login-form").style.display = "none";
    document.getElementById("join-form").style.display = "block";
}

// function loginChecker(){
//     let sid = extFromCookie("sid");
//     if(sid === ""){
//         return;
//     }
//     myAjax({action: "sidVerfication", sid},function(){
//         if (this.readyState == 4 && this.status == 200) {
//             var res = JSON.parse(this.responseText);
//             if(res.error !== null){
//                 console.log(res)
//                 return;
//             }else{
//                 if(!res.ifLoggedIn){
//                     return
//                 }else{
//                     window.location.replace("/html/main.html");
//                 }
//             }
//         }
//     });
// }

//resposing to clientWidth
 	 	
// document.getElementsByTagName("BODY")[0].onresize = function() {
//     renderJoinBorder()
// };