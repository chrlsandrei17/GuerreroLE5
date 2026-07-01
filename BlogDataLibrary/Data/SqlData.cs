using BlogDataLibrary.DataBase;
using BlogDataLibrary.Models;
using System;
using System.Collections.Generic;

namespace BlogDataLibrary.Data
{
    public class SqlData : ISqlData
    {
        private readonly ISqlDataAccess _db;

        private const string connectionStringName = "SqlDb";

        public SqlData(ISqlDataAccess db)
        {
            _db = db;
        }

        public UserModel Authenticate(string username, string password)
        {
            List<UserModel> results =
                _db.LoadData<UserModel, dynamic>(
                    "dbo.spUsers_Authenticate",
                    new
                    {
                        username,
                        password
                    },
                    connectionStringName,
                    true);

            if (results.Count == 0)
            {
                return null;
            }

            return results[0];
        }

        public void Register(
            string username,
            string firstName,
            string lastName,
            string password)
        {
            _db.SaveData(
                "dbo.spUsers_Register",
                new
                {
                    username,
                    firstName,
                    lastName,
                    password
                },
                connectionStringName,
                true);
        }

        public void AddPost(PostModels post)
        {
            if (post == null)
            {
                throw new ArgumentNullException(nameof(post));
            }

            if (string.IsNullOrWhiteSpace(post.Title))
            {
                throw new ArgumentException("Title is required.");
            }

            if (string.IsNullOrWhiteSpace(post.Body))
            {
                throw new ArgumentException("Body is required.");
            }

            if (string.IsNullOrEmpty(post.Body))
            {
                throw new ArgumentException("Post content cannot be empty");
            }

            _db.SaveData(
                "dbo.spPosts_Insert",
                new
                {
                    userId = post.UserId,
                    title = post.Title,
                    content = post.Body,
                    dateCreated = post.DataCreated // <-- Change here
                },
                connectionStringName,
                true);
        }

        public List<ListPostModels> ListPosts()
        {
            return _db.LoadData<ListPostModels, dynamic>(
                "dbo.spPosts_List",
                new { },
                connectionStringName,
                true);
        }

        public PostModels ShowPostDetails(int postId)
        {
            List<PostModels> results =
                _db.LoadData<PostModels, dynamic>(
                    "dbo.spPosts_Detail",
                    new
                    {
                        postId
                    },
                    connectionStringName,
                    true);

            if (results.Count == 0)
            {
                return null;
            }

            return results[0];
        }
    }
}