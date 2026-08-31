import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './config.js';

export const options = {
  vus: 1,
  duration: '10s',

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/`);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) =>
      r.timings.duration < 500,
  });
}