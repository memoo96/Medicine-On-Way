/*var config = {
    apiKey: "AIzaSyDaoixC2VdOLieBruAiBiygOvDG8UvPtYg",
    authDomain: "medicineonway.firebaseapp.com",
    databaseURL: "https://medicineonway.firebaseio.com",
    projectId: "medicineonway",
    storageBucket: "",
    messagingSenderId: "832705059840"
};
*/

var config = {
    apiKey: "AIzaSyD4nqZLUgNJvg5sOfoUcRuRkBg-HeIsKss",
    authDomain: "test-da532.firebaseapp.com",
    databaseURL: "https://test-da532.firebaseio.com",
    projectId: "test-da532",
    storageBucket: "test-da532.appspot.com",
    messagingSenderId: "346593245390"
};

firebase.initializeApp(config);
var database = firebase.database();
var auth =  firebase.auth();
var storage = firebase.storage().ref();
var currentUser;
var session;

var currentUrl = window.location.pathname;

/*if(typeof session === "undefined"){
    if(currentUrl.indexOf("index") === -1 || currentUrl.indexOf("singup") === -1)
            if(typeof auth.currentUser === "undefined" || document.cookie.substring(5,document.cookie.length) === "")
                window.location.replace("/graduation/index.html")
    console.log(currentUrl);
}*/


//add new drug (used by factory only)
function addDrug(name, description){
    var drugID = name + Math.floor(Math.random()*1000000000);
    database.ref('/drugs/' + drugID ).set({
        name : name,
        factoryID: session,
        description : description
    });
}


//add new drug in pharmacy 
function addNewDrug(pharmId,name, quantity,price){
    function nestedAdd(pharmId,id,quantity){
        database.ref('/pharmacy-drugs/' + id ).set({
            pharmacyID: pharmId,
            quantity : quantity,
			price : price
        });
    }
var iterator = search('drugs',"name",name);
if(typeof iterator === "undefined" || iterator.length === 0)
    nestedAdd(pharmId,name+pharmId,quantity,price);
else
    nestedAdd(pharmId,iterator[0].key,quantity,price);
}

/*search for any thing in the firebase
	@param	
			filter : the node used for search 
			key    : the key that has the value to look for
			value  : the value to find in the db
	@return
			array of snapshot
	@example
			 var arr = search('pharmacy',"phone",19991)
			 arr[0].val().phone; => 19991
	*/
			
function search(filter,key,value){
    var arr = [];
    database.ref().child(filter).orderByChild(key).equalTo(value).on("value", function(snapshot) {
        var i = 0;
        snapshot.forEach(function(data) {
            arr[i++] = data;
        });
    });
    return arr;
}

/*
used to remove a notification (under the node cotification)  and decrease the quantity of drugs from the owner except factory 
@param	
		notificationId 
		sellerId = always should be the current user uid

*/

function sell(notificationId,sellerId){
	database.ref("/notification/"+notificationId).once('value').then(function(snapshot) {
		var seller = snapshot.val().sellerId;
		var amount = snapshot.val().amount;
		if(seller == sellerId){
			database.ref("/user/"+sellerId).once('value').then(function(snapshot) {
					var quantity = snapshot.val().quantity;
					if(snapshot.val().userType !== "factory")
						database.ref("/user/"+sellerId).update({quantity : quantity-amount});
			});
		}
	});
	database.ref().child(notificationId).remove();
}

/*
used to push a notification (under the node cotification) 
@param	
		UserID = the current user italics
		sellerID = the id of the factory
		productId = the id of the drug (should be under drugs node)
		amount  = amount of durg ordered

*/

function buy(UserID,sellerId,productId,amount){
	database.ref('/notification').push({
		buyer : UserID,
		Seller : sellerId,
		product : productId,
		amount : amount
	})
}

/*
 call the function to listen for updates in the notification node

*/

function NotificationListener(userId){
	database.ref('/notification').on('child_added',function(snapshot) {
		if(snapshot.val().Seller == Seller){
			//set data from snapshot to html
		}
	});
}

//to remove a notification 
function removeNotification(notificationId){
	database.ref().child(notificationId).remove();
}

// return an object (jason formatted form firebase) contains all the data of the specified user
function getInformationForUser(userId){
	database.ref('/users/').orderByKey().equalTo(userId).once("value",function(snapshot){
		return snapshot.val().userId;
		});
}