function animaster() {
    return {
        _steps: [], // Приватное поле для хранения шагов анимации

        addMove(duration, translation) {
            this._steps.push({
                action: 'move',
                duration: duration,
                params: [translation]
            });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({
                action: 'scale',
                duration: duration,
                params: [ratio]
            });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({
                action: 'fadeIn',
                duration: duration,
                params: []
            });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({
                action: 'fadeOut',
                duration: duration,
                params: []
            });
            return this;
        },

        addDelay(duration) {
            this._steps.push({
                action: 'delay',
                duration: duration,
                params: []
            });
            return this;
        },

        play(element, cycled = false) {
            const runStep = (step_ind) => {
                if (step_ind >= this._steps.length) {
                    if (cycled) {
                        runStep(0);
                    }
                    return;
                }

                const step = this._steps[step_ind];
                if (step.action === 'delay') {
                    setTimeout(() => runStep(step_ind + 1), step.duration);
                } else {
                    this[step.action](element, step.duration, ...step.params);
                    setTimeout(() => runStep(step_ind + 1), step.duration);
                }
            };
            runStep(0);
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

        moveAndHide(element, duration) {
            this.addMove(duration * 0.4, {x: 100, y: 20})
                .addFadeOut(duration * 0.6)
                .play(element);
        },

        showAndHide(element, duration) {
            this.addFadeIn(duration / 3)
                .addDelay(2 * duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBeating(element) {
            const animation = animaster()
                .addScale(500, 1.4)
                .addScale(500, 1);
            animation.play(element, true);
            return () => {
                animation._steps = []; // Останавливаем анимацию, очищая шаги
            };
        }
    };
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

addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
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
            animaster().addScale(1000, 1.25).play(block);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlack');
            animaster().addFadeOut(5000).play(block);
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

    document.getElementById('moveSquarePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveSquareBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
        });
}