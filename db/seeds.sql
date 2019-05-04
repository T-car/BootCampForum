USE forums_db;

INSERT INTO `forums_db`.`authors` (`id`, `name`, `email`, `bio`, `forum_name`, `createdAt`, `updatedAt`) VALUES ('1', 'git', 'git@gmail.com', 'nothing', 'TestAuthor', '2019-05-01', '2019-05-01');


USE forums_db;
INSERT INTO `forums_db`.`categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('1', 'html', '2019-04-30', '2019-04-30');
INSERT INTO `forums_db`.`categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('2', 'javascript', '2019-04-30', '2019-04-30');
INSERT INTO `forums_db`.`categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('3', 'css', '2019-04-30', '2019-04-30');


INSERT INTO forums (id, post_title, post_body, up_vote, down_vote, createdAt, updatedAt, AuthorId, CategoryId)
VALUES (1,"This is a test post", "Here we are writing some text to try out the forum section", 0,0, "2019-04-30", "2019-04-30", 1,1 );

INSERT INTO forums (id, post_title, post_body, up_vote, down_vote, createdAt, updatedAt, AuthorId, CategoryId)
VALUES (2,"This is a demo post", "This is a post on CSS and how it improves the look of a website", 0,0, "2019-04-30", "2019-04-30", 1,2 );

INSERT INTO forums (id, post_title, post_body, up_vote, down_vote, createdAt, updatedAt, AuthorId, CategoryId)
VALUES (3,"This is JavaScript", "By the time you are done reading this post, you will be JavaScript Zen", 0,0, "2019-04-30", "2019-04-30", 1,3 );