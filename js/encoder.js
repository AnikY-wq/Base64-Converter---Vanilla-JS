/**
 * Base64 Encoder Module
 * Contains pure functions for encoding and decoding text to/from Base64
 * with support for different character encodings
 */

const Encoder = (() => {
    /**
     * Encodes text to Base64 with specified character encoding
     * @param {string} text - The text to encode
     * @param {string} charset - Character encoding to use
     * @returns {Object} - Result object with success status, value and any error
     */
    function encodeToBase64(text, charset) {
        if (!text) {
            return { success: false, error: 'No text provided for encoding' };
        }

        try {
            // Different handling based on charset
            let base64String;

            if (charset === 'UTF-8') {
                // UTF-8 encoding using built-in functions
                base64String = btoa(
                    encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => {
                        return String.fromCharCode('0x' + p1);
                    })
                );
            } else if (charset === 'ASCII') {
                // Simple ASCII encoding
                base64String = btoa(text);
            } else if (charset === 'ISO-8859-1') {
                // ISO-8859-1 (Latin-1) encoding
                base64String = btoa(
                    Array.from(text)
                        .map(char => {
                            const code = char.charCodeAt(0);
                            return code <= 255 ? char : '?'; // Replace non-Latin1 chars with ?
                        })
                        .join('')
                );
            } else if (charset === 'UTF-16') {
                // UTF-16 encoding
                const uint8Array = new TextEncoder().encode(text);
                base64String = arrayBufferToBase64(uint8Array.buffer);
            } else {
                return {
                    success: false,
                    error: `Unsupported character encoding: ${charset}`
                };
            }

            return {
                success: true,
                value: base64String
            };
        } catch (error) {
            return {
                success: false,
                error: `Encoding error: ${error.message}`
            };
        }
    }

    /**
     * Decodes Base64 to text with specified character encoding
     * @param {string} base64 - The Base64 string to decode
     * @param {string} charset - Character encoding to use
     * @returns {Object} - Result object with success status, value and any error
     */
    function decodeFromBase64(base64, charset) {
        if (!base64) {
            return { success: false, error: 'No Base64 string provided for decoding' };
        }

        // Check if the input is valid Base64
        if (!isValidBase64(base64)) {
            return { success: false, error: 'Invalid Base64 input' };
        }

        try {
            let decodedString;

            if (charset === 'UTF-8') {
                // UTF-8 decoding
                decodedString = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
            } else if (charset === 'ASCII') {
                // Simple ASCII decoding
                decodedString = atob(base64);
            } else if (charset === 'ISO-8859-1') {
                // ISO-8859-1 (Latin-1) decoding
                decodedString = atob(base64);
            } else if (charset === 'UTF-16') {
                // UTF-16 decoding
                const arrayBuffer = base64ToArrayBuffer(base64);
                decodedString = new TextDecoder('utf-8').decode(new Uint8Array(arrayBuffer));
            } else {
                return {
                    success: false,
                    error: `Unsupported character encoding: ${charset}`
                };
            }

            return {
                success: true,
                value: decodedString
            };
        } catch (error) {
            return {
                success: false,
                error: `Decoding error: ${error.message}`
            };
        }
    }

    /**
     * Validates if a string is valid Base64
     * @param {string} str - String to validate
     * @returns {boolean} - Whether the string is valid Base64
     */
    function isValidBase64(str) {
        if (!str) return false;

        // Remove padding and check if the string matches valid Base64 pattern
        const nonPaddedStr = str.replace(/=+$/, '');
        return /^[A-Za-z0-9+/]*$/.test(nonPaddedStr);
    }

    /**
     * Converts an ArrayBuffer to a Base64 string
     * @param {ArrayBuffer} buffer - The buffer to convert
     * @returns {string} - Base64 string
     */
    function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Converts a Base64 string to an ArrayBuffer
     * @param {string} base64 - Base64 string to convert
     * @returns {ArrayBuffer} - The resulting ArrayBuffer
     */
    function base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Public API
    return {
        encodeToBase64,
        decodeFromBase64,
        isValidBase64
    };
})();