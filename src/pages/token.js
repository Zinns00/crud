// src/utils/token.js

const ANONYMOUS_TOKEN_KEY = 'anonymousUserToken';

/**
 * 로컬 스토리지에서 익명 사용자 토큰을 가져오거나, 없으면 새로 생성하여 저장하고 반환합니다.
 * @returns {string} 익명 사용자 토큰
 */
export function getOrSetAnonymousToken() {
    let token = localStorage.getItem(ANONYMOUS_TOKEN_KEY);
    if (!token) {
        token = crypto.randomUUID();
        localStorage.setItem(ANONYMOUS_TOKEN_KEY, token);
    }
    return token;
}