/* START OF FILE script.js */

document.addEventListener('DOMContentLoaded', () => {

    // --- Particle JS Setup ---
    const particlesContainer = document.getElementById('particles-js');
    if (typeof particlesJS !== 'undefined' && particlesContainer) {
        let particleCount = 70;
        let enableInteractivity = true;

        if (window.innerWidth <= 992) {
            particleCount = 40;
        }
        if (window.innerWidth <= 768) {
            particleCount = 0; // Disable on small mobile
            enableInteractivity = false;
            if (particlesContainer) particlesContainer.style.display = 'none';
        }

        if (particleCount > 0) {
            particlesJS("particles-js", {
                particles: {
                    number: { value: particleCount, density: { enable: true, value_area: 800 } },
                    color: { value: "#ffffff" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5, random: false, anim: { enable: false } },
                    size: { value: 3, random: true, anim: { enable: false } },
                    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
                    move: { enable: true, speed: 1.5, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false } }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: enableInteractivity, mode: "repulse" },
                        onclick: { enable: enableInteractivity, mode: "push" },
                        resize: true
                    },
                    modes: {
                        repulse: { distance: 80, duration: 0.4 },
                        push: { particles_nb: 4 }
                    }
                },
                retina_detect: true
            });
        }
    }

    // --- Dynamic Background Setup ---
    function setDynamicBackground() {
        const body = document.body;
        const isMobile = window.innerWidth <= 768; // Threshold for mobile view

        // Example URLs - replace with your desired ones
        const desktopBgUrl = "https://api.dujin.org/bing/1920.php"; // Example high-res Bing API
        const mobileBgUrl = "https://api.dujin.org/bing/m.php";    // Example mobile Bing API

        const bgUrl = isMobile ? mobileBgUrl : desktopBgUrl;

        body.style.backgroundImage = `url("${bgUrl}")`;
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundPosition = 'center center';
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundSize = 'cover';
    }
    setDynamicBackground(); // Set initial background
    // Optional: Update background on resize if needed, but might cause re-downloads
    // window.addEventListener('resize', setDynamicBackground);

    // --- Analog Clock Setup ---
    const hourHand = document.querySelector('.hourHand');
    const minuteHand = document.querySelector('.minuteHand');
    const secondHand = document.querySelector('.secondHand');
    const timeDigitalInsideClock = document.querySelector('.clock .time'); // Digital time inside clock face
    // const audio = document.querySelector('.audio'); // If you have an audio element with class="audio"

    function setDate() {
        if (!hourHand || !minuteHand || !secondHand) return; // Ensure elements exist

        const today = new Date();

        const second = today.getSeconds();
        const secondDeg = ((second / 60) * 360) + 90; // Offset by 90deg because of initial CSS
        secondHand.style.transform = `rotate(${secondDeg}deg)`;

        // Uncomment if you want the tick sound and have a working audio element
        // if(audio) {
        //     audio.currentTime = 0; // Rewind to start
        //     audio.play().catch(e => console.log("Autoplay prevented:", e));
        // }

        const minute = today.getMinutes();
        const minuteDeg = ((minute / 60) * 360) + ((second / 60) * 6) + 90; // Add seconds fraction & offset
        minuteHand.style.transform = `rotate(${minuteDeg}deg)`;

        const hour = today.getHours();
        const hourDeg = ((hour / 12) * 360) + ((minute / 60) * 30) + 90; // Add minutes fraction & offset
        hourHand.style.transform = `rotate(${hourDeg}deg)`;

        // Update the small digital time display inside the clock face if it exists
        if (timeDigitalInsideClock) {
             timeDigitalInsideClock.innerHTML = `<span><strong>${hour % 12 || 12}</strong>:${minute.toString().padStart(2, '0')}:<small>${second.toString().padStart(2, '0')}</small></span>`;
        }
    }
    // Initial call to set clock position without delay
    setDate();
    // Set interval to update the clock every second
    setInterval(setDate, 1000);


    // --- Digital Time and Notice Update ---
    const timeEl = document.getElementById('current-time');
    const noticeEl = document.getElementById('time-notice');

    function updateDigitalClockAndNotice() {
        if (!timeEl || !noticeEl) return;

        try {
            const now = new Date();
            // Using 'Asia/Shanghai' timezone
            const options = { timeZone: 'Asia/Shanghai', hour12: false, hour: 'numeric', minute: '2-digit', second: '2-digit' };
            timeEl.textContent = now.toLocaleTimeString('zh-CN', options);

            const hour = now.getHours(); // Use local hour for greeting based on user's system time
            let notice = '';
            if (hour >= 5 && hour < 9) {
                notice = '🌅 清晨好！牢大！';
            } else if (hour >= 9 && hour < 12) {
                notice = '🌞 上午好！Manba out！';
            } else if (hour >= 12 && hour < 14) {
                notice = '☀️ 中午好！Pull up！';
            } else if (hour >= 14 && hour < 18) {
                notice = '🌤 下午好！保持废物';
            } else if (hour >= 18 && hour < 23) {
                notice = '🌙 晚上好！注意隐私';
            } else {
                notice = '🌃 深夜好！死猪还不睡觉！';
            }
            noticeEl.textContent = notice;

        } catch (error) {
            console.error("Error updating digital clock:", error);
            if (timeEl) timeEl.textContent = "Error";
            if (noticeEl) noticeEl.textContent = "Could not load time.";
        }
    }
    // Initial call & set interval for digital clock/notice
    updateDigitalClockAndNotice();
    setInterval(updateDigitalClockAndNotice, 1000);


    // --- 24-Point Game Logic ---
    const checkBtn = document.getElementById('check-btn');
    const gameInputs = document.querySelectorAll('.game-inputs input');
    const gameResultEl = document.getElementById('game-result');

    function showResult(text, type = 'info') {
        if (!gameResultEl) return;
        gameResultEl.textContent = text;
        gameResultEl.className = 'game-result'; // Reset classes first
        requestAnimationFrame(() => { // Allow reset to apply before adding new class
            if (type === 'success') {
                gameResultEl.classList.add('success');
            } else if (type === 'error') {
                gameResultEl.classList.add('error');
            }
        });
    }

    function solve24(numbers) {
        const solutions = new Set();
        const ops = ['+', '-', '×', '÷']; // Using display symbols directly
        const numPermutations = getPermutations(numbers);
        const opCombinations = getCombinationsWithRepetition(ops, 3); // Need 3 operators for 4 numbers

        numPermutations.forEach(nums => {
            opCombinations.forEach(opSet => {
                // Try all groupings (RPN helps here, but let's try common ones manually)
                // Structure 1: ((N1 op1 N2) op2 N3) op3 N4
                checkExpression(nums[0], nums[1], nums[2], nums[3], opSet[0], opSet[1], opSet[2], 1, solutions);
                // Structure 2: (N1 op1 (N2 op2 N3)) op3 N4
                checkExpression(nums[0], nums[1], nums[2], nums[3], opSet[0], opSet[1], opSet[2], 2, solutions);
                // Structure 3: (N1 op1 N2) op2 (N3 op3 N4)
                checkExpression(nums[0], nums[1], nums[2], nums[3], opSet[0], opSet[1], opSet[2], 3, solutions);
                 // Structure 4: N1 op1 ((N2 op2 N3) op3 N4) - Covered by permuting nums/ops + other structures
                 // Structure 5: N1 op1 (N2 op2 (N3 op3 N4)) - Covered by permuting nums/ops + other structures
            });
        });

        return Array.from(solutions);
    }

    function evaluate(a, b, op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '×': return a * b;
            case '÷': return b === 0 ? NaN : a / b; // Handle division by zero
            default: return NaN;
        }
    }

    function checkExpression(n1, n2, n3, n4, op1, op2, op3, structure, solutions) {
        let result;
        let expr;
        try {
            switch (structure) {
                case 1: // ((N1 op1 N2) op2 N3) op3 N4
                    const res1a = evaluate(n1, n2, op1); if (isNaN(res1a)) return;
                    const res1b = evaluate(res1a, n3, op2); if (isNaN(res1b)) return;
                    result = evaluate(res1b, n4, op3);
                    expr = `((${n1}${op1}${n2})${op2}${n3})${op3}${n4}`;
                    break;
                case 2: // (N1 op1 (N2 op2 N3)) op3 N4
                    const res2a = evaluate(n2, n3, op2); if (isNaN(res2a)) return;
                    const res2b = evaluate(n1, res2a, op1); if (isNaN(res2b)) return;
                    result = evaluate(res2b, n4, op3);
                    expr = `(${n1}${op1}(${n2}${op2}${n3}))${op3}${n4}`;
                    break;
                 case 3: // (N1 op1 N2) op2 (N3 op3 N4)
                    const res3a = evaluate(n1, n2, op1); if (isNaN(res3a)) return;
                    const res3b = evaluate(n3, n4, op3); if (isNaN(res3b)) return;
                    result = evaluate(res3a, res3b, op2);
                    expr = `(${n1}${op1}${n2})${op2}(${n3}${op3}${n4})`;
                    break;
                 default: return;
            }

            if (Math.abs(result - 24) < 0.0001) { // Check if result is close to 24
                 // Basic simplification (remove outer parens if they wrap the whole thing)
                 if (expr.startsWith('(') && expr.endsWith(')') && areParenthesesBalanced(expr.slice(1, -1))) {
                     expr = expr.slice(1, -1);
                 }
                 solutions.add(expr);
            }
        } catch (e) {
             // Ignore errors during evaluation (like division by zero handled by NaN)
        }

    }

     // Helper to check if parentheses are balanced correctly in a substring
    function areParenthesesBalanced(str) {
        let count = 0;
        for (let char of str) {
            if (char === '(') count++;
            else if (char === ')') count--;
            if (count < 0) return false; // Closing parenthesis came before matching opening one
        }
        return count === 0; // Should be zero if perfectly balanced
    }


    // Helper function for permutations (Heap's algorithm or simple recursive)
    function getPermutations(arr) {
        if (arr.length === 0) return [[]];
        const first = arr[0];
        const rest = arr.slice(1);
        const permsWithoutFirst = getPermutations(rest);
        const allPerms = [];
        permsWithoutFirst.forEach(perm => {
            for (let i = 0; i <= perm.length; i++) {
                const permWithFirst = [...perm.slice(0, i), first, ...perm.slice(i)];
                allPerms.push(permWithFirst);
            }
        });
        // Deduplicate if input array had duplicates (optional, might not be needed if inputs are distinct)
        // return Array.from(new Set(allPerms.map(JSON.stringify)), JSON.parse);
        return allPerms; // Keep duplicates for numbers like [3, 3, 8, 8]
    }

    // Helper function for combinations with repetition
    function getCombinationsWithRepetition(elements, length) {
        if (length === 0) return [[]];
        if (elements.length === 0) return [];

        const first = elements[0];
        const rest = elements; // Allow repetition

        const combsWithoutFirst = getCombinationsWithRepetition(rest, length - 1);
        const combsWithFirst = combsWithoutFirst.map(comb => [first, ...comb]);

        // Combinations that *don't* use the first element for the current position
        const combsUsingRest = getCombinationsWithRepetition(elements.slice(1), length);


        return [...combsWithFirst, ...combsUsingRest];
    }


    if (checkBtn) {
        // Attach the event listener ONLY ONCE
        checkBtn.addEventListener('click', () => {
            let numbers = [];
            let invalidInput = false;

            gameInputs.forEach(input => {
                const value = input.value.trim();
                if (value === '' || isNaN(value)) {
                    invalidInput = true;
                    return; // Skip this input
                }
                const num = Number(value);
                 if (num < 1 || num > 13 || !Number.isInteger(num) ) {
                     invalidInput = true;
                 }
                numbers.push(num);
            });


            if (invalidInput || numbers.length !== 4) {
                showResult('请输入4个1-13之间的有效整数！', 'error');
                return;
            }

            showResult('正在计算...', 'info');

            // Use setTimeout to allow the "正在计算..." message to render
            setTimeout(() => {
                try {
                    // console.log("Attempting to solve for:", numbers); // Debugging line
                    const solutions = solve24(numbers);
                    // console.log("Solutions found:", solutions); // Debugging line

                    if (solutions.length > 0) {
                        // Pick one solution to display
                        showResult(`找到解法：${solutions[0]}`, 'success');
                    } else {
                        showResult('无解，请尝试其他数字组合', 'error');
                    }
                } catch (error) {
                    console.error("Error solving 24 game:", error);
                    showResult('计算时发生错误', 'error');
                }
            }, 50); // Short delay
        });
    } else {
        console.error("Could not find the #check-btn element.");
    }

    // --- Image Modal Logic ---
    const imageGallery = document.querySelector('.image-gallery');
    const modal = document.getElementById('image-modal');
    const modalImg = modal?.querySelector('.modal-content'); // Use optional chaining
    const closeModalBtn = modal?.querySelector('.modal-close'); // Use optional chaining

    if (imageGallery && modal && modalImg && closeModalBtn) {
        imageGallery.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                modal.style.display = 'flex'; // Use flex for centering
                modalImg.src = e.target.src;
                document.body.classList.add('modal-open');
            }
        });

        const closeModal = () => {
            if (modal) {
                 modal.style.display = 'none';
            }
            if (modalImg) {
                 modalImg.src = ""; // Clear src
            }
            document.body.classList.remove('modal-open');
        };

        closeModalBtn.addEventListener('click', closeModal);

        // Close modal if clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

         // Close modal with Escape key
        window.addEventListener('keydown', (e) => {
             if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
                 closeModal();
             }
        });

    } else {
         console.warn("Image gallery or modal elements not fully found. Modal functionality disabled.");
    }

});
/* END OF FILE script.js */