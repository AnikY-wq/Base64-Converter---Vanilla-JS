/**
 * UI Module
 * Handles UI interactions like theme toggling, copy functionality,
 * and displaying messages to the user
 */

const UI = (() => {
    // Cache DOM elements
    const elements = {
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),
        copyBtn: document.getElementById('copy-btn'),
        message: document.getElementById('message'),
        currentYear: document.getElementById('current-year'),
        outputText: document.getElementById('output-text')
    };

    /**
     * Initialize UI components
     */
    function init() {
        setupThemeToggle();
        setupCopyButton();
        setCurrentYear();
    }

    /**
     * Set up theme toggle functionality
     */
    function setupThemeToggle() {
        // Check for user preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');

        // Set initial theme based on saved preference or system preference
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            document.body.classList.add('dark-theme');
            elements.themeIcon.innerText = 'light_mode';
        } else {
            elements.themeIcon.innerText = 'dark_mode';
        }

        // Toggle theme on button click
        elements.themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');

            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                elements.themeIcon.innerText = 'light_mode';
            } else {
                localStorage.setItem('theme', 'light');
                elements.themeIcon.innerText = 'dark_mode';
            }
        });
    }

    /**
     * Set up copy button functionality
     */
    function setupCopyButton() {
        elements.copyBtn.addEventListener('click', async () => {
            const text = elements.outputText.value;

            if (!text) {
                showMessage('Nothing to copy', 'error');
                return;
            }

            try {
                await navigator.clipboard.writeText(text);
                showMessage('Copied to clipboard!', 'success');

                // Visual feedback
                elements.copyBtn.classList.add('active');
                setTimeout(() => {
                    elements.copyBtn.classList.remove('active');
                }, 500);
            } catch (err) {
                showMessage('Failed to copy text', 'error');
            }
        });
    }

    /**
     * Display a message to the user
     * @param {string} text - Message text
     * @param {string} type - Message type ('success' or 'error')
     */
    function showMessage(text, type = 'success') {
        elements.message.textContent = text;
        elements.message.className = `message ${type} fade-in`;

        // Hide message after 3 seconds
        setTimeout(() => {
            elements.message.classList.add('hidden');
        }, 3000);
    }

    /**
     * Set current year in footer
     */
    function setCurrentYear() {
        elements.currentYear.textContent = new Date().getFullYear();
    }

    // Public API
    return {
        init,
        showMessage
    };
})();

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', UI.init);