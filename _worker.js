// Cloudflare Worker — Static Assets Passthrough
// Serves all static files from the site directory via ASSETS binding
export default {
  async fetch(request, env) {
    if (env.ASSETS) {
      try {
        const response = await env.ASSETS.fetch(request);
        if (response.status !== 404) return response;
      } catch(e) {}
    }
    return new Response('Not Found', { status: 404 });
  }
};
