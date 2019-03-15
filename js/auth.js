async function signUp(email,password,phone,address,name,userType,document) {
    if (!emailValidation(email)) {
        document.getElementById("error").innerHTML = "Not A Valid Email";
        return;
    }
    if (!passValidation(password)) {
        document.getElementById("error").innerHTML = "Not A Valid Password";
        return;
    }

    if (!phoneValidation(phone)){
        document.getElementById("error").innerHTML = "Not A Valid Phone number";
        return;
    }

    auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
        // errors
        var errorCode = error.code;
        var errorMessage = error.message;

        alert(errorCode + "   " + errorMessage);
    });
    await sleep(3000);
    var checkUser = auth.currentUser;
    if (checkUser ) {
        // User is signed in.
        currentUser = checkUser;
        session = currentUser.uid;
        writeUserData(session, name, userType, phone, address, document);
        document.cookie = "user="+session+";path=/";
    } else {
        // No user is signed in.
        console.log("No user");
        console.log(auth.currentUser.uid);
    }

}

async function signIn(email,password){
    auth.signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + "   " + errorMessage);
    });
    await sleep(3000);
    var checkUser = auth.currentUser;
    if (checkUser) {
        // User is signed in.
        currentUser = checkUser;
        session = currentUser.uid;
        document.cookie = "user="+session+";path=/";
    } else {
        // No user is signed in.
        console.log("error");
    }
}

function signOut(){
    auth.signOut().then(function() {
        alert("signed Out");
    }).catch(function(error) {
        console.log(error);
    });
    console.log(auth.currentUser.uid);
}

function writeUserData(userId, userType ,name, phone, address, document) {
    database.ref('/' + userType + '/' + userId).set({
        name: name,
        phone: phone,
        address : address,
        document : document,
        active : 0
    });
}

function passValidation(pass){
    var reg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return reg.test(pass);
}

function emailValidation(email){
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
}

function phoneValidation(phone){
    var reg = /\d+/g;
    return (phone.match(reg) && phone.length > 4);
}

async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}