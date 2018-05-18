import ENV from './index';

export const FUNCTION_PATH = (ENV === "PROD") ?
    'https://us-central1-stagg-cc356.cloudfunctions.net'
    :
    'https://us-central1-stagg-test.cloudfunctions.net';
