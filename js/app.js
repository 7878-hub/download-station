/**
 * 文件下载站 - 前端逻辑
 * 通过 files.json 清单文件动态渲染文件列表
 */

// 文件类型配置：图标、颜色、分类
const FILE_TYPES = {
    // 文档类
    pdf:    { icon: '📄', color: '#ef4444', bg: '#fee2e2', category: '文档', label: 'PDF' },
    doc:    { icon: '📝', color: '#2563eb', bg: '#dbeafe', category: '文档', label: 'DOC' },
    docx:   { icon: '📝', color: '#2563eb', bg: '#dbeafe', category: '文档', label: 'DOCX' },
    xls:    { icon: '📊', color: '#16a34a', bg: '#dcfce7', category: '文档', label: 'XLS' },
    xlsx:   { icon: '📊', color: '#16a34a', bg: '#dcfce7', category: '文档', label: 'XLSX' },
    ppt:    { icon: '📑', color: '#ea580c', bg: '#fed7aa', category: '文档', label: 'PPT' },
    pptx:   { icon: '📑', color: '#ea580c', bg: '#fed7aa', category: '文档', label: 'PPTX' },
    txt:    { icon: '📃', color: '#6b7280', bg: '#f3f4f6', category: '文档', label: 'TXT' },
    md:     { icon: '📃', color: '#6b7280', bg: '#f3f4f6', category: '文档', label: 'MD' },

    // 压缩包
    zip:    { icon: '🗜️', color: '#7c3aed', bg: '#ede9fe', category: '压缩包', label: 'ZIP' },
    rar:    { icon: '🗜️', color: '#7c3aed', bg: '#ede9fe', category: '压缩包', label: 'RAR' },
    '7z':   { icon: '🗜️', color: '#7c3aed', bg: '#ede9fe', category: '压缩包', label: '7Z' },
    tar:    { icon: '🗜️', color: '#7c3aed', bg: '#ede9fe', category: '压缩包', label: 'TAR' },
    gz:     { icon: '🗜️', color: '#7c3aed', bg: '#ede9fe', category: '压缩包', label: 'GZ' },

    // 图片
    jpg:    { icon: '🖼️', color: '#0891b2', bg: '#cffafe', category: '图片', label: 'JPG' },
    jpeg:   { icon: '🖼️', color: '#0891b2', bg: '#cffafe', category: '图片', label: 'JPEG' },
    png:    { icon: '🖼️', color: '#0891b2', bg: '#cffafe', category: '图片', label: 'PNG' },
    gif:    { icon: '🖼️', color: '#0891b2', bg: '#cffafe', category: '图片', label: 'GIF' },
    svg:    { icon: '🖼️', color: '#0891b2', bg: '#cffafe', category: '图片', label: 'SVG' },
    webp:   { icon: '🖼️', color: '#0891b2', bg: '#cffafe', category: '图片', label: 'WEBP' },

    // 视频
    mp4:    { icon: '🎬', color: '#be185d', bg: '#fce7f3', category: '视频', label: 'MP4' },
    avi:    { icon: '🎬', color: '#be185d', bg: '#fce7f3', category: '视频', label: 'AVI' },
    mkv:    { icon: '🎬', color: '#be185d', bg: '#fce7f3', category: '视频', label: 'MKV' },
    mov:    { icon: '🎬', color: '#be185d', bg: '#fce7f3', category: '视频', label: 'MOV' },

    // 音频
    mp3:    { icon: '🎵', color: '#9333ea', bg: '#f3e8ff', category: '音频', label: 'MP3' },
    wav:    { icon: '🎵', color: '#9333ea', bg: '#f3e8ff', category: '音频', label: 'WAV' },
    flac:   { icon: '🎵', color: '#9333ea', bg: '#f3e8ff', category: '音频', label: 'FLAC' },

    // 软件/程序
    exe:    { icon: '⚙️', color: '#4f6df5', bg: '#e8edff', category: '软件', label: 'EXE' },
    msi:    { icon: '⚙️', color: '#4f6df5', bg: '#e8edff', category: '软件', label: 'MSI' },
    apk:    { icon: '📱', color: '#059669', bg: '#d1fae5', category: '软件', label: 'APK' },
    dmg:    { icon: '💻', color: '#64748b', bg: '#f1f5f9', category: '软件', label: 'DMG' },
    iso:    { icon: '💿', color: '#475569', bg: '#f1f5f9', category: '软件', label: 'ISO' },

    // 代码
    js:     { icon: '📜', color: '#ca8a04', bg: '#fef9c3', category: '代码', label: 'JS' },
    ts:     { icon: '📜', color: '#ca8a04', bg: '#fef9c3', category: '代码', label: 'TS' },
    py:     { icon: '🐍', color: '#3b82f6', bg: '#dbeafe', category: '代码', label: 'PY' },
    java:   { icon: '☕', color: '#dc2626', bg: '#fee2e2', category: '代码', label: 'JAVA' },
    html:   { icon: '🌐', color: '#ea580c', bg: '#fed7aa', category: '代码', label: 'HTML' },
    css:    { icon: '🎨', color: '#2563eb', bg: '#dbeafe', category: '代码', label: 'CSS' },
    json:   { icon: '🔧', color: '#64748b', bg: '#f1f5f9', category: '代码', label: 'JSON' },

    // 默认
    default:{ icon: '📁', color: '#6b7280', bg: '#f3f4f6', category: '其他', label: 'FILE' }
};

