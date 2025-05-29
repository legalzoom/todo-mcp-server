# Acme MCP Server

A [Model Context Protocol (MCP) server](https://modelcontextprotocol.io/introduction) showcasing MCP concepts via todos.

## Usage

mcp.json

```json
{
  "mcp": {
    "servers": {
      "acme-mcp-server": {
        "url": "http://localhost:8080/mcp",
        "type": "http",
      }
    }
  }
}
```

## Development

### Starting the Server locally

```sh
cp .env.example .env
docker compose watch
```

If you have node installed locally, you can use:

```sh
npm run start
```

### Adding Tools

[Tools](https://modelcontextprotocol.io/docs/concepts/tools) are registered in the [./src/tools](./src/tools) directory.

### Adding Resources

[Resources & Templates](https://modelcontextprotocol.io/docs/concepts/resources) are registered in the [./src/resources](./src/resources) directory.

### Adding Apps

[Apps](https://modelcontextprotocol.io/extensions/apps/overview) are registered in the [./src/apps](./src/apps) directory.

### Adding Prompts

[Prompts](https://modelcontextprotocol.io/docs/concepts/prompts) are registered in the [./src/prompts](./src/prompts) directory.

### Debugging

To debug the server, you can use [modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector) which should be running at <http://localhost:6274/?serverUrl=http://app:8080/mcp> if you're using the provided Docker setup.

### Environment Variables

See [`.env.example`](./.env.example) for required and recommended environment variables.
