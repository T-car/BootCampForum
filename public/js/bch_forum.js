var bodyInput = $("#post_body");
var titleInput = $("#post_title");
var cmsForm = $("#post_forum");
var editForum = $("#edit_forum");
var postCategorySelect = $("#post_category");
var postEditId = $("#edit_button").attr('data-editid')

postCategorySelect.val("Personal");
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
        post_category: postCategorySelect.val()
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


//  // Gets post data for a post if we're editing
//  function getPostData(id) {
//     $.get("/api/forums/edit/" + id, function(data) {
//       if (data) {
//         // If this post exists, prefill our cms forms with its data
//         titleInput.val(data.title);
//         bodyInput.val(data.body);
//         postCategorySelect.val(data.category);
//         // If we have a post with this id, set a flag for us to know to update the post
//         // when we hit submit
//         updating = true;
//       }
//     });
//   }

// var postEdit = $('.display_post_edit');

// $('#edit_forum').on("submit", function (event) {

//     // var postEditId = $("#edit_button").attr('data-editid')
//     console.log("this is " + postEditId)

//     return false;

//     // $.ajax({
//     //   method: "PUT",
//     //   url: "/api/forums/" + postEditId,
//     //   data: post
//     // })
//     //   .then(function() {
//     //     window.location.href = "/forum";
//     //   });
// });

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
