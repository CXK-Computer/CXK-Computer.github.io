/* START OF FILE script.js */

document.addEventListener('DOMContentLoaded', () => {

  // --- Live2D Widget Loader ---
  // Check if the widget script is already loaded (e.g., by direct script tag)
  // If not, dynamically load it. This is optional if you keep the direct script tag.
  // if (typeof loadlive2d === 'undefined') {
  //     const live2dScript = document.createElement('script');
  //     live2dScript.src = 'https://fastly.jsdelivr.net/npm/live2d-widgets@0/autoload.js';
  //     document.body.appendChild(live2dScript);
  // }

  // --- Particle Effects ---
  if (typeof particlesJS !== 'undefined') {
    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false, anim: { enable: false } },
        size: { value: 3, random: true, anim: { enable: false } },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false } }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  } else {
    console.warn("particles.js library not loaded.");
  }


  // --- Clock, Greeting, and Dark Mode ---
  const timeEl = document.getElementById('current-time');
  const noticeEl = document.getElementById('time-notice');
  const bodyEl = document.body;

  function updateClock() {
    if (!timeEl || !noticeEl) return; // Exit if elements don't exist

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

        // Toggle dark mode based on time (6 PM to 6 AM)
        if (hour >= 18 || hour < 6) {
            bodyEl.classList.add('dark-mode');
        } else {
            bodyEl.classList.remove('dark-mode');
        }
    } catch (error) {
        console.error("Error updating clock:", error);
        timeEl.textContent = "--:--:--"; // Display placeholder on error
        noticeEl.textContent = "时间加载出错";
    }


    setTimeout(updateClock, 1000); // Schedule next update
  }

  updateClock(); // Initial call


  // --- 24 Point Game Logic ---
  const checkBtn = document.getElementById('check-btn');
  const gameInputs = document.querySelectorAll('.game-inputs input');
  const gameResultEl = document.getElementById('game-result');

  function showResult(text, type = 'info') { // type can be 'info', 'success', 'error'
    if (!gameResultEl) return;
    gameResultEl.textContent = text;
    gameResultEl.className = 'game-result'; // Reset classes
    if (type === 'success') {
      gameResultEl.classList.add('success');
    } else if (type === 'error') {
      gameResultEl.classList.add('error');
    }
  }

  function solve24(numbers) {
    const ops = ['+', '-', '*', '/'];
    const solutions = new Set(); // Use Set to store unique solutions

    // Generate all permutations of numbers
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
      // Simple deduplication for number permutations (less critical than expression deduplication)
      return Array.from(new Set(allPerms.map(JSON.stringify)), JSON.parse);
    }

    // Generate all operator combinations (3 operators needed for 4 numbers)
    function getOpCombinations(opList, length) {
        if (length === 0) return [[]];
        const combs = [];
        for (const op of opList) {
            const subCombs = getOpCombinations(opList, length - 1);
            subCombs.forEach(sc => combs.push([op, ...sc]));
        }
        return combs;
    }

    // Evaluate expression based on structure and operators
    // Try different parenthesis structures: ((a op b) op c) op d, (a op b) op (c op d), (a op (b op c)) op d, etc.
    // This part is complex. A simpler recursive approach is often used, like the original one.
    // Let's stick to the original recursive combination approach for simplicity here,
    // as a full evaluator for all parenthesis is significantly more code.

    // --- Using a refined recursive approach similar to the original ---
    function findSolutionsRecursive(nums, exprs) {
        if (nums.length === 1) {
            if (Math.abs(nums[0] - 24) < 0.001) {
                // Basic formatting: remove outer parens if possible, replace symbols
                let formattedExpr = exprs[0].replace(/×/g, '*').replace(/÷/g, '/');
                // Attempt to simplify excessive parenthesis (this is non-trivial)
                // Example: Remove outermost if redundant like ((expr)) -> (expr)
                 while (formattedExpr.startsWith('(') && formattedExpr.endsWith(')') && isBalanced(formattedExpr.slice(1, -1))) {
                      formattedExpr = formattedExpr.slice(1, -1);
                 }
                solutions.add(formattedExpr.replace(/\*/g, '×').replace(/\//g, '÷')); // Add formatted solution
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

                // Try all operations
                if (true) { // Addition
                    findSolutionsRecursive([...remainingNums, numI + numJ], [...remainingExprs, `(${exprI}+${exprJ})`]);
                }
                if (true) { // Subtraction (both ways)
                    findSolutionsRecursive([...remainingNums, numI - numJ], [...remainingExprs, `(${exprI}-${exprJ})`]);
                    findSolutionsRecursive([...remainingNums, numJ - numI], [...remainingExprs, `(${exprJ}-${exprI})`]);
                }
                 if (true) { // Multiplication
                    findSolutionsRecursive([...remainingNums, numI * numJ], [...remainingExprs, `(${exprI}×${exprJ})`]);
                 }
                if (numJ !== 0) { // Division numI / numJ
                    findSolutionsRecursive([...remainingNums, numI / numJ], [...remainingExprs, `(${exprI}÷${exprJ})`]);
                }
                 if (numI !== 0) { // Division numJ / numI
                    findSolutionsRecursive([...remainingNums, numJ / numI], [...remainingExprs, `(${exprJ}÷${exprI})`]);
                 }
            }
        }
    }

    // Helper to check balanced parentheses for simplification
    function isBalanced(str) {
        let count = 0;
        for (const char of str) {
            if (char === '(') count++;
            else if (char === ')') count--;
            if (count < 0) return false; // Closing parenthesis without matching open one
        }
        return count === 0;
    }


    const numberPermutations = getPermutations(numbers);
    numberPermutations.forEach(perm => {
         findSolutionsRecursive(perm, perm.map(String));
    });

    return Array.from(solutions); // Convert Set back to Array
}


  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      const numbers = Array.from(gameInputs).map(input => Number(input.value));

      if (numbers.some(num => !num || num < 1 || num > 13)) { // Allow numbers up to 13 (J,Q,K) - adjust max if needed
        showResult('请输入4个1-13之间的有效数字！', 'error');
        return;
      }
       if (numbers.length !== 4) {
            showResult('请输入正好4个数字！', 'error');
            return;
       }

      // Clear previous result before solving
      showResult('正在计算...', 'info');

      // Run solver with a small delay to allow UI update
      setTimeout(() => {
          try {
              const solutions = solve24(numbers);
              if (solutions.length > 0) {
                // Display one solution, maybe add a way to cycle through?
                showResult(`找到解法：${solutions[0]}`, 'success');
              } else {
                showResult('无解，请尝试其他数字组合', 'error');
              }
          } catch (error) {
              console.error("Error solving 24 game:", error);
              showResult('计算时发生错误', 'error');
          }
      }, 50); // 50ms delay


    });
  } else {
      console.warn("Game 'check' button not found.");
  }


  // --- Optional: Add focus/blur handlers to inputs for styling ---
  gameInputs.forEach(input => {
      input.addEventListener('focus', () => input.style.borderColor = '#00d4a0'); // Example focus style
      input.addEventListener('blur', () => input.style.borderColor = 'var(--accent-color)');
  });

}); // End DOMContentLoaded

/* END OF FILE script.js */