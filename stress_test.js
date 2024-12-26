import http from "k6/http";
import { sleep, check } from "k6";

const BASE_URL = 'https://telegrammy.tech/api/v1';

export const options = {
    stages: [
        { duration: '10s', target: 1000 }, // ramp up
        { duration: '2m', target: 1000 }, // stable
        { duration: '20s', target: 5000 }, // ramp up
        { duration: '2m', target: 5000 }, // stable
        { duration: '30s', target: 10000 }, // ramp up
        { duration: '2m', target: 10000 }, // stable
        { duration: '1m', target: 0 }, // ramp-down to 0 users
    ],
};
function generateRandomToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    function generatePart(length) {
        let part = '';
        for (let i = 0; i < length; i++) {
            part += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return part;
    }
    const header = generatePart(36);
    const payload = generatePart(180);
    const signature = generatePart(43);
    return `${header}.${payload}.${signature}`;
}

function generateParams() {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${generateRandomToken()}`
        },
    };
}
export default () => {

    const params = generateParams();
    const payload = JSON.stringify({});

    const chatsRes = http.get(
        `${BASE_URL}/chats/all-chats?page=1&limit=10`,
        payload,
        params
    );
    check(chatsRes, {
        'All chats status is 404': (r) => r.status === 404
    });
    sleep(1);

    const settingsRes = http.get(
        `${BASE_URL}/privacy/settings/get-settings`,
        payload,
        params
    );
    check(settingsRes, {
        'privacy settings status is 500': (r) => r.status === 500
    });
    sleep(1);

    const profileStatusRes = http.get(
        `${BASE_URL}/user/profile/status`,
        payload,
        params
    );
    check(profileStatusRes, {
        'profile info status is 404': (r) => r.status === 404
    });
    sleep(1);
};


