/**
 * ECCジュニア大学前 Digital Signage Slideshow
 * Highschool Version - Slideshow Controller with Wipe Transitions
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        slideDisplayTime: 5000,      // 5 seconds per slide (as per new spec)
        transitionDuration: 600,     // 0.6 seconds transition
        totalSlides: 7
    };

    // Transition mapping from data-transition to CSS class
    const TRANSITION_MAP = {
        'diagonal-left': 'wipe-diagonal-left',
        'vertical-down': 'wipe-vertical-down',
        'diagonal-corner': 'wipe-diagonal-corner',
        'circular': 'wipe-circular',
        'shutter': 'wipe-shutter',
        'squeeze': 'wipe-squeeze',
        'fade-vertical': 'wipe-fade-vertical'
    };

    // State
    let currentSlide = 0;
    let slides = [];
    let isTransitioning = false;
    let autoPlayInterval = null;

    /**
     * Initialize the slideshow
     */
    function init() {
        slides = document.querySelectorAll('.slide');

        if (slides.length === 0) {
            console.error('No slides found');
            return;
        }

        // Ensure first slide is active
        slides[0].classList.add('active');

        // Start autoplay
        startAutoPlay();

        console.log(`Slideshow initialized with ${slides.length} slides (${CONFIG.slideDisplayTime / 1000}s per slide)`);
    }

    /**
     * Get the transition class for a slide
     */
    function getTransitionClass(slideElement) {
        const transitionType = slideElement.dataset.transition;
        return TRANSITION_MAP[transitionType] || 'wipe-diagonal-left';
    }

    /**
     * Clear all wipe classes from a slide
     */
    function clearWipeClasses(slideElement) {
        Object.values(TRANSITION_MAP).forEach(cls => {
            slideElement.classList.remove(cls);
        });
    }

    /**
     * Go to the next slide
     */
    function nextSlide() {
        if (isTransitioning) return;

        isTransitioning = true;

        const prevSlide = currentSlide;
        currentSlide = (currentSlide + 1) % slides.length;

        const prevSlideEl = slides[prevSlide];
        const nextSlideEl = slides[currentSlide];

        // Get the transition type for the incoming slide
        const wipeClass = getTransitionClass(nextSlideEl);

        // Remove active from previous slide and add exiting
        prevSlideEl.classList.remove('active');
        prevSlideEl.classList.add('exiting');

        // Clear any previous wipe classes and add the new one
        clearWipeClasses(nextSlideEl);
        nextSlideEl.classList.add(wipeClass);

        // Add active to new slide
        nextSlideEl.classList.add('active');

        // Clean up after transition
        setTimeout(() => {
            prevSlideEl.classList.remove('exiting');
            clearWipeClasses(prevSlideEl);
            isTransitioning = false;
        }, CONFIG.transitionDuration);
    }

    /**
     * Start automatic slideshow
     */
    function startAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }

        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, CONFIG.slideDisplayTime);
    }

    /**
     * Stop automatic slideshow
     */
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose controls for debugging (optional)
    window.slideshow = {
        next: nextSlide,
        start: startAutoPlay,
        stop: stopAutoPlay,
        getCurrentSlide: () => currentSlide
    };
})();
