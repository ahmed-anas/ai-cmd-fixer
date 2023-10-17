import axios, { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getCommentsForMatchingPosts } from '../src/main';

describe('getCommentsForMatchingPosts', () => {
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = new MockAdapter(axios, { onNoMatch: 'throwException' });
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it('should fetch comments for matching posts', async () => {
        // Mock the response for fetching posts
        const postsResponseData = [
            { id: 1, title: 'Matching Post 1' },
            { id: 2, title: 'Non-Match Post' },
            { id: 3, title: 'Matching Post 2' },
        ];
        mockAxios.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, postsResponseData);

        // Mock the response for fetching comments for matching posts
        const commentsResponseData = [
            { postId: 1, id: 101, body: 'Comment 1 for Matching Post 1' },
            { postId: 1, id: 102, body: 'Comment 2 for Matching Post 1' },
            { postId: 3, id: 103, body: 'Comment 1 for Matching Post 2' },
        ];
        mockAxios.onGet('https://jsonplaceholder.typicode.com/posts/1/comments').reply(200, commentsResponseData.slice(0, 2));
        mockAxios.onGet('https://jsonplaceholder.typicode.com/posts/3/comments').reply(200, commentsResponseData.slice(2));

        const partialPostName = 'Matching';

        const comments = await getCommentsForMatchingPosts(partialPostName);

        expect(comments).toHaveLength(3);
        expect(comments[0].body).toBe('Comment 1 for Matching Post 1');
        expect(comments[1].body).toBe('Comment 2 for Matching Post 1');
        expect(comments[2].body).toBe('Comment 1 for Matching Post 2');
    });

    it('should handle no matching posts', async () => {
        // Mock the response for fetching posts
        const postsResponseData = [
            { id: 2, title: 'Non-Match Post' },
            { id: 4, title: 'Another Non-Match Post' },
        ];
        mockAxios.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, postsResponseData);

        const partialPostName = 'Matching';

        try {
            await getCommentsForMatchingPosts(partialPostName);
            fail('The promise should have rejected.');
        } catch(err) {
            expect((err as Error).message).toBe('No matching posts found.');
        }
    });

    it('should handle API request non-200 error code', async () => {
        mockAxios.onGet('https://jsonplaceholder.typicode.com/posts').reply(204, []);

        const partialPostName = 'Matching';

        try {
            await getCommentsForMatchingPosts(partialPostName);
            fail('The promise should have rejected.');
        } catch(err) {
            expect((err as Error).message).toBe('Unknown status code returned');
        }
    });

    it('should handle API request failure when fetching posts', async () => {
        mockAxios.onGet('https://jsonplaceholder.typicode.com/posts').reply(500, 'My test error');

        const partialPostName = 'Matching';

        try {
            await getCommentsForMatchingPosts(partialPostName);
            fail('The promise should have rejected.');
        } catch(err) {
            expect((err as AxiosError).response?.data).toBe('My test error');
        }
    });

    it('should handle API request failure when fetching comments', async () => {
        // Mock the response for fetching posts
        const postsResponseData = [{ id: 1, title: 'Matching Post' }];
        mockAxios.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, postsResponseData);

        // Mock the response for fetching comments
        mockAxios.onGet('https://jsonplaceholder.typicode.com/posts/1/comments').reply(500, 'My test error');

        const partialPostName = 'Matching';

        try {
            await getCommentsForMatchingPosts(partialPostName);
            fail('The promise should have rejected.');
        } catch(err) {
            expect((err as AxiosError).response?.data).toBe('My test error');
        }
    });
});
