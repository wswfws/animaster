addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlack');
            animaster().fadeOut(block, 5000);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    var heartBeatingCancel;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            if (heartBeatingCancel !== undefined) return
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingCancel = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeatingCancel();
            heartBeatingCancel = undefined;
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}


    function animaster() {
    return {
        _steps: [], // Приватное поле для хранения шагов анимации

        addMove(duration, translation) {
            this._steps.push({
                action: 'move',
                duration: duration,
                params: translation
            });
            return this;
        },

        play(element) {
            this._steps.forEach(step => {
                this[step.action](element, step.duration, step.params);
            });
        },

        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), 2 * duration / 3);
        },

        moveAndHide(element, duration) {
            this.move(element, duration * 0.4, { x: 100, y: 20 });
            setTimeout(() => {
                this.fadeOut(element, duration * 0.6);
            }, duration * 0.4);
        },

        heartBeating(element) {
            let stop = false;
            const cancel = () => {
                stop = true;
            };
            const step1 = () => {
                this.scale(element, 500, 1.4);
                if (!stop) {
                    setTimeout(step2, 500);
                }
            };
            const step2 = () => {
                this.scale(element, 500, 1);
                if (!stop) {
                    setTimeout(step1, 500);
                }
            };
            step1();
            return cancel;
        }
    };
}
