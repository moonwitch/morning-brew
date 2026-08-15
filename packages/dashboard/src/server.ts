import index from "./index.html";

const port = Number(process.env.PORT || 3000);

const server = Bun.serve({
  port,
  routes: {
    "/": index,
    "/api/health": {
      GET() {
        return Response.json({ status: "ok", name: "MorningBrew", version: "0.1.0" });
      },
    },
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`☕ MorningBrew Dashboard server running at http://localhost:${server.port}`);
