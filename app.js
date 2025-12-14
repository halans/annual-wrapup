// Core Engine Logic

document.addEventListener('DOMContentLoaded', () => {
    console.log("Wrap-Up App Initialized");

    // Quick check to see if data is loaded
    if (typeof WRAP_UP_DATA === 'undefined') {
        console.error("Data not loaded!");
        document.getElementById('slide-container').innerHTML = "Error: Data file missing.";
        return;
    }

    const app = new WrapUpApp(WRAP_UP_DATA);
    app.init();
});

class WrapUpApp {
    constructor(data) {
        this.data = data;
        this.slides = data.slides;
        this.currentSlideIndex = 0;
        this.dom = {
            container: document.getElementById('slide-container'),
            progressContainer: document.getElementById('progress-container'),
            prevZone: document.getElementById('prev-zone'),
            nextZone: document.getElementById('next-zone'),
        };
        this.timer = null; // The setTimeout for the next slide
        this.slideDuration = 5000; // Default 5 seconds per slide
        this.isPaused = false;
    }

    init() {
        console.log("Initializing with", this.slides.length, "slides");
        this.setupNavigation();
        this.renderProgressBars();
        this.showSlide(0);
    }

    setupNavigation() {
        this.dom.prevZone.addEventListener('click', (e) => {
            e.stopPropagation();
            this.prevSlide();
        });
        this.dom.nextZone.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextSlide();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') this.nextSlide();
            if (e.key === 'ArrowLeft') this.prevSlide();
        });

        // Pause on hold (desktop/mouse mainly, logic differs for touch but good for now)
        const appContainer = document.querySelector('.app-container');
        appContainer.addEventListener('mousedown', () => this.pause());
        appContainer.addEventListener('mouseup', () => this.resume());
        appContainer.addEventListener('touchstart', () => this.pause());
        appContainer.addEventListener('touchend', () => this.resume());
    }

    pause() {
        this.isPaused = true;
        const activeBar = document.querySelector('.progress-bar.active');
        if (activeBar) {
            // Freezing CSS transition is tricky without complex JS. 
            // For MVP, we just pause the timer so it doesn't skip.
            // Visual pause can be added later if needed.
            activeBar.style.transitionPlayState = 'paused';
        }
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    resume() {
        if (!this.isPaused) return; // Prevent double resume
        this.isPaused = false;
        const activeBar = document.querySelector('.progress-bar.active');
        if (activeBar) {
            activeBar.style.transitionPlayState = 'running';
        }
        // Ideally we would calculate remaining time, but for MVP we just restart or finish?
        // Let's just immediately go next if the user held it long enough.
        // Simple approach: The timer was cleared. We need to manually trigger next 
        // if we want to continue "automatically" or just let the user tap.
        // "Story" behavior usually resumes where it left off.
        // Complex to implement perfectly without requestAnimationFrame.
        // Fallback: Just restart the slide logic (simple) or do nothing and wait for tap?
        // Let's do nothing and user must tap, OR restart timer for full duration?
        // Better: Story resumes.
        // Let's keep it simple: Release -> continue playing but maybe reset timer?
        // Let's just cancel auto-advance on pause and expect user interaction to move, 
        // OR simply don't implement pause for the alpha version to keep it simple.
        // ACTUALLY: Let's remove complex pause logic for this step specific to `resume` 
        // because correct "resume from exact spot" requires non-CSS animation.
        // We will stick to basic auto-advance.
        this.startSlideTimer();
    }

    renderProgressBars() {
        this.dom.progressContainer.innerHTML = '';
        this.slides.forEach((slide, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'progress-bar-wrapper';
            wrapper.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent other clicks
                this.showSlide(index);
            });

            const bar = document.createElement('div');
            bar.className = 'progress-bar';
            bar.id = `valid-progress-${index}`;
            wrapper.appendChild(bar);
            this.dom.progressContainer.appendChild(wrapper);
        });
    }

    resetProgressBars() {
        // Reset all bars to 0 and remove classes
        const bars = document.querySelectorAll('.progress-bar');
        bars.forEach(bar => {
            bar.style.transition = 'none';
            bar.style.width = '0%';
            bar.classList.remove('active', 'completed');
        });
        // Force reflow
        void this.dom.progressContainer.offsetWidth;
    }

    showSlide(index) {
        if (index < 0) return;
        if (index >= this.slides.length) {
            console.log("End of Wrapped");
            return;
        }

        // Stop any existing timer
        if (this.timer) clearTimeout(this.timer);

        this.currentSlideIndex = index;

        // Render content
        const slideData = this.slides[index];
        this.renderSlideContent(slideData);

        // Update Theme
        document.querySelector('.app-container').style.backgroundColor = slideData.bg_color || '#121212';
        document.querySelector('.app-container').style.color = slideData.text_color || '#ffffff';

        // Update progress visuals
        this.updateProgressBars(index);

        // Start timer for next slide
        this.startSlideTimer();
    }

    updateProgressBars(currentIndex) {
        const bars = document.querySelectorAll('.progress-bar');
        bars.forEach((bar, index) => {
            // Remove transitions to instantly set state for past/future slides
            bar.style.transition = 'none';

            if (index < currentIndex) {
                bar.classList.add('completed');
                bar.classList.remove('active');
                bar.style.width = '100%';
            } else if (index === currentIndex) {
                bar.classList.add('active');
                bar.classList.remove('completed');
                bar.style.width = '0%';

                // Force reflow to ensure the 0% is rendered before we start animation
                void bar.offsetWidth;

                // Now start animation
                bar.style.transition = `width ${this.slideDuration}ms linear`;
                bar.style.width = '100%';
            } else {
                bar.classList.remove('completed', 'active');
                bar.style.width = '0%';
            }
        });
    }

    startSlideTimer() {
        this.timer = setTimeout(() => {
            this.nextSlide();
        }, this.slideDuration);
    }

    renderSlideContent(data) {
        let html = '';

        if (data.type === 'intro' || data.type === 'outro') { // Added 'outro' just in case
            html = `
                <div class="slide active slide-intro">
                    <div class="slide-content-wrapper animate-in">
                        <h1>${data.title}</h1>
                        <p>${data.subtitle || ''}</p>
                    </div>
                </div>
            `;
        } else if (data.type === 'stat') {
            html = `
                <div class="slide active slide-stat">
                    <div class="slide-content-wrapper animate-in">
                        <div class="stat-value">${data.value}</div>
                        <div class="stat-label">${data.label}</div>
                    </div>
                </div>
            `;
        } else if (data.type === 'list') {
            const itemsHtml = data.items.map((item, i) =>
                `<div class="list-item animate-in" style="animation-delay: ${i * 0.15 + 0.2}s">
                    <span class="list-rank">${i + 1}</span>
                    <span class="list-text">${item}</span>
                </div>`
            ).join('');

            html = `
                <div class="slide active slide-list">
                    <div class="slide-content-wrapper">
                        <h2 class="animate-in">${data.title}</h2>
                        <div class="list-container" style="width: 100%">
                            ${itemsHtml}
                        </div>
                    </div>
                </div>
            `;
        } else if (data.type === 'photo') {
            html = `
                <div class="slide active slide-photo" style="background-image: url('${data.image}')">
                    <div class="slide-content-wrapper animate-in">
                        <h1>${data.title}</h1>
                        <p>${data.subtitle || ''}</p>
                    </div>
                </div>
            `;
        } else {
            // Fallback
            html = `
                <div class="slide active">
                    <h1>${data.title || ''}</h1>
                </div>
             `;
        }

        this.dom.container.innerHTML = html;
    }

    nextSlide() {
        if (this.currentSlideIndex < this.slides.length - 1) {
            this.showSlide(this.currentSlideIndex + 1);
        } else {
            console.log("End of Wrapped");
        }
    }

    prevSlide() {
        if (this.currentSlideIndex > 0) {
            this.showSlide(this.currentSlideIndex - 1);
        } else {
            // If at start, maybe restart the first slide animation?
            this.showSlide(0);
        }
    }
}
