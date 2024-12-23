import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';


export const options = {
    stages: [
        { duration: '5m', target: 200 }, // ramp up
        { duration: '8h', target: 200 }, // stable
        { duration: '5m', target: 0 }, // ramp-down to 0 users
    ],
};