export async function onRequest(context) {
  const { request, env } = context;
  const { headers } = request;

  // アクセスされたURLのドメイン名（ホスト名）を取得
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Cloudflareの環境変数から本番ドメイン名を読み込む
  const PRODUCTION_DOMAIN = env.PRODUCTION_DOMAIN || '';

  // 環境変数が設定されていない場合は安全のためエラーを返す（設定漏れ対策）
  if (!PRODUCTION_DOMAIN) {
    return new Response('Production Domain Configuration Missing', { status: 500 });
  }

  // アクセスされたドメインが、環境変数で指定した本番ドメイン「ではない」場合のみBasic認証を実行
  if (hostname !== PRODUCTION_DOMAIN) {
    // Cloudflareの環境変数からBasic認証の情報を読み込み
    const VALID_USER = env.BASIC_AUTH_USER || '';
    const VALID_PASS = env.BASIC_AUTH_PASS || '';

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

  // 本番ドメインからのアクセスは、ノーチェックでそのまま通過
  return await context.next();
}