// 状态
let allFiles = [];
let currentCategory = 'all';
let searchKeyword = '';

// 获取文件扩展名
function getExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

// 获取文件类型配置
function getFileType(filename) {
    const ext = getExtension(filename);
    return FILE_TYPES[ext] || FILE_TYPES.default;
}

// 格式化文件大小
function formatSize(bytes) {
    if (!bytes || bytes === 0) return '未知';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return bytes.toFixed(i === 0 ? 0 : 1) + ' ' + units[i];
}

// 格式化日期
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
    if (diff < 2592000) return Math.floor(diff / 86400) + ' 天前';
    return d.toLocaleDateString('zh-CN');
}

// 渲染文件卡片
function renderFileCard(file) {
    const type = getFileType(file.name);
    const size = formatSize(file.size);
    const date = formatDate(file.date);
    const downloadPath = file.path || ('downloads/' + encodeURIComponent(file.name));

    return `
        <div class="file-card" style="--file-color: ${type.color}; --file-bg: ${type.bg};">
            <div class="file-card-header">
                <div class="file-icon">${type.icon}</div>
                <div class="file-info">
                    <div class="file-name" title="${file.name}">${file.name}</div>
                    <div class="file-meta">
                        <span class="file-tag">${type.label}</span>
                        <span>${size}</span>
                    </div>
                </div>
            </div>
            <div class="file-card-footer">
                <span class="file-date">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${date}
                </span>
                <a href="${downloadPath}" download="${file.name}" class="download-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    下载
                </a>
            </div>
        </div>
    `;
}

// 渲染文件列表
function renderFiles() {
    const grid = document.getElementById('fileGrid');
    const emptyState = document.getElementById('emptyState');

    let filtered = allFiles;

    // 按分类筛选
    if (currentCategory !== 'all') {
        filtered = filtered.filter(f => getFileType(f.name).category === currentCategory);
    }

    // 按关键词搜索
    if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        filtered = filtered.filter(f => f.name.toLowerCase().includes(kw));
    }

    if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        grid.innerHTML = filtered.map(renderFileCard).join('');
    }
}

// 渲染分类筛选按钮
function renderFilters() {
    const filterBar = document.getElementById('filterBar');
    const categories = new Map();
    categories.set('全部', 'all');

    allFiles.forEach(f => {
        const cat = getFileType(f.name).category;
        if (!categories.has(cat)) {
            categories.set(cat, cat);
        }
    });

    filterBar.innerHTML = Array.from(categories.entries())
        .map(([label, value]) =>
            `<button class="filter-btn ${value === currentCategory ? 'active' : ''}" data-category="${value}">${label}</button>`
        )
        .join('');

    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderFiles();
        });
    });
}

// 更新统计信息
function updateStats() {
    document.getElementById('fileCount').textContent = allFiles.length;
    const totalBytes = allFiles.reduce((sum, f) => sum + (f.size || 0), 0);
    document.getElementById('totalSize').textContent = formatSize(totalBytes);
}

// 加载文件清单
async function loadFiles() {
    const grid = document.getElementById('fileGrid');

    try {
        // 加载文件清单 JSON
        const response = await fetch('files.json?t=' + Date.now());

        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }

        const data = await response.json();
        allFiles = Array.isArray(data) ? data : (data.files || []);

        // 按日期降序排列
        allFiles.sort((a, b) => {
            const da = new Date(a.date || 0);
            const db = new Date(b.date || 0);
            return db - da;
        });

        updateStats();
        renderFilters();
        renderFiles();

    } catch (err) {
        grid.innerHTML = `
            <div class="error-state">
                <span class="error-icon">⚠️</span>
                <h3>加载失败</h3>
                <p>${err.message}</p>
                <p>请确保 files.json 文件存在且格式正确</p>
                <button class="retry-btn" onclick="loadFiles()">重新加载</button>
            </div>
        `;
    }
}

// 搜索输入防抖
let searchTimer = null;
document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        searchKeyword = e.target.value.trim();
        renderFiles();
    }, 200);
});

// 初始化
loadFiles();

/* ============================================================
 * 🎮 Konami Code 彩蛋
 * 顺序：上 上 下 下 左 右 左 右
 * 触发后进入赛博朋克霓虹模式 + 粒子 + 8-bit 音效
 * ============================================================ */

const KONAMI_CODE = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right'];
let konamiProgress = 0;
let neonActive = false;

function handleKonamiInput(dir) {
    if (neonActive) return; // 已激活则不再响应

    const expected = KONAMI_CODE[konamiProgress];
    const btn = document.querySelector('.konami-btn[data-dir="' + dir + '"]');

    if (dir === expected) {
        // ✅ 按对了
        konamiProgress++;
        if (btn) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 200);
        }
        if (konamiProgress === KONAMI_CODE.length) {
            triggerEasterEgg();
            konamiProgress = 0;
        }
    } else {
        // ❌ 按错了，重置
        konamiProgress = 0;
        if (btn) {
            btn.classList.add('wrong');
            setTimeout(() => btn.classList.remove('wrong'), 350);
        }
    }
}

function triggerEasterEgg() {
    if (neonActive) return;
    neonActive = true;

    // 1. 显示横幅
    const banner = document.getElementById('easterBanner');
    banner.classList.add('show');
    setTimeout(() => banner.classList.remove('show'), 4500);

    // 2. 进入霓虹模式
    document.body.classList.add('neon-mode');

    // 3. 启动粒子
    startParticles();

    // 4. 播放音效
    playVictorySound();

    // 5. 隐藏方向按钮（彩蛋已解锁，不需要了）
    const pad = document.getElementById('konamiPad');
    if (pad) pad.style.display = 'none';
}

/* ===== 粒子系统 ===== */
let particleAnimationId = null;
let particles = [];
let particleCanvas = null;
let particleCtx = null;

function startParticles() {
    particleCanvas = document.getElementById('particleCanvas');
    particleCtx = particleCanvas.getContext('2d');
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0099', '#00ff88', '#ff6600'];
    particles = [];
    for (let i = 0; i < 90; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: -20 - Math.random() * 300,
            size: 2 + Math.random() * 4,
            speed: 0.8 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.06,
            drift: (Math.random() - 0.5) * 1.5
        });
    }

    function animate() {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => {
            p.y += p.speed;
            p.angle += p.spin;
            p.x += Math.sin(p.angle) * 0.8 + p.drift * 0.3;

            particleCtx.save();
            particleCtx.translate(p.x, p.y);
            particleCtx.rotate(p.angle);
            particleCtx.fillStyle = p.color;
            particleCtx.shadowBlur = 15;
            particleCtx.shadowColor = p.color;
            particleCtx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
            particleCtx.restore();

            if (p.y > particleCanvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * particleCanvas.width;
            }
        });
        particleAnimationId = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', resizeParticleCanvas);
}

function resizeParticleCanvas() {
    if (particleCanvas) {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
}

/* ===== 8-bit 胜利音效（Web Audio API 生成） ===== */
function playVictorySound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [
            { f: 523, d: 0.1 },   // C5
            { f: 659, d: 0.1 },   // E5
            { f: 784, d: 0.1 },   // G5
            { f: 1047, d: 0.18 }, // C6
            { f: 784, d: 0.1 },   // G5
            { f: 1047, d: 0.1 },  // C6
            { f: 1319, d: 0.35 }  // E6
        ];
        let t = ctx.currentTime;
        notes.forEach(n => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = n.f;
            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + n.d);
            t += n.d * 0.85;
        });
    } catch (e) {
        // 音频不可用就静默跳过
    }
}

/* ===== 绑定按钮 + 键盘 ===== */
document.querySelectorAll('.konami-btn').forEach(btn => {
    btn.addEventListener('click', () => handleKonamiInput(btn.dataset.dir));
});

document.addEventListener('keydown', (e) => {
    const map = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };
    const dir = map[e.key];
    if (dir) {
        e.preventDefault();
        handleKonamiInput(dir);
    }
});

