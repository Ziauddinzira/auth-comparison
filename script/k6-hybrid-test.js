import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1000,
    duration: '10s',
    thresholds: {
        'http_req_duration{p(95)}': ['<150'],
        'http_req_failed': ['rate<0.01'],
    },
};

const BASE_URL = __ENV.APP === 'jwt'
    ? 'http://<ec2-ip>:3001/login'
    : __ENV.APP === 'oauth2'
        ? 'http://<ec2-ip>:3002/auth/google'
        : 'http://<ec2-ip>:3003/login';

export default function () {
    const res = http.get(BASE_URL);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'no redirect loop': (r) => !r.url.includes('redirect'),
    });
    sleep(1);
}