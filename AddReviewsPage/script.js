document.addEventListener("DOMContentLoaded", () => {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        once: true
    });

    // Initialize variables and elements
    let currentRating = 0;
    const reviewForm = document.getElementById('reviewForm');
    const successMessage = document.getElementById('successMessage');
    const reviewsContainer = document.getElementById('reviewsContainer');

    // Hide success message initially
    if (successMessage) {
        successMessage.style.display = 'none';
    }

    // Handle star rating functionality with better interaction
    setupStarRating();

    // Form submission handling
    handleFormSubmission();

    // Load reviews initially
    loadReviews();

    // Setup mobile navigation functionality
    setupMobileNavigation();

    // Setup scroll effects
    setupScrollEffects();

    // Check for URL parameters to show success message
    checkUrlParams();

    function setupStarRating() {
        const starLabels = document.querySelectorAll('.rating label');
        const starInputs = document.querySelectorAll('.rating input');

        if (!starLabels.length) return;

        // Handle hover effects for star rating
        starLabels.forEach(label => {
            label.addEventListener('mouseover', () => {
                const currentStarValue = label.getAttribute('for').replace('star', '');
                highlightStars(currentStarValue);
            });

            label.addEventListener('mouseout', () => {
                resetHighlight();
                // Keep selected stars highlighted
                if (currentRating > 0) {
                    highlightSelectedStars(currentRating);
                }
            });

            label.addEventListener('click', () => {
                const selectedValue = label.getAttribute('for').replace('star', '');
                setRating(selectedValue);
            });
        });

        // Handle direct input clicks
        starInputs.forEach(input => {
            input.addEventListener('change', () => {
                if (input.checked) {
                    setRating(input.value);
                }
            });
        });
    }

    function highlightStars(value) {
        document.querySelectorAll('.rating label').forEach(star => {
            const starValue = star.getAttribute('for').replace('star', '');
            star.classList.toggle('hover', starValue <= value);
        });
    }

    function resetHighlight() {
        document.querySelectorAll('.rating label').forEach(star => {
            star.classList.remove('hover');
        });
    }

    function highlightSelectedStars(value) {
        document.querySelectorAll('.rating label').forEach(star => {
            const starValue = star.getAttribute('for').replace('star', '');
            star.classList.toggle('selected', starValue <= value);
        });
    }

    function setRating(value) {
        currentRating = value;
        highlightSelectedStars(value);

        // Update the actual form input value
        const ratingInput = document.querySelector(`.rating input[value="${value}"]`);
        if (ratingInput) {
            ratingInput.checked = true;
        }

        // Add visual feedback
        const ratingContainer = document.querySelector('.rating');
        if (ratingContainer) {
            ratingContainer.classList.add('rated');
            setTimeout(() => {
                ratingContainer.classList.remove('rated');
            }, 300);
        }
    }

    function handleFormSubmission() {
        if (!reviewForm) return;

        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic form validation
            const location = document.getElementById('ReviewLocation').value.trim();
            const description = document.getElementById('ReviewDes').value.trim();
            const rating = document.querySelector('.rating input:checked')?.value;

            if (!location || !description || !rating) {
                showFormError('Please fill in all fields and select a rating');
                return;
            }

            // Show loading state
            const submitButton = reviewForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitButton.disabled = true;

            try {
                // Submit form data using fetch
                const formData = new FormData(reviewForm);
                const response = await fetch('addReviews.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    // Show success message
                    showSuccessMessage();

                    // Reset form
                    reviewForm.reset();
                    resetRating();

                    // Reload reviews
                    loadReviews();

                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                } else {
                    throw new Error('Server responded with an error');
                }
            } catch (error) {
                console.error('Error submitting review:', error);
                showFormError('There was a problem submitting your review. Please try again.');
            } finally {
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    function resetRating() {
        currentRating = 0;
        document.querySelectorAll('.rating input').forEach(input => {
            input.checked = false;
        });
        resetHighlight();
    }

    function showSuccessMessage() {
        if (!successMessage) return;

        successMessage.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }

    function showFormError(message) {
        // Create error message element if it doesn't exist
        let errorEl = document.getElementById('formErrorMessage');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'formErrorMessage';
            errorEl.className = 'error-message';
            reviewForm.insertBefore(errorEl, reviewForm.firstChild);
        }

        // Show error message
        errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorEl.style.display = 'block';

        // Auto-hide after 4 seconds
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 4000);
    }

    function loadReviews() {
        if (!reviewsContainer) return;

        // Show loading indicator
        reviewsContainer.innerHTML = `
            <div class="col-lg-12 text-center">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
                <p>Loading reviews...</p>
            </div>
        `;

        fetch('showReviews.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                reviewsContainer.innerHTML = '';

                if (data.length === 0) {
                    reviewsContainer.innerHTML = `
                        <div class="col-lg-12 text-center">
                            <p>No reviews yet. Be the first to share your experience!</p>
                        </div>
                    `;
                    return;
                }

                // Sort reviews by newest first (assuming there's a timestamp field)
                if (data[0].createdAt) {
                    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }

                data.forEach((review, index) => {
                    const stars = '★'.repeat(review.Review) + '☆'.repeat(5 - review.Review);
                    const reviewCard = document.createElement('div');
                    reviewCard.className = 'col-lg-6';
                    reviewCard.setAttribute('data-aos', 'fade-up');
                    reviewCard.setAttribute('data-aos-delay', (index * 100) + '');

                    reviewCard.innerHTML = `
                        <div class="review-card">
                            <div class="review-header">
                                <div class="review-location">${escapeHTML(review.ReviewLocation)}</div>
                                <div class="review-stars">${stars}</div>
                            </div>
                            <div class="review-content">"${escapeHTML(review.ReviewDes)}"</div>
                            ${review.createdAt ? `<div class="review-date">Posted on ${formatDate(review.createdAt)}</div>` : ''}
                        </div>
                    `;
                    reviewsContainer.appendChild(reviewCard);
                });

                // Refresh AOS to animate newly added elements
                AOS.refresh();
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
                reviewsContainer.innerHTML = `
                    <div class="col-lg-12 text-center">
                        <p>Unable to load reviews. Please try again later.</p>
                        <button id="retryLoadReviews" class="cta-button">Retry</button>
                    </div>
                `;

                // Add retry functionality
                document.getElementById('retryLoadReviews')?.addEventListener('click', () => {
                    loadReviews();
                });
            });
    }

    function setupMobileNavigation() {
        const navbarToggler = document.getElementById('mobile-toggle');
        const navbarLinks = document.getElementById('navbarLinks');

        if (!navbarToggler || !navbarLinks) return;

        navbarToggler.addEventListener('click', () => {
            navbarLinks.classList.toggle('active');
            navbarToggler.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navbarLinks.classList.contains('active') &&
                !navbarToggler.contains(e.target) &&
                !navbarLinks.contains(e.target)) {
                navbarLinks.classList.remove('active');
                navbarToggler.classList.remove('active');
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('#navbarLinks .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navbarLinks.classList.remove('active');
                navbarToggler.classList.remove('active');
            });
        });
    }

    function setupScrollEffects() {
        // Navigation scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.main-navbar');
            const backToTop = document.getElementById('backToTop');

            if (window.scrollY > 50 && navbar) {
                navbar.classList.add('navbar-scrolled');
            } else if (navbar) {
                navbar.classList.remove('navbar-scrolled');
            }

            if (window.scrollY > 300 && backToTop) {
                backToTop.classList.add('show');
            } else if (backToTop) {
                backToTop.classList.remove('show');
            }
        });

        // Back to top button functionality
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true' && successMessage) {
            showSuccessMessage();
            // Scroll to the success message
            successMessage.scrollIntoView();
        }
    }

    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Helper function to escape HTML to prevent XSS
    function escapeHTML(str) {
        if (!str) return '';

        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});