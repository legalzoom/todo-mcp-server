// Concept: Tool results — tools return content (text, image, audio, resource
// links, embedded resources) and/or structuredContent when an outputSchema is
// defined. The `isError` flag differentiates tool execution errors from success.
// https://modelcontextprotocol.io/specification/2025-11-25/server/tools#tool-result
//
// Response shapes loosely follow the JSON:API specification.
// https://jsonapi.org/format/

interface SuccessResponse {
  data: unknown;
  links?: Record<string, string>;
  meta?: Record<string, unknown>;
}

interface ErrorResponse {
  errors: Array<{
    detail: string;
    meta?: Record<string, unknown>;
  }>;
}

type ResponseBody = SuccessResponse | ErrorResponse;

export const errorMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error));

// Wraps a response body into the MCP CallToolResult shape.
// JSON:API responses (with `data` or `errors`) are serialized as text in `content`.
//
// For structured output (outputSchema), skip this helper and return
// { structuredContent, content } directly from your tool callback.
// See listTodosTool for an example.
export function toolResponse(content: SuccessResponse): {
  content: [{ type: 'text'; text: string; mimeType: 'application/json' }];
  isError: false;
};
export function toolResponse(content: ErrorResponse): {
  content: [{ type: 'text'; text: string; mimeType: 'application/json' }];
  isError: true;
};
export function toolResponse(content: SuccessResponse | ErrorResponse) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(content, null, 2), mimeType: 'application/json' as const }],
    isError: 'errors' in content,
  };
}

export const resourceResponse = (body: ResponseBody, uri: URL) => {
  const { links, ...rest } = body as SuccessResponse;
  const merged = { ...rest, links: { self: uri.href, ...links } };

  return {
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(merged, null, 2),
        mimeType: 'application/json',
      },
    ],
  };
};
