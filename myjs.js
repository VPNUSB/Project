var provider = new firebase.auth.GoogleAuthProvider();
var user;
var selectedFile;


$( document ).ready(function() {
	$("#welcome").hide();
	$(".upload-group").hide();
	document.getElementById("upload").addEventListener('change', handleFileSelect(), false);
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

function handleFileSelect(event) {
	$(".upload-group").show();
	selectedFile = event.target.files[0];
};

function confirmUpload() {
	var storageRef = firebase.storage().ref();
	var metadata = {
		contentType: 'image',
		customMetadata: {
			'dogType': 'Lab',
			'uploadedBy': user.uid,
			'title': $("#imgTitle").val(),
			'caption': $("#imgDesc").val()
		},
	};
	
	var uploadTask = storageRef.child('dogImages/' + selectedFile.name).put(selectedFile, metadata);
	// Register three observers:
	// 1. 'state_changed' observer, called any time the state changes
	// 2. Error observer, called on failure
	// 3. Completion observer, called on successful completion
	uploadTask.on('state_changed', function(snapshot){
	  // Observe state change events such as progress, pause, and resume
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
	  // Handle unsuccessful uploads
	}, function() {
	  // Handle successful uploads on complete
	  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
	  var downloadURL = uploadTask.snapshot.downloadURL;
	  console.log(downloadURL);
	  $(".upload-group")[0].before("Success!");
	  $(".upload-group").hide();
	});



}


