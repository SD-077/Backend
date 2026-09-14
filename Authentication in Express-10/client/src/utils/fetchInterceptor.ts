import { VITE_APP_AUTH_SERVER_URL } from '@/config';

const originalFetch = window.fetch;

window.fetch = async (url, options) => {
  const originalRes = await originalFetch(url, options);
  const authHeader = originalRes.headers.get('www-authenticate');
  console.log(
    'WWW-Authenticate:',
    authHeader,
    'IS THE TOKEN NOT EXPIRED:',
    !authHeader?.includes('token_expired'),
  );
  if (!authHeader?.includes('token_expired')) return originalRes;

  console.log('ATTEMPT REFRESH');
  const refreshRes = await originalFetch(`${VITE_APP_AUTH_SERVER_URL}/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!refreshRes.ok) throw new Error('Login required');

  const { accessToken } = await refreshRes.json();
  localStorage.setItem('accessToken', accessToken);

  const retryRes = await originalFetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return retryRes;
};
