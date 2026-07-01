using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BlogDataLibrary.Models;

namespace BlogDataLibrary.Data
{
    public interface ISqlData
    {
        UserModel Authenticate(string username, string password);
        void Register(string username, string firstName, string lastName, string password);
        void AddPost(PostModels post);  
        List<ListPostModels> ListPosts();  
        PostModels ShowPostDetails(int postId);  
    }
}
