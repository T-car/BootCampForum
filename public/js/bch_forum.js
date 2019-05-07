var bodyInput = $("#post_body");
var titleInput = $("#post_title");
var createThread = $("#post_forum");
var editForum = $("#edit_forum");
var postCategorySelect = $("#post_category");
var postEditId = $("#edit_button").attr('data-editid')

var createResponseBody = $("#response_body")
var createResponseButton = $("#create_response")

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

// Adding an event listener for when a new thread is created
$(createThread).on("submit", function handleFormSubmit(event) {
    event.preventDefault();

    // Cognito Session PULL

    cognitoUser.getSession(function (err, session) {
        if (err) {
            alert(err);
            return;
        }

        var CurrentIDToken = session.getIdToken()
        var LoggedIn = session.isValid();

        console.log('session validity: ' + session.isValid());

        if (LoggedIn === true) {
            console.log('You are successfully logged in! **THIS IS WITHIN THE SUBMIT POST**')

        } else {
            console.log('You are not logged in! Please either log in or register to continue!')
        }

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-2:c77291cb-be87-40ed-8b14-d569895d7cd3', // your identity pool id here
            Logins: {
                // Change the key below according to the specific region your user pool is in.
                'cognito-idp.us-east-2.amazonaws.com/us-east-2_rzFJkIGfu': session.getIdToken().getJwtToken()
            }
        });

        console.log('Access Token + ' + session.getAccessToken().getJwtToken());
        console.log('****************************************************************')
        console.dir(session.getIdToken())

        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();
        var newThread = {
            post_title: titleInput.val().trim(),
            post_body: bodyInput.val().trim(),
            CategoryId: categorySelect.val(),
            forum_name: CurrentIDToken.payload.name
        };

        console.log(newThread);

        submitThread(newThread);

    });


    // Wont submit the post if we are missing a body or a title
    // if (!titleInput.val().trim() || !bodyInput.val().trim()) {
    // return;
    // }

});

// Submits a new thread and brings user to blog page upon completion
function submitThread(Thread) {
    $.post("/api/forums", Thread, function () {
        window.location.href = "/forum";
    });
}

// Submitting a new response to an existing thread

// Adding an event listener for when a new RESPONSE is created
$(createResponseButton).on("click", function () {

    // Cognito Session PULL

    cognitoUser.getSession(function (err, session) {
        if (err) {
            alert(err);
            return;
        }

        var CurrentIDToken = session.getIdToken()
        console.log('session validity: ' + session.isValid());

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-2:c77291cb-be87-40ed-8b14-d569895d7cd3', // your identity pool id here
            Logins: {
                // Change the key below according to the specific region your user pool is in.
                'cognito-idp.us-east-2.amazonaws.com/us-east-2_rzFJkIGfu': session.getIdToken().getJwtToken()
            }
        });

        var currentThread = window.location.pathname

        console.log("This is the current thread: " + currentThread)

        var newResponse = {
            post_response: createResponseBody.val().trim(),
            forum_name: CurrentIDToken.payload.name,
            ForumId: currentThread.replace(/\D/g,'')

        };

        console.log(newResponse);
        submitResponse(newResponse);

    });

    // Wont submit the post if we are missing a body or a title
    // if (!titleInput.val().trim() || !bodyInput.val().trim()) {
    // return;
    // }

});

function submitResponse(Response) {
    $.post("/api/responses", Response, function () {
        window.location.reload(true);
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
            error: function (req, err) {
                console.log('my message' + err);
            },
            success: function (response) {

                console.log(response); //does not print in the console
            }
        })
        .then(function () {
            window.location.href = "/forum";
        });
}


// Cognito


// OnClick for modal button to register new account, verify, and login

$('#button_modal_register').on("click", function () {

    registerButton();

});

$('#modal_verify').on("click", function () {

    verify()

});

$('#button_modal_login').on("click", function () {
    
    login();

})

$('#logout_button').on("click", function () {

    logout();

})


// Register

var username;
var password;
var personalname;
var poolData;
notRegistered = true;

if (notRegistered === false) {
    $('#modal_verify').show();
}
else{
    $('#modal_verify').hide();
}

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
        notRegistered = false;

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
            alert('Something went wrong!' + err);
            return;
        } else {
            alert('Successfully verified, you can now log in!');
            console.log('call result: ' + result);
            $('#modalVerify').hide();
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
                forum_name: IDToken.payload.name
            };

            console.log(newAuthor);

            submitAuthor(newAuthor);
            $('#modal_login_register_button').hide()
            $('#logout_button').show()

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



// log out function

function logout() {

    if (cognitoUser != null) {
        cognitoUser.signOut();
        console.log("you have been signed out")
        $('#modal_login_register_button').show()
        $('#logout_button').hide()

    }
}

///////////////////////////////////////////////////////////////////////

