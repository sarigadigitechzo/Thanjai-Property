import { getBlogPosts, INITIAL_BLOG_POSTS } from '../utils/blogStore.js';

export { INITIAL_BLOG_POSTS };

export const BLOG_POSTS = new Proxy([], {
  get(target, prop) {
    const livePosts = getBlogPosts();
    if (prop === 'length') return livePosts.length;
    if (prop === Symbol.iterator) return livePosts[Symbol.iterator].bind(livePosts);
    if (typeof prop === 'string' && !isNaN(prop)) return livePosts[Number(prop)];
    if (typeof livePosts[prop] === 'function') return livePosts[prop].bind(livePosts);
    return livePosts[prop];
  }
});
