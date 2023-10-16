import axios from 'axios';

export async function getCommentsForMatchingPosts(partialPostName: string): Promise<any[]> {
  try {
    const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
    if (postsResponse.status !== 200) {
      throw new Error('Unknown status code returned');
    }

    const matchingPosts = postsResponse.data.filter((post: any) => post.title.includes(partialPostName));

    if (matchingPosts.length === 0) {
      throw new Error('No matching posts found.');
    }

    const commentsPromises = matchingPosts.map((post: any) =>
      axios.get(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`)
    );

    const commentsResponses = await Promise.all(commentsPromises);

    const allComments = commentsResponses.flatMap((response: any) => {
      if (response.status !== 200) {
        throw new Error('Unknown status code returned');
      }
      return response.data;
    });

    return allComments;
  } catch (error) {
    throw error;
  }
}
