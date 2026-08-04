# mcp-snb-ch

Swiss National Bank (SNB) data portal MCP. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_cube` | Fetch a Swiss National Bank statistical data cube's time series as JSON. Cube discovery is limited — pick a cubeId from these documented, verified-live IDs: |
| `cube_structure` | Fetch a Swiss National Bank cube's dimensions/structure (the dimension items / series keys available within the cube). Use this to understand what a cube contains before/after calling get_cube. Verified-live cube IDs: |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "snb-ch": {
      "url": "https://gateway.pipeworx.io/snb-ch/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Snb Ch data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
