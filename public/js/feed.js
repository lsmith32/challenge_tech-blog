async function createBlogPost(event) {
    event.preventDefault();
    const title = document.querySelector('input[name="post-title"]').value;
    const post_url = document.querySelector('input[name="post-url"]').value;
    
    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            post_url
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        document.location.replace('/feed');
    } else {
        alert(response.statusText);
    }
}
  
document.querySelector('.create-blog-post').addEventListener('submit', createBlogPost);