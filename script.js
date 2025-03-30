let player;
let currentSongIndex = 0;
let isPlaying = false;

const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const volumeDown = document.getElementById('volumeDown');
const volumeUp = document.getElementById('volumeUp');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const songTitle = document.getElementById('songTitle');
const artist = document.getElementById('artist');
const encouragements = [
    document.getElementById('encouragement1'),
    document.getElementById('encouragement2'),
    document.getElementById('encouragement3'),
    document.getElementById('encouragement4'),
    document.getElementById('encouragement5'),
    document.getElementById('encouragement6'),
    document.getElementById('encouragement7'),
    document.getElementById('encouragement8'),
    document.getElementById('encouragement9'),
    document.getElementById('encouragement10')
];

// ข้อความปลอบใจภาษาไทย
const encouragementTexts = [
    "กาก1",
    "กาก2",
    "กาก3",
    "กาก4",
    "กาก5",
    "กาก6"
];

// Playlist array with YouTube video IDs
const playlist = [
    {
        title: "เธอไม่ได้อยู่คนเดียว",
        artist: "Tilly Birds |Lyric Video|",
        videoId: "_JsAiF6tw6g"
    },
    {
        title: "จีบ", // คุณสามารถเปลี่ยนชื่อเพลงได้ถ้ารู้ชื่อจริง
        artist: "QLER", // คุณสามารถเปลี่ยนศิลปินได้ถ้ารู้ศิลปินจริง
        videoId: "GnQZmNf9KCg"
    }
];

// Initialize YouTube IFrame Player API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtubePlayer', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError // เพิ่มการจัดการข้อผิดพลาด
        }
    });
}

function onPlayerReady(event) {
    loadSong(currentSongIndex);
    updateProgress();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        playPauseBtn.textContent = 'หยุด';
        startEncouragementLoop();
        updateProgress();
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        playPauseBtn.textContent = 'เล่น';
        stopEncouragementLoop();
    }
}

// จัดการข้อผิดพลาดเมื่อโหลดวิดีโอไม่ได้
function onPlayerError(event) {
    const errorCode = event.data;
    let errorMessage = "เกิดข้อผิดพลาดในการโหลดวิดีโอ: ";
    switch (errorCode) {
        case 2:
            errorMessage += "Video ID ไม่ถูกต้อง";
            break;
        case 5:
            errorMessage += "HTML5 Player Error";
            break;
        case 100:
            errorMessage += "วิดีโอไม่พบหรือถูกลบ";
            break;
        case 101:
        case 150:
            errorMessage += "วิดีโอนี้ถูกจำกัดหรือไม่อนุญาตให้ฝัง";
            break;
        default:
            errorMessage += "ไม่ทราบสาเหตุ";
    }
    alert(errorMessage);
    console.log("Error Code:", errorCode);
}

function loadSong(index) {
    const song = playlist[index];
    songTitle.textContent = song.title;
    artist.textContent = song.artist;
    player.loadVideoById(song.videoId);
}

function playPause() {
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
}

function updateProgress() {
    if (player && player.getDuration) {
        const current = player.getCurrentTime();
        const total = player.getDuration();
        progressBar.value = (current / total) * 100;
        currentTime.textContent = formatTime(current);
        duration.textContent = formatTime(total);
    }
    if (isPlaying) requestAnimationFrame(updateProgress);
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

function adjustVolume(amount) {
    let currentVolume = player.getVolume();
    let newVolume = Math.max(0, Math.min(100, currentVolume + amount));
    player.setVolume(newVolume);
    volumeBar.value = newVolume;
}

function showEncouragement(element) {
    const isHeart = Math.random() > 0.5;
    const content = isHeart 
        ? (Math.random() > 0.5 ? "❤️" : "🤍") 
        : encouragementTexts[Math.floor(Math.random() * encouragementTexts.length)];
    element.textContent = content;
    
    element.classList.remove('heart', 'text');
    element.classList.add(isHeart ? 'heart' : 'text');
    
    if (!isHeart) element.style.color = "rgba(255, 255, 255, 0.8)";
    
    element.classList.add('active');

    const playerHeight = document.querySelector('.player-container').offsetHeight;
    const maxY = window.innerHeight - (isHeart ? 80 : 50);
    const maxX = window.innerWidth - (isHeart ? 80 : 200);
    const minX = 20;
    const minY = playerHeight + 20;
    const randomY = minY + Math.random() * (maxY - minY);
    const randomX = minX + Math.random() * (maxX - minX);
    element.style.top = `${randomY}px`;
    element.style.left = `${randomX}px`;

    element.addEventListener('animationend', () => {
        element.classList.remove('active', 'heart', 'text');
    }, { once: true });
}

let encouragementInterval;
function startEncouragementLoop() {
    let activeCount = 0;
    const maxActive = 3;

    encouragementInterval = setInterval(() => {
        activeCount = encouragements.filter(el => el.classList.contains('active')).length;
        if (activeCount < maxActive) {
            const availableElements = encouragements.filter(el => !el.classList.contains('active'));
            if (availableElements.length > 0) {
                const randomElement = availableElements[Math.floor(Math.random() * availableElements.length)];
                showEncouragement(randomElement);
            }
        }
    }, 1000);
}

function stopEncouragementLoop() {
    clearInterval(encouragementInterval);
    encouragements.forEach(el => el.classList.remove('active', 'heart', 'text'));
}

// Event Listeners
playPauseBtn.addEventListener('click', playPause);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

progressBar.addEventListener('input', () => {
    const seekTo = (progressBar.value / 100) * player.getDuration();
    player.seekTo(seekTo, true);
});

volumeBar.addEventListener('input', () => {
    player.setVolume(volumeBar.value);
});

volumeDown.addEventListener('click', () => adjustVolume(-10));
volumeUp.addEventListener('click', () => adjustVolume(10));

// Load first song on page load
loadSong(currentSongIndex);
