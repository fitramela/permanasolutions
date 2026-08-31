import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './config.js';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 250 },
    { duration: '30s', target: 500 },
    { duration: '30s', target: 750 },
    { duration: '30s', target: 1000 },

    // Recovery
    { duration: '30s', target: 0 },
  ],

  thresholds: {
    http_req_failed: [
      'rate<0.05',
    ],

    http_req_duration: [
      'p(95)<1000',
    ],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/`);

  check(response, {
    'status is 200': (r) => r.status === 200,
  });
}