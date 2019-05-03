var bodyInput = $("#post_body");
var titleInput = $("#post_title");
var cmsForm = $("#post_forum");
var editForum = $("#edit_forum");
var postCategorySelect = $("#post_category");
var postEditId = $("#edit_button").attr('data-editid')

postCategorySelect.val("Personal");
// added by kamal for category drop down
// Getting the Category dropdown
var categorySelect = $("#post_category");
var categoryId;
getCategory();
// A function to get Categories and then render our list of Categories
function getCategory() {
    $.get("/api/category", renderCategoryList);
}
// Function to either render a list of categories
function renderCategoryList(data) {
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createCategoryRow(data[i]));
    }
    categorySelect.empty();
    categorySelect.append(rowsToAdd);
    categorySelect.val(categoryId);
}

// Creates the category options in the dropdown
function createCategoryRow(category) {
    var listOption = $("<option>");
    listOption.attr("value", category.id);
    listOption.text(category.name);
    return listOption;
}
// creating category list ends here

// Adding an event listener for when the form is submitted
$(cmsForm).on("submit", function handleFormSubmit(event) {
    event.preventDefault();

    // Wont submit the post if we are missing a body or a title
    //if (!titleInput.val().trim() || !bodyInput.val().trim()) {
    //return;
    //}
    // Constructing a newPost object to hand to the database
    var newPost = {
        post_title: titleInput.val().trim(),
        post_body: bodyInput.val().trim(),
        CategoryId: categorySelect.val(),
        AuthorId: 1
    };

    console.log(newPost);

    submitPost(newPost);
});

// Submits a new post and brings user to blog page upon completion
function submitPost(Post) {
    $.post("/api/forums", Post, function () {
        window.location.href = "/forum";
    });
}



// Delete Thread
var postDelete = $('.display_post_delete');
$(document).ready(function () {
    $(document).on('click', '.display_post_delete', function () {
        var postDeleteId = $(this).attr('data-threadid')


        console.log("ive been clicked " + postDeleteId);

        $.post({
            url: "/api/forums/" + postDeleteId,
            type: 'DELETE'
        })
        window.location.href = "/forum";
        console.log(url);
    });
});

console.log("Make sure bch_forum.js is running")

// Edit Thread

$(document).ready(function () {
    $(document).on('click', '.display_edit_button', function () {


        event.preventDefault();
        console.log("ive been clicked!");

        var EditedPost = {
            post_title: titleInput.val().trim(),
            post_body: bodyInput.val().trim(),
            post_category: postCategorySelect.val(),
            id: postEditId
        };
        console.log(EditedPost)

        editPost(EditedPost)
    });
});

function editPost(EPost) {
    console.log("editPost is running!")
    $.ajax({
        type: "PUT",
        url: "/api/forums/" + postEditId,
        data: EPost,
        error: function (req, err) { console.log('my message' + err); },
        success: function (response) {

            console.log(response);//does not print in the console
        }
    })
        .then(function () {
            window.location.href = "/forum";
        });
}


// Cognito


// OnClick for modal button to register new account, verify, and login

$('#modal_register').on("click", function () {

    registerButton();

});

$('#modal_verify').on("click", function () {

    verify()

});

$('#modal_login').on("click", function () {

    login();

})




// Register

var username;
var password;
var personalname;
var poolData;

function registerButton() {

    personalname = $("#personalnameRegister").val();
    username = $("#emailInputRegister").val();

    if ($("#passwordInputRegister").val() != $("#confirmationpassword")
        .val()) {
        alert("Passwords Do Not Match!")
        throw "Passwords Do Not Match!"
    } else {
        password = $("#passwordInputRegister").val();
    }
    poolData = {
        UserPoolId: 'us-east-2_rzFJkIGfu',
        ClientId: '3hte44uuqb3nsakj11mjtb86s0'
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var attributeList = [];

    var dataEmail = {
        Name: 'email',
        Value: username, //get from form field
    };

    var dataPersonalName = {
        Name: 'name',
        Value: personalname, //get from form field
    };

    var dataForumName = {
        Name: 'custom:ForumName',
        Value: personalname,
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var attributePersonalName = new AmazonCognitoIdentity.CognitoUserAttribute(dataPersonalName);
    var attributeForumName = new AmazonCognitoIdentity.CognitoUserAttribute(dataForumName);

    attributeList.push(attributeEmail);
    attributeList.push(attributePersonalName);
    attributeList.push(attributeForumName);
    userPool.signUp(username, password, attributeList, null, function (err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            console.log(attributeList)
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());

        // window.location.replace("https://google.com"); 				// redirect 
    });
}
// console.log('user name is ' + cognitoUser.getUsername());

// Verify

function verify() {


    var email = $("#email").val();
    var verification = $("#Verification").val();

    var poolData = {
        UserPoolId: 'us-east-2_rzFJkIGfu', // your user pool id here
        ClientId: '3hte44uuqb3nsakj11mjtb86s0' // your app client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: email,
        Pool: userPool
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(verification, true, function (err, result) {
        if (err) {
            alert('<div class="alert alert-danger"> <strong>Something went Wrong !<br></strong>' + err + '</div>');
            return;
        } else {
            alert('<div class="alert alert-success"> <strong>Successfully Verified !<br></strong> Now you can login : please click <a href="./login.html"><strong>here</strong></a><br>Thank You!. </div>');
            console.log('call result: ' + result);
            $('#modal_register').hide();
            window.location.replace("/"); 	

        }

    });

};

// Login

function login() {



    var username = $("#username").val();
    var password = $("#password").val();


    var authenticationData = {
        Username: username,
        Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var poolData = {
        UserPoolId: 'us-east-2_rzFJkIGfu', // your user pool id here
        ClientId: '3hte44uuqb3nsakj11mjtb86s0' // your app client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            var IDToken = result.getIdToken()

            AWS.config.region = 'us-east-2';

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-2:c77291cb-be87-40ed-8b14-d569895d7cd3', // your identity pool id here
                Logins: {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.us-east-2.amazonaws.com/us-east-2_rzFJkIGfu': result.getIdToken().getJwtToken()
                }
            });

            AWS.config.credentials.refresh((error) => {
                if (error) {
                    console.error(error);
                } else {
                    // Instantiate aws sdk service objects now that the credentials have been updated.
                    // example: var s3 = new AWS.S3();
                    console.log('Successfully logged!');
                }
            });

            console.log('Access Token + ' + result.getAccessToken().getJwtToken());
            console.log('****************************************************************')
            console.dir(result.getIdToken())
            // this lives INSIDE the Cognito SUCCESS response >>>>> Through this we create a new Author with the authenticated value as retrieved from Cognito response
            var newAuthor = {
                name: IDToken.payload.name,
                email: username,
            };
            
            console.log(newAuthor);
        
            submitAuthor(newAuthor);
       
        
        // Submits a new post and brings user to blog page upon completion
        
        },
        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        },

    });

}

function submitAuthor(Author) {
    $.post("/api/author", Author, function () {
        window.location.href = "/";
    });
}