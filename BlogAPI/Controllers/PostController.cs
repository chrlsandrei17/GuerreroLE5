using BlogDataLibrary.Data;
using BlogDataLibrary.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All methods require authentication by default
    public class PostController : ControllerBase
    {
        private readonly ISqlData _db;

        public PostController(ISqlData db)
        {
            _db = db;
        }

        private int GetCurrentUserId()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity != null)
            {
                var claim = identity.FindFirst(ClaimTypes.NameIdentifier);
                if (claim != null)
                {
                    return int.Parse(claim.Value);
                }
            }
            throw new Exception("User ID not found in token");
        }

        [HttpGet]
        [Route("list")]
        [AllowAnonymous] // Anyone can view posts
        public IActionResult ListPosts()
        {
            var posts = _db.ListPosts();
            return Ok(posts);
        }

        [HttpGet]
        [Route("details/{id}")]
        [AllowAnonymous] // Anyone can view post details
        public IActionResult ShowPostDetails(int id)
        {
            var post = _db.ShowPostDetails(id);
            if (post == null)
            {
                return NotFound("Post not found");
            }
            return Ok(post);
        }

        [HttpPost]
        [Route("add")]
        public IActionResult AddPost([FromBody] PostForm form)
        {
            try
            {
                var userId = GetCurrentUserId();

                var post = new PostModels
                {
                    Title = form.Title,
                    Body = form.Body,
                    UserId = userId,
                    DataCreated = DateTime.Now
                };

                _db.AddPost(post);
                return Ok("Post added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to add post: {ex.Message}");
            }
        }
    }
}