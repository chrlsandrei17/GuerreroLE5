CREATE PROCEDURE [dbo].[spPosts_Insert]
    @userId int,
    @title nvarchar(150),
    @content nvarchar(MAX),  
    @dateCreated datetime2
AS
begin
    INSERT INTO dbo.Posts
    (UserId, Title, Body, DataCreated)
    VALUES
    (@userId, @title, @content, @dateCreated)  
end