var data = {
    UserPoolId: 'us-east-2_rzFJkIGfu', // your user pool id here
    ClientId: '3hte44uuqb3nsakj11mjtb86s0' // your app client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
var cognitoUser = userPool.getCurrentUser();
console.log(cognitoUser)

if (cognitoUser != null) {
    cognitoUser.getSession(function (err, session) {
        if (err) {
            alert(err);
            return;
        }

        var CurrentIDToken = session.getIdToken()
        var LoggedIn = session.isValid();

        console.log('session validity: ' + session.isValid());

        if (LoggedIn === true) {
            console.log('You are successfully logged in!')
            console.log('User: ' + CurrentIDToken.payload.name)
            console.log('Email: ' + CurrentIDToken.payload.email)
            console.log('Verification Status: ' + CurrentIDToken.payload.email_verified)
            console.log('Forum Name: ' + CurrentIDToken.payload)
            $('#modal_login_register_button').hide()
            $('#logout_button').show()
            
        } else {
            console.log('You are not logged in! Please either log in or register to continue!')
        }

        if (LoggedIn === false) {
            $('#logout_button').hide()
        }

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-2:c77291cb-be87-40ed-8b14-d569895d7cd3', // your identity pool id here
            Logins: {
                // Change the key below according to the specific region your user pool is in.
                'cognito-idp.us-east-2.amazonaws.com/us-east-2_rzFJkIGfu': session.getIdToken().getJwtToken()
            }
        });

        console.log('Access Token + ' + session.getAccessToken().getJwtToken());
        console.log('****************************************************************')
        console.dir(session.getIdToken())

        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();

    });
}
else{
    console.log('You are not logged in! Please either log in or register to continue!')
    $('#logout_button').hide()
}

///////////////////////////////////////////////////////////////////////////////////////////////
// NEWS API BEGINS BELOW - PREPARE TO BE AMAZED AT THIS REDUNDANCY :-) ///////////////////////

var url = 'https://newsapi.org/v2/everything?' +
    'q=Technology&' +
    'from=2019-05-03&' +
    'sortBy=popularity&' + 
    'apiKey=315ef01aca5a462b9e90a0f0f73b7ebf';
var req = new Request(url);
fetch(req)
    .then(function (response) {
        // var raw = response
        // var clean = response.json();
        // // console.log(response.json());
        // console.log(clean)
        return response.json();
        // console.log(techAPI.data)
    }).then(function (clean) {
        console.log(clean)
        console.log(clean.articles)
        console.log(clean.articles.length)
        console.log(clean.articles[0].author)

       $('#article_title1').text(clean.articles[0].title)
       $('#article_title2').text(clean.articles[1].title)
       $('#article_title3').text(clean.articles[2].title)
       $('#article_title4').text(clean.articles[3].title)
       $('#article_title5').text(clean.articles[4].title)
       $('#article_title6').text(clean.articles[5].title)
       $('#article_title7').text(clean.articles[6].title)
       $('#article_title8').text(clean.articles[7].title)
      
       $('#article_body1').text(clean.articles[0].description)
       $('#article_body2').text(clean.articles[1].description)
       $('#article_body3').text(clean.articles[2].description)
       $('#article_body4').text(clean.articles[3].description)
       $('#article_body5').text(clean.articles[4].description)
       $('#article_body6').text(clean.articles[5].description)
       $('#article_body7').text(clean.articles[6].description)
       $('#article_body8').text(clean.articles[7].description)
      
       $('#article_picture1').attr('src', clean.articles[0].urlToImage)
       $('#article_picture2').attr('src', clean.articles[1].urlToImage)
       $('#article_picture3').attr('src', clean.articles[2].urlToImage)
       $('#article_picture4').attr('src', clean.articles[3].urlToImage)
       $('#article_picture5').attr('src', clean.articles[4].urlToImage)
       $('#article_picture6').attr('src', clean.articles[5].urlToImage)
       $('#article_picture7').attr('src', clean.articles[6].urlToImage)
       $('#article_picture8').attr('src', clean.articles[7].urlToImage)
      
       $('#display_post_recent_timestamp1').text(clean.articles[0].publishedAt)
       $('#display_post_recent_timestamp2').text(clean.articles[1].publishedAt)
       $('#display_post_recent_timestamp3').text(clean.articles[2].publishedAt)
       $('#display_post_recent_timestamp4').text(clean.articles[3].publishedAt)
       $('#display_post_recent_timestamp5').text(clean.articles[4].publishedAt)
       $('#display_post_recent_timestamp6').text(clean.articles[5].publishedAt)
       $('#display_post_recent_timestamp7').text(clean.articles[6].publishedAt)
       $('#display_post_recent_timestamp8').text(clean.articles[7].publishedAt)
      
       $('#display_post_recent_comments1').attr('href', clean.articles[0].url)
       $('#display_post_recent_comments2').attr('href', clean.articles[1].url)
       $('#display_post_recent_comments3').attr('href', clean.articles[2].url)
       $('#display_post_recent_comments4').attr('href', clean.articles[3].url)
       $('#display_post_recent_comments5').attr('href', clean.articles[4].url)
       $('#display_post_recent_comments6').attr('href', clean.articles[5].url)
       $('#display_post_recent_comments7').attr('href', clean.articles[6].url)
       $('#display_post_recent_comments8').attr('href', clean.articles[7].url)
       
      
    })
    .catch((error) => {
        console.log(error); // prints Error object
    })  