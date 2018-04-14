var provider = new firebase.auth.GoogleAuthProvider();
var user;
var selectedFile;


$( document ).ready(function() {
	$("#welcome").hide();
	$(".upload-group").hide();
	
	$("#upload").on("change", function(event){
		selectedFile =  document.getElementById("upload");
		$(".upload-group").show();
	});

});

function signIn() {
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  user = result.user;
	  showWelcomeContainer();
	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});

};

function showWelcomeContainer() {
	$("#login").hide();
	$("#welcome").show();
	$("#welcomeText").html("Hello, " + user.displayName);
};

$(".dropdown").on("hide.bs.dropdown", function(event){
    var text = $(event.relatedTarget).text(); // Get the text of the element
    $("#dogDrop").html(text+'<span class="caret"></span>');
    firebase.database().ref('Users/' + user.uid).set({
    	name: user.displayName,
    	email: user.email,
    	favDog: text
  	});

});


function confirmUpload() {
	var fileName = selectedFile.files[0].name;
	var image = selectedFile.files[0];
	var metadata = {
		contentType: 'image',
		customMetadata: {
			'dogType': 'Lab',
			'uploadedBy': user.uid,
			'title': $("#imgTitle").val(),
			'caption': $("#imgDesc").val()
		},
	};
	var storageRef = firebase.storage().ref();
         console.log(metadata);
	// Upload file and metadata to the object 'images/mountains.jpg'
var uploadTask = storageRef.child('images/' + fileName).put(image, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
  }
, function() {
  // Upload completed successfully, now we can get the download URL
  var downloadURL = uploadTask.snapshot.downloadURL;
  var postKey = firebase.database().ref('Posts/' + user.uid + '/').push().key;
  var updates = {};
  var postData = {
  	url: downloadURL,
  	user: user.uid
  };
  updates['/Posts/' + user.uid + '/'+ postKey] = postData;
  firebase.database().ref().update(updates);
  console.log(downloadURL);
  $(".upload-group")[0].before("Success!");
  $(".upload-group").hide();
});

};


function load() {


var user = firebase.auth().currentUser;
var token = firebase.auth().currentUser.uid;
if (user) {
  // User is signed in.
   queryDatabse(token);
} else {
  // No user is signed in.
}

};

function queryDatabse(token){



return firebase.database().ref('/Posts/').once('value').then(function(snapshot) {
  var postObject = snapshot.val();
  console.log("postobject val " + postObject);
  var keys = Object.keys(postObject);
  var currentRow;
  for(var i = 0; i < keys.length; i++)
  {
	  console.log("uid loop " + postObject[keys[i]].user);
	if(postObject[keys[i]].user == token)
	{
		var currentObj = postObject[keys[i]];
		//new row on every 3 entry
		// col-lg-4
		if ( i % 3 == 0){
			currentRow = document.createElement("div");
			$(currentRow).addClass("row");
			$("#loadContent").append(currentRow);
		}
		var col = document.createElement("div");
		$(col).addClass("col-lg-4");
		var image = document.createElement("img");
		image.src = currentObj.url;
		$(image).addClass("contentImage");
		$(col).append(image);
		$(currentRow).append(col);
	}
  }
  
});
}











