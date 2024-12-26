import http from "k6/http";
import { sleep, check } from "k6";

const BASE_URL = 'https://telegrammy.tech/api/v1';

export const options = {
    stages: [
        { duration: "5s", target: 500 },
        { duration: "1m", target: 500 },
        { duration: "5s", target: 0 },
    ],
    thresholds: {
        http_req_duration: ["p(80)<1000"],
    },
};

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateRandomPhone() {
    return '01' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}

function generateVerificationCode() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789#@$%';
    let code = '';
    for (let i = 0; i < 12; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

function generateRegistrationPayload() {
    const timestamp = new Date().getTime();
    const username = `${generateRandomString(5)}_${timestamp}`;
    const email = `${username}@example.com`;
    const password = generateRandomString(12);

    return {
        username: username,
        email: email,
        password: password,
        passwordConfirm: password,
        phone: generateRandomPhone()
    };
}

function generateVerificationPayload(email = null) {
    return {
        email: email || `${generateRandomString(8)}@example.com`,
        verificationCode: generateVerificationCode()
    };
}

function generateLoginPayload() {
    const timestamp = new Date().getTime();
    return {
        "UUID": `${generateRandomString(5)}_${timestamp}@example.com`,
        "password": generateRandomPhone()
    }
}

export default () => {
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const registrationPayload = generateRegistrationPayload();
    const registrationRes = http.post(
        `${BASE_URL}/auth/register`,
        JSON.stringify(registrationPayload),
        params
    );

    check(registrationRes, {
        'registration status is 200': (r) => r.status === 201
    });

    sleep(1);

    const verificationPayload = generateVerificationPayload(registrationPayload.email);
    const verificationRes = http.post(
        `${BASE_URL}/auth/verify`,
        JSON.stringify(verificationPayload),
        params
    );

    check(verificationRes, {
        'verification status is 400': (r) => r.status === 400
    });

    sleep(1);

    const loginPayload = generateLoginPayload();
    const loginRes = http.post(
        `${BASE_URL}/auth/login`,
        JSON.stringify(loginPayload),
        params
    )
    check(loginRes, {
        'Login status is 401': (r) => r.status === 401
    });

    sleep(1);
};