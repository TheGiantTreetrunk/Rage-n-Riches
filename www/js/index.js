// Wait for Cordova to finish loading native components
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Cordova is ready!');

    // Initialize your game/app logic here
    initApp();

    // Initialize AdMob ads safely
    initAdMob();
}

function initApp() {
    // Your standard JavaScript code start point
}

function initAdMob() {
    if (window.admob) {
        // Initialize AdMob engine
        admob.start();

        // Prepare a banner ad (using Google's official Test Ad Unit ID for now)
        const banner = new admob.BannerAd({
            adUnitId: 'ca-app-pub-3940256099942544/6300978111', // Test ID
        });

        // Show the banner at the bottom of the screen
        banner.show();
    }
}