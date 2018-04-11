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
	var storageRef = firebase.storage().ref('dogImages/' + fileName);
	

	var metadata = {
		contentType: 'image',
		customMetadata: {
			'dogType': 'Lab',
			'uploadedBy': user.uid,
			'title': $("#imgTitle").val(),
			'caption': $("#imgDesc").val()
		},
	};
	
	var uploadTask = storageRef.put(image, metadata);
	
	uploadTask.on('state_changed', function(snapshot){
  		
	}, function(error) {
  		
	}, function() {
  		var downloadURL = uploadTask.snapshot.downloadURL;
  		console.log(downloadURL);
  		$(".upload-group")[0].before("Success!");
  		$(".upload-group").hide();

	});

}