// ===== 跳吓彩蛋 =====
(function initScare() {
    const btn = document.getElementById('scareBtn');
    const overlay = document.getElementById('scareOverlay');
    if (!btn || !overlay) return;

    let scareVideo = null;
    let scared = false;

    // 拦截所有键盘事件, 防止 ESC/F11/Ctrl+W 等退出
    function blockKeys(e) {
        if (!scared) return;
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
        // F11 / ESC: 在用户手势上下文里【同步】立即请求重新全屏(成功率最高)
        if (e.key === 'F11' || e.keyCode === 122 ||
            e.key === 'Escape' || e.keyCode === 27) {
            requestFs();
            setTimeout(requestFs, 0);
            setTimeout(requestFs, 120);
            setTimeout(requestFs, 350);
        }
        // 拦截 Ctrl+W / Ctrl+T / Alt+F4 等组合
        if (e.ctrlKey && (e.key === 'w' || e.key === 't' || e.key === 'n')) {
            e.preventDefault();
        }
    }

    // 光标锁死: 只要跳吓进行中, 任何鼠标活动都立刻把光标隐藏
    function forceHideCursor() {
        if (!scared) return;
        document.documentElement.style.setProperty('cursor', 'none', 'important');
        document.body.style.setProperty('cursor', 'none', 'important');
        if (overlay) overlay.style.setProperty('cursor', 'none', 'important');
        if (scareVideo) scareVideo.style.setProperty('cursor', 'none', 'important');
    }

    // 防止关闭标签页
    function preventUnload(e) {
        if (!scared) return;
        e.preventDefault();
        e.returnValue = '请看完这个视频再离开';
        return '请看完这个视频再离开';
    }

    // 强制全屏
    function requestFs() {
        const el = document.documentElement;
        try {
            if (el.requestFullscreen) {
                var p = el.requestFullscreen();
                if (p && p.catch) p.catch(() => {});
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            }
        } catch(e) {}
    }

    // 持续重试全屏(F11/ESC退出后浏览器可能拒绝非手势触发, 持续逼近)
    let fsRetryCount = 0;
    let fsRetryTimer = null;
    function aggressiveReFullscreen() {
        if (!scared) return;
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            fsRetryCount = 0;
            return;
        }
        requestFs();
        fsRetryCount++;
        if (fsRetryCount < 40) {
            fsRetryTimer = setTimeout(aggressiveReFullscreen, 150);
        }
    }

    function exitFs() {
        if (fsRetryTimer) { clearTimeout(fsRetryTimer); fsRetryTimer = null; }
        fsRetryCount = 0;
        try {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            } else if (document.webkitFullscreenElement) {
                document.webkitExitFullscreen();
            }
        } catch(e) {}
    }

    // 全屏被退出时立刻重新进入(F11/ESC 都会触发)
    function onFsChange() {
        if (!scared) return;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            // 立刻试一次
            requestFs();
            // 然后持续重试
            fsRetryCount = 0;
            if (fsRetryTimer) clearTimeout(fsRetryTimer);
            fsRetryTimer = setTimeout(aggressiveReFullscreen, 50);
        }
    }

    btn.addEventListener('click', () => {
        if (scared) return;
        scared = true;
        // 锁定页面滚动
        document.body.classList.add('scare-locked');
        // 屏幕震动(全屏大幅)
        document.body.classList.add('scare-shake');
        setTimeout(() => document.body.classList.remove('scare-shake'), 1200);
        // 强制全屏
        requestFs();
        // 光标立即隐藏 + 之后任何鼠标移动都强制隐藏
        forceHideCursor();
        document.addEventListener('mousemove', forceHideCursor, true);
        document.addEventListener('mouseenter', forceHideCursor, true);
        // 显示视频
        overlay.classList.add('show');
        // 覆盖层也来一次震动(全屏+缩放)
        overlay.classList.add('shake-burst');
        setTimeout(() => overlay.classList.remove('shake-burst'), 600);
        // 拦截键盘 & 右键 & 全屏变化 & 关闭标签页
        document.addEventListener('keydown', blockKeys, true);
        document.addEventListener('contextmenu', blockKeys, true);
        document.addEventListener('fullscreenchange', onFsChange);
        document.addEventListener('webkitfullscreenchange', onFsChange);
        window.addEventListener('beforeunload', preventUnload);
        // 播放视频(首次点击时创建元素, 6MB 延迟加载)
        if (!scareVideo) {
            scareVideo = document.getElementById('scareVideo');
            // 视频播放完毕后才关闭
            scareVideo.addEventListener('ended', closeScare);
            // 视频加载失败也关闭(防止卡死)
            scareVideo.addEventListener('error', closeScare);
        }
        scareVideo.currentTime = 0;
        scareVideo.muted = false;
        const playPromise = scareVideo.play();
        if (playPromise && playPromise.catch) {
            playPromise.catch(() => {
                // 播放被阻止, 5秒后自动关闭
                setTimeout(closeScare, 5000);
            });
        }
    });

    function closeScare() {
        overlay.classList.remove('show');
        document.body.classList.remove('scare-locked');
        document.removeEventListener('keydown', blockKeys, true);
        document.removeEventListener('contextmenu', blockKeys, true);
        document.removeEventListener('mousemove', forceHideCursor, true);
        document.removeEventListener('mouseenter', forceHideCursor, true);
        document.removeEventListener('fullscreenchange', onFsChange);
        document.removeEventListener('webkitfullscreenchange', onFsChange);
        window.removeEventListener('beforeunload', preventUnload);
        // 恢复光标
        document.documentElement.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');
        if (scareVideo) scareVideo.style.removeProperty('cursor');
        if (scareVideo) {
            scareVideo.pause();
            scareVideo.currentTime = 0;
        }
        exitFs();
        // 1.5秒后才能再点按钮
        setTimeout(() => { scared = false; }, 1500);
    }
})();
