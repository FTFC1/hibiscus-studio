# 🔹 How to Add a New MCP Tool to the Trello MCP Server

## 1. Register the Tool
- In `src/index.ts`, find the `setupToolHandlers()` method.
- Add your tool to the `tools` array:

```typescript
{
  name: 'your_tool_name',
  description: 'What your tool does',
  inputSchema: {
    type: 'object',
    properties: { /* your params */ },
    required: [/* required param names */],
  },
}
```

## 2. Add a Handler for the Tool
- In the same file, find the `this.server.setRequestHandler(CallToolRequestSchema, ...)` switch statement.
- Add a new case for your tool:

```typescript
case 'your_tool_name': {
  // Call your function, return result
  const result = await this.trelloClient.yourFunction(args);
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
}
```

## 3. Build and Restart the Server
- Run:
  ```bash
  npm run build
  pkill -f 'node ./build/index.js' || true
  nohup node ./build/index.js > mcp-server.log 2>&1 &
  ```

## 4. Verify in Cursor
- Open Cursor MCP settings and ensure your tool appears in the available tools list.
- Trigger the tool and check for expected output.

---

**Troubleshooting:**
- If the tool does not appear, check for typos in the tool name and rebuild.
- Check `mcp-server.log` for errors or debug output.

🤖 