interface ApiResponse<TData> {
  data: TData;
  status: number;
  ok: boolean;
}

export const httpClient = async <TResponse, TBody = undefined>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: TBody;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<TResponse>> => {
  const { method = 'GET', body, headers = {} } = options;

  const res = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = (await res.json()) as TResponse;
  return { data, status: res.status, ok: res.ok };
};

export const post = <TResponse, TBody>(endpoint: string, body: TBody) =>
  httpClient<TResponse, TBody>(endpoint, { method: 'POST', body });
