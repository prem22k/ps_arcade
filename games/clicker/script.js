var initialHigh = localStorage.getItem("cookieHigh") || 0;
var initialClicks = localStorage.getItem("cookieClicks") || 0;

setTimeout(function() {
    document.getElementById('cookie-high').innerText = "High Score: " + initialHigh;
    document.getElementById('cookie-score').innerText = "Cookies: " + initialClicks;
}, 100);

function clickCookie() {
    var clicks = parseInt(localStorage.getItem("cookieClicks")) || 0;
    clicks = clicks + 1;
    localStorage.setItem("cookieClicks", clicks);
    document.getElementById('cookie-score').innerText = "Cookies: " + clicks;
    document.getElementById('save-status').innerText = "Saved!";
    
    var high = parseInt(localStorage.getItem("cookieHigh")) || 0;
    if (clicks > high) {
        localStorage.setItem("cookieHigh", clicks);
        document.getElementById('cookie-high').innerText = "High Score: " + clicks;
    }
    if (clicks === 100) {
        alert("CONGRATS! You hit 100 clicks!");
    }
}

function resetCookieClicks() {
    localStorage.setItem("cookieClicks", 0);
    document.getElementById('cookie-score').innerText = "Cookies: 0";
    alert("cookie clicks reset!");
}