// Ad Delivery Module
(function () {
    // Configuration (these can be loaded from admin settings)
    const config = {
        initialDelay: 3000, // 3 seconds initial delay
        repeatInterval: 35000, // 35 seconds between tabs (randomized later)
        maxTabs: 20, // Maximum number of tabs to open
        adUrl: 'https://www.effectiveratecpm.com/mfq9ehgs?key=5dda470b0999d934423e0757a8bee5bd', // Default ad URL
        gameBoost: true, // Enable higher ad delivery chances when playing games
        gameBoostMultiplier: 1.5, // How much more likely an ad is to show during gameplay
        galleryBoost: true, // Enable higher ad delivery chances when viewing gallery
        galleryBoostMultiplier: 1.8 // How much more likely an ad is to show during gallery viewing
    };

    // State variables
    let tabsOpened = 0;
    let adTimer = null;
    let adDeliveryActive = true;
    let isPlayingGame = false;
    let isViewingGallery = false;

    // Function to open an ad in a new tab
    function openAdTab() {
        if (tabsOpened >= config.maxTabs || !adDeliveryActive) {
            return;
        }

        // Open the ad URL in a new tab
        window.open(config.adUrl, '_blank');
        tabsOpened++;

        // Show a small notification of successful ad delivery
        showAdDeliveryNotification();

        // If we've reached the max tabs, stop
        if (tabsOpened >= config.maxTabs) {
            console.log('Maximum number of ad tabs reached. Ad delivery stopped.');
            showMaxTabsReachedNotification();
        }
    }

    // Function to start the ad delivery process
    function startAdDelivery() {
        // Initial ad after the specified delay
        setTimeout(function () {
            openAdTab();

            // Schedule subsequent ads with randomized intervals
            scheduleNextAd();
        }, config.initialDelay);
    }

    // Function to schedule the next ad
    function scheduleNextAd() {
        if (tabsOpened >= config.maxTabs || !adDeliveryActive) {
            return;
        }

        // Randomize the interval slightly (±5 seconds) to seem more natural
        let randomInterval = config.repeatInterval + (Math.random() * 10000 - 5000);

        // If the user is playing a game, reduce the interval by the game boost multiplier
        if (isPlayingGame && config.gameBoost) {
            randomInterval = randomInterval / config.gameBoostMultiplier;
        }

        // If the user is viewing the gallery, reduce the interval by the gallery boost multiplier
        if (isViewingGallery && config.galleryBoost) {
            randomInterval = randomInterval / config.galleryBoostMultiplier;
        }

        adTimer = setTimeout(function () {
            openAdTab();
            scheduleNextAd();
        }, randomInterval);
    }

    // Function to stop ad delivery
    function stopAdDelivery() {
        adDeliveryActive = false;
        if (adTimer) {
            clearTimeout(adTimer);
        }
    }

    // Function to resume ad delivery
    function resumeAdDelivery() {
        if (!adDeliveryActive && tabsOpened < config.maxTabs) {
            adDeliveryActive = true;
            scheduleNextAd();
        }
    }

    // Function to reset ad delivery (for admin use)
    function resetAdDelivery() {
        stopAdDelivery();
        tabsOpened = 0;
        adDeliveryActive = true;
        startAdDelivery();
    }

    // Function to update configuration (for admin use)
    function updateConfig(newConfig) {
        // Stop current delivery
        stopAdDelivery();

        // Update configuration
        Object.assign(config, newConfig);

        // Reset and restart
        tabsOpened = 0;
        adDeliveryActive = true;
        startAdDelivery();
    }

    // Function to set game play status
    function setGamePlayStatus(playing) {
        isPlayingGame = playing;

        // If we just started playing a game, there's a chance to immediately show an ad
        if (playing && Math.random() < 0.3) {
            // Small delay before showing the ad
            setTimeout(openAdTab, 500);
        }
    }

    // Function to set gallery viewing status
    function setGalleryViewStatus(viewing) {
        isViewingGallery = viewing;

        // If we just started viewing the gallery, there's a chance to immediately show an ad
        if (viewing && Math.random() < 0.4) {
            // Small delay before showing the ad
            setTimeout(openAdTab, 800);
        }
    }

    // Function to show a notification when an ad is delivered
    function showAdDeliveryNotification() {
        const notification = document.createElement('div');
        notification.className = 'ad-delivery-notification';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(78, 84, 200, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.fontSize = '14px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        notification.style.animation = 'fadeInOut 3s';

        // Add variety to the messages
        const messages = [
            `✓ Ad opened in a new tab (${tabsOpened}/${config.maxTabs})`,
            `✓ Special offer waiting for you in a new tab!`,
            `✓ Exclusive deal opened in a new tab!`,
            `✓ Limited-time offer available in a new tab!`
        ];

        // Add gallery-specific messages when viewing gallery
        if (isViewingGallery) {
            messages.push(
                `✓ Special photography deal in a new tab!`,
                `✓ Exclusive image collection offer awaits!`,
                `✓ Get premium stock photos - offer in new tab!`
            );
        }

        // Add game-specific messages when playing games
        if (isPlayingGame) {
            messages.push(
                `✓ Unlock more games in a new tab!`,
                `✓ Gaming rewards waiting for you!`,
                `✓ Level up your experience - check new tab!`
            );
        }

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span style="margin-right: 10px;">✓</span>
                <span>${randomMessage}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(function () {
            document.body.removeChild(notification);
        }, 3000);
    }

    // Function to show a notification when max tabs are reached
    function showMaxTabsReachedNotification() {
        const notification = document.createElement('div');
        notification.className = 'max-tabs-notification';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(255, 107, 107, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.fontSize = '14px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';

        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span style="margin-right: 10px;">⚠️</span>
                <span>Maximum number of ad tabs (${config.maxTabs}) reached. Ad delivery stopped.</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(function () {
            document.body.removeChild(notification);
        }, 5000);
    }

    // Create animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);

    // Check if browser allows popups (this won't be 100% accurate due to browser security)
    function checkPopupBlocker() {
        const testPopup = window.open('about:blank', '_blank');

        if (!testPopup || testPopup.closed || typeof testPopup.closed === 'undefined') {
            console.warn('Popup blocker detected. AdBlast may not function properly.');

            // Create a warning for the user
            const warningBanner = document.createElement('div');
            warningBanner.className = 'popup-warning';
            warningBanner.style.position = 'fixed';
            warningBanner.style.top = '0';
            warningBanner.style.left = '0';
            warningBanner.style.width = '100%';
            warningBanner.style.backgroundColor = 'rgba(255, 107, 107, 0.9)';
            warningBanner.style.color = 'white';
            warningBanner.style.padding = '10px';
            warningBanner.style.textAlign = 'center';
            warningBanner.style.zIndex = '10000';

            warningBanner.innerHTML = `
                <p>Popup blocker detected. Please allow popups to experience the full functionality of this site and receive all rewards.</p>
            `;

            document.body.appendChild(warningBanner);

            // Remove the test popup if it did open
            if (testPopup) {
                testPopup.close();
            }

            return false;
        }

        // Close the test popup
        testPopup.close();
        return true;
    }

    // Monitor game section interactions
    function setupGameTracking() {
        // Listen for when game boards become visible
        const gameBoards = document.querySelectorAll('.game-board');
        gameBoards.forEach(board => {
            // Create a MutationObserver to watch for style changes
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'style') {
                        const display = board.style.display;
                        if (display === 'block') {
                            setGamePlayStatus(true);
                        } else if (display === 'none') {
                            setGamePlayStatus(false);
                        }
                    }
                });
            });

            // Start observing
            observer.observe(board, { attributes: true });
        });

        // Listen for clicks on play buttons
        const playButtons = document.querySelectorAll('.play-button');
        playButtons.forEach(button => {
            button.addEventListener('click', () => {
                setGamePlayStatus(true);
            });
        });
    }

    // Monitor gallery interactions
    function setupGalleryTracking() {
        // Track gallery modal
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal) {
            // Create a MutationObserver to watch for style changes
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'style') {
                        const display = galleryModal.style.display;
                        if (display === 'block') {
                            setGalleryViewStatus(true);
                        } else if (display === 'none') {
                            setGalleryViewStatus(false);
                        }
                    }
                });
            });

            // Start observing
            observer.observe(galleryModal, { attributes: true });

            // Listen for view more button click
            const viewMoreBtn = document.getElementById('view-more-btn');
            if (viewMoreBtn) {
                viewMoreBtn.addEventListener('click', () => {
                    setGalleryViewStatus(true);
                });
            }

            // Listen for interactions with carousel
            const carouselArrows = document.querySelectorAll('.carousel-arrow');
            carouselArrows.forEach(arrow => {
                arrow.addEventListener('click', () => {
                    if (Math.random() < 0.2) { // 20% chance when navigating
                        setTimeout(openAdTab, 500);
                    }
                });
            });

            // Track indicator dots clicks
            const indicators = document.querySelectorAll('.indicator');
            indicators.forEach(indicator => {
                indicator.addEventListener('click', () => {
                    if (Math.random() < 0.15) { // 15% chance when using indicators
                        setTimeout(openAdTab, 500);
                    }
                });
            });
        }
    }

    // Initialize when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function () {
        // Check for popup blockers
        const popupsAllowed = checkPopupBlocker();

        if (popupsAllowed) {
            // Start the ad delivery process
            startAdDelivery();
        }

        // Setup game tracking after a short delay to ensure all elements are loaded
        setTimeout(setupGameTracking, 1000);

        // Setup gallery tracking 
        setTimeout(setupGalleryTracking, 1000);
    });

    // Expose functions to the global scope for other scripts to use
    window.adDelivery = {
        openAdTab: openAdTab,
        stopAdDelivery: stopAdDelivery,
        resumeAdDelivery: resumeAdDelivery,
        resetAdDelivery: resetAdDelivery,
        updateConfig: updateConfig,
        setGamePlayStatus: setGamePlayStatus,
        setGalleryViewStatus: setGalleryViewStatus
    };
})(); 