import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';


export const options = {
    stages: [
        { duration: '20s', target: 2000 }, // ramp up
        { duration: '1m', target: 2000 }, // stable
        { duration: '20s', target: 0 }, // ramp-down to 0 users
    ],
};

