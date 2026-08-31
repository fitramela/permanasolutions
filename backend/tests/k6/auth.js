import http from 'k6/http';
import { check } from 'k6';

const BASE_URL =
  __ENV.BASE_URL || 'http://localhost:4000';

export const options = {
  vus: 10,
  duration: '30s',

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const payload = JSON.stringify({
    email: 'putusutha30@gmail.com',
    password: 'admin123',
  });

  const response = http.post(
    `${BASE_URL}/api/backend/auth/login`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  check(response, {
    'login status is 200': (r) => r.status === 200,
  });
}