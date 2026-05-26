export async function onRequest(context) {
  const { request, env } = context;
  const { headers } = request;

  const VALID_USER = env.BASIC_AUTH_USER || '';
  const VALID_PASS = env.BASIC_AUTH_PASS || '';

  // 環境変数が設定されていない場合はエラーを返す（設定漏れ対策）
  if (!VALID_USER || !VALID_PASS) {
    return new Response('Basic Auth Configuration Missing', { status: 500 });
  }

  const authHeader = headers.get('Authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const base64 = authHeader.split(' ')[1];
      const decoded = atob(base64);
      const [user, pass] = decoded.split(':');

      if (user === VALID_USER && pass === VALID_PASS) {
        return await context.next();
      }
    } catch (e) {
      // エラー時は下の認証要求へ
    }
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
