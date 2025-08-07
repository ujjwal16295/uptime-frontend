// utils/sessionStorage.js

// Function to clear all session storage when user logs out
export const clearCreditSession = () => {
    try {
        sessionStorage.removeItem('creditState');
    } catch (error) {
        console.warn('Could not clear credit session storage:', error);
    }
};

// Function to check if we're in a browser environment
export const isBrowser = () => {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
};

// Optional: Function to manually save credit state (if needed elsewhere)
export const saveCreditToSession = (creditDetails, success) => {
    if (!isBrowser()) return;
    
    try {
        const state = { creditDetails, success };
        sessionStorage.setItem('creditState', JSON.stringify(state));
    } catch (error) {
        console.warn('Could not save credit state to session storage:', error);
    }
};