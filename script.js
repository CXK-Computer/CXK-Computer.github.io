/* START OF FILE script.js */

document.addEventListener('DOMContentLoaded', () => {


    const particlesContainer = document.getElementById('particles-js');
    if (typeof particlesJS !== 'undefined' && particlesContainer) {
        let particleCount = 70;
        let enableInteractivity = true;

        if (window.innerWidth <= 992) {
             particleCount = 40;
        }
        if (window.innerWidth <= 768) {
            particleCount = 0;
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
    window.onload = function() {

const hourHand = document.querySelector('.hourHand');
    const minuteHand = document.querySelector('.minuteHand');
    const secondHand = document.querySelector('.secondHand');
    const time = document.querySelector('.time');
    const clock = document.querySelector('.clock');
    const audio = document.querySelector('.audio');

    function setDate(){
        const today = new Date();
        
        const second = today.getSeconds();
        const secondDeg = ((second / 60) * 360) + 360; 
        secondHand.style.transform = `rotate(${secondDeg}deg)`;
      
        audio.play();
        
        const minute = today.getMinutes();
        const minuteDeg = ((minute / 60) * 360); 
        minuteHand.style.transform = `rotate(${minuteDeg}deg)`;

        const hour = today.getHours();
        const hourDeg = ((hour / 12 ) * 360 ); 
        hourHand.style.transform = `rotate(${hourDeg}deg)`;
        
        time.innerHTML = '<span>' + '<strong>' + hour + '</strong>' + ' : ' + minute + ' : ' + '<small>' + second +'</small>'+ '</span>';

        }
  
    setInterval(setDate, 1000);
 
}


    const timeEl = document.getElementById('current-time');
    const noticeEl = document.getElementById('time-notice');
    const bodyEl = document.body;

    function updateClock() {
        if (!timeEl || !noticeEl) return;

        try {
            const now = new Date();
            const options = { timeZone: 'Asia/Shanghai', hour12: false, hour: 'numeric', minute: '2-digit', second: '2-digit' };
            timeEl.textContent = now.toLocaleTimeString('zh-CN', options);

            const hour = now.getHours();
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

            const isDarkModePreferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isNightTime = hour >= 19 || hour < 6;
            if (isNightTime || isDarkModePreferred) {
                bodyEl.classList.add('dark-mode');
            } else {
                bodyEl.classList.remove('dark-mode');
            }
        } catch (error) {
            console.error("Error updating clock:", error);
            timeEl.textContent = "--:--:--";
            noticeEl.textContent = "时间加载出错";
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    const checkBtn = document.getElementById('check-btn');
    const gameInputs = document.querySelectorAll('.game-inputs input');
    const gameResultEl = document.getElementById('game-result');

    function showResult(text, type = 'info') {
        if (!gameResultEl) return;
        gameResultEl.textContent = text;
        gameResultEl.className = 'game-result';
        if (type === 'success') {
            gameResultEl.classList.add('success');
        } else if (type === 'error') {
            gameResultEl.classList.add('error');
        }
    }

    function solve24(numbers) {
        const solutions = new Set();

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
            return Array.from(new Set(allPerms.map(JSON.stringify)), JSON.parse);
        }

        function findSolutionsRecursive(nums, exprs) {
            if (nums.length === 1) {
                if (Math.abs(nums[0] - 24) < 0.001) {
                    let formattedExpr = exprs[0].replace(/×/g, '*').replace(/÷/g, '/');
                    while (formattedExpr.startsWith('(') && formattedExpr.endsWith(')') && isBalanced(formattedExpr.slice(1, -1))) {
                         formattedExpr = formattedExpr.slice(1, -1);
                    }
                    solutions.add(formattedExpr.replace(/\*/g, '×').replace(/\//g, '÷'));
                }
                return;
            }

            for (let i = 0; i < nums.length; i++) {
                for (let j = 0; j < nums.length; j++) {
                    if (i === j) continue;

                    const remainingNums = nums.filter((_, index) => index !== i && index !== j);
                    const remainingExprs = exprs.filter((_, index) => index !== i && index !== j);
                    const numI = nums[i];
                    const numJ = nums[j];
                    const exprI = exprs[i];
                    const exprJ = exprs[j];

                    findSolutionsRecursive([...remainingNums, numI + numJ], [...remainingExprs, `(${exprI}+${exprJ})`]);
                    findSolutionsRecursive([...remainingNums, numI - numJ], [...remainingExprs, `(${exprI}-${exprJ})`]);
                    findSolutionsRecursive([...remainingNums, numJ - numI], [...remainingExprs, `(${exprJ}-${exprI})`]);
                    findSolutionsRecursive([...remainingNums, numI * numJ], [...remainingExprs, `(${exprI}×${exprJ})`]);
                    if (numJ !== 0) {
                        findSolutionsRecursive([...remainingNums, numI / numJ], [...remainingExprs, `(${exprI}÷${exprJ})`]);
                    }
                    if (numI !== 0) {
                        findSolutionsRecursive([...remainingNums, numJ / numI], [...remainingExprs, `(${exprJ}÷${exprI})`]);
                    }
                }
            }
        }

        function isBalanced(str) {
            let count = 0;
            for (const char of str) {
                if (char === '(') count++;
                else if (char === ')') count--;
                if (count < 0) return false;
            }
            return count === 0;
        }

        const numberPermutations = getPermutations(numbers);
        numberPermutations.forEach(perm => {
             findSolutionsRecursive(perm, perm.map(String));
        });

        return Array.from(solutions);
    }

    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            const numbers = Array.from(gameInputs).map(input => Number(input.value));

            if (numbers.some(num => !num || num < 1 || num > 13)) {
                showResult('请输入4个1-13之间的有效数字！', 'error');
                return;
            }
            if (numbers.length !== 4 || new Set(numbers).size !== numbers.length && numbers.includes(NaN)) {
                 showResult('请输入正好4个不同的有效数字！', 'error');
                 return;
            }


            showResult('正在计算...', 'info');

            setTimeout(() => {
                try {
                    const solutions = solve24(numbers);
                    if (solutions.length > 0) {
                        showResult(`找到解法：${solutions[0]}`, 'success');
                    } else {
                        showResult('无解，请尝试其他数字组合', 'error');
                    }
                } catch (error) {
                    console.error("Error solving 24 game:", error);
                    showResult('计算时发生错误', 'error');
                }
            }, 50);
        });
    }

    const imageGallery = document.querySelector('.image-gallery');
    const modal = document.getElementById('image-modal');
    const modalImg = modal.querySelector('.modal-content');
    const closeModalBtn = modal.querySelector('.modal-close');

    if (imageGallery && modal && modalImg && closeModalBtn) {
        imageGallery.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                modal.style.display = 'flex';
                modalImg.src = e.target.src;
                document.body.classList.add('modal-open');
            }
        });

        const closeModal = () => {
            modal.style.display = 'none';
            modalImg.src = "";
            document.body.classList.remove('modal-open');
        };

        closeModalBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    

    if (window.innerWidth > 768 && !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent)) {
       if (!document.querySelector('script[src*="api.vvhan.com/api/script/snow"]')) {
            const snow = document.createElement('script');
            snow.src = 'https://api.vvhan.com/api/script/snow';
            snow.async = true;
            document.body.appendChild(snow);
       }
       if (!document.querySelector('script[src*="api.vvhan.com/api/script/bolang"]')) {
            const bolang = document.createElement('script');
            bolang.src = 'https://api.vvhan.com/api/script/bolang';
            bolang.async = true;
             document.body.appendChild(bolang);
       }
    } else {
         const vvhanScripts = document.querySelectorAll('script[src*="api.vvhan.com/api/script/"]');
         vvhanScripts.forEach(s => s.remove());
         const vvhanElements = document.querySelectorAll('.vvhan-snow, .vvhan-bolang');
         vvhanElements.forEach(el => el.remove());
    }

});

/* END OF FILE script.js */
