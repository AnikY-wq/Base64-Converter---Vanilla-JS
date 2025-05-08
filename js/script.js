/**
 * Main Application Script
 * Connects the UI with encoder functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const charsetSelect = document.getElementById('charset');
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');

    /**
     * Handle encoding process
     */
    function handleEncode() {
        const text = inputText.value;
        const charset = charsetSelect.value;

        if (!text) {
            UI.showMessage('Please enter text to encode', 'error');
            return;
        }

        const result = Encoder.encodeToBase64(text, charset);

        if (result.success) {
            outputText.value = result.value;
            UI.showMessage('Text encoded successfully', 'success');
        } else {
            UI.showMessage(result.error, 'error');
        }
    }

    /**
     * Handle decoding process
     */
    function handleDecode() {
        const base64 = inputText.value;
        const charset = charsetSelect.value;

        if (!base64) {
            UI.showMessage('Please enter Base64 to decode', 'error');
            return;
        }

        const result = Encoder.decodeFromBase64(base64, charset);

        if (result.success) {
            outputText.value = result.value;
            UI.showMessage('Base64 decoded successfully', 'success');
        } else {
            UI.showMessage(result.error, 'error');
        }
    }

    /**
     * Handle textarea focus and blur events
     */
    function setupTextareaEffects() {
        const textareas = document.querySelectorAll('textarea');

        textareas.forEach(textarea => {
            // Auto resize textarea based on content
            textarea.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });

            // Select all text on focus if the textarea has content
            textarea.addEventListener('focus', function () {
                if (this.value.length > 0) {
                    this.select();
                }
            });
        });
    }

    /**
     * Handle keyboard shortcuts
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + E for encode
            if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
                e.preventDefault();
                handleEncode();
            }

            // Cmd/Ctrl + D for decode
            if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
                e.preventDefault();
                handleDecode();
            }
        });
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        encodeBtn.addEventListener('click', handleEncode);
        decodeBtn.addEventListener('click', handleDecode);

        // Make output area only selectable, not editable
        outputText.addEventListener('keydown', (e) => {
            const isSelectionKeys = e.ctrlKey || e.metaKey ||
                (e.key === 'ArrowLeft') ||
                (e.key === 'ArrowRight') ||
                (e.key === 'ArrowUp') ||
                (e.key === 'ArrowDown');

            if (!isSelectionKeys) {
                if (e.key !== 'Tab') {
                    e.preventDefault();
                }
            }
        });

        // Process input on Enter key if Shift is pressed
        inputText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                handleEncode();
            }
        });

        // Update UI when charset changes
        charsetSelect.addEventListener('change', () => {
            // If output already has content, re-process with new charset
            if (outputText.value && inputText.value) {
                const isEncoded = Encoder.isValidBase64(inputText.value);
                if (isEncoded) {
                    handleDecode();
                } else {
                    handleEncode();
                }
            }
        });
    }

    // Initialize components
    setupTextareaEffects();
    setupKeyboardShortcuts();
    setupEventListeners();

    // Focus input on load
    inputText.focus();
});