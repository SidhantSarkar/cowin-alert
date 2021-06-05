importScripts('./js/localforage.js');
importScripts('./js/loadash.js');

self.addEventListener("install", () => {
    console.log('Installed');
    this.localforage.getItem('user_config').then((value) => {
        self.userConfig = value;
    }).catch(function (err) {
        console.log(err);
    });
});

self.skipWaiting();

self.addEventListener("activate", (e) => {
    setInterval(() => {
        console.log('Starting Proc');
        self.sentAlert = false;
        const currDate = new Date().toLocaleDateString('en-GB').replaceAll("/", "-");
        fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${self.userConfig.district}&date=${currDate}`)
            .then(response => response.json())
            .then(res => {
                this.localforage.getItem('district_data').then((value) => {
                    if (value && _.isEqual(value, res)) return;
                    this.localforage.setItem('district_data', { ...res, 'last_update': new Date().toISOString() });
                    if (self.sentAlert) return;
                    var options = {
                        body: 'New slots available in your selected District.',
                        icon: './images/icons/icon-72x72.png',
                        vibrate: [100, 50, 100],
                    };
                    self.registration.showNotification('Vaccination Slots Found!', options);
                    self.sentAlert = true;
                }).catch(function (err) {
                    console.log(err);
                });
            })
            .catch(err => console.error(err));
        fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${self.userConfig.pincode}&date=${currDate}`)
            .then(response => response.json())
            .then(res => {
                this.localforage.getItem('pincode_data').then((value) => {
                    if (value && _.isEqual(value, res)) return;
                    this.localforage.setItem('pincode_data', { ...res, 'last_update': new Date().toISOString() });
                    if (self.sentAlert) return;
                    var options = {
                        body: 'New slots available in your selected Pincode.',
                        icon: './images/icons/icon-72x72.png',
                        vibrate: [100, 50, 100],
                    };
                    self.registration.showNotification('Vaccination Slots Found!', options);
                    self.sentAlert = true;
                }).catch(function (err) {
                    console.log(err);
                });
            })
            .catch(err => console.error(err));
    }, 30 * 1000);

})
// self.addEventListener('periodicsync', event => {
//     event.waitUntil(() => {
//         console.log("Test");
//         return;
//     });
//     // console.log("Here before");
//     // if (event.tag !== 'get-updates') return;
//     // else {
//     //     console.log("Here");
//     //     var options = {
//     //         body: 'This notification was generated from a push!',
//     //         icon: 'images/icons/icon-72x72.png',
//     //         vibrate: [100, 50, 100],
//     //         data: {
//     //             dateOfArrival: Date.now(),
//     //             primaryKey: '1'
//     //         },
//     //         actions: [
//     //             {
//     //                 action: 'explore', title: 'Explore this new world',
//     //                 icon: 'images/coffee1.jpg'
//     //             },
//     //             {
//     //                 action: 'close', title: 'Close',
//     //                 icon: 'images/coffee2.jpg'
//     //             },
//     //         ]
//     //     };
//     //     self.registration.showNotification('Hello world!', options);
// });

self.addEventListener('fetch', function (event) {
    // it can be empty if you just want to get rid of that error
});