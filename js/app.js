const container = document.querySelector(".container");

const showCoffees = () => {

  let output = "";
  this.localforage.getItem('pincode_data').then((value) => {
    if (!value) return;
    value['centers'].forEach(center => {
      output += `
              <div class="card">
                <h1 class="card--title">${center.name}</h1>
                <h4>Address: ${center.address}</h4>
                <a class="card--link" href="#">Book Now</a>
              </div>
              `
    });
    container.innerHTML = output;

  }).catch(function (err) {
    console.log(err);
  });

};

document.addEventListener("DOMContentLoaded", showCoffees);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {

    const params = new URLSearchParams(self.window.location.search);
    const myParam = params.get('userid') || 'sidhant';

    fetch(`data/${myParam}.json`)
      .then(response => response.json())
      .then(res => {
        localforage.setItem('user_config', res).then(() => {

          navigator.serviceWorker
            .register('/myWorker.js')
            .then(() => {
              console.log("service worker registered");
            })
            .catch(err => console.log("service worker not registered", err));


        }).catch(function (err) {
          // This code runs if there were any errors
          console.log(err);
        });
      })
      .catch(err => console.log(err));

  });
}

// const askPerm = async () => {
//   console.log('Here Before');
//   const status = await navigator.permissions.query({
//     name: 'periodic-background-sync',
//   });
//   if (status.state === 'granted') {
//     // Periodic background sync can be used.
//     console.log('Here');
//   } else {
//     // Periodic background sync cannot be used.
//   }
// }

// async function registerPeriodicNewsCheck() {
//   if ('serviceWorker' in navigator) {
//     const registration = await navigator.serviceWorker.ready;
//     // Check if periodicSync is supported
//     if ('periodicSync' in registration) {
//       // Request permission
//       const status = await navigator.permissions.query({
//         name: 'periodic-background-sync',
//       });
//       if (status.state === 'granted') {
//         try {
//           // Register new sync every 24 hours
//           await registration.periodicSync.register('get-updates', {
//             minInterval: 60, // 1 day
//           });
//           console.log('Periodic background sync registered!');
//         } catch (e) {
//           console.error(`Periodic background sync failed:\n${e}`);
//         }
//       }
//     }
//   }

//   navigator.serviceWorker.ready.then(registration => {
//     registration.periodicSync.getTags().then(tags => {
//       if (tags.includes('get-updates')) console.log("Chall Gaya");
//       // skipDownloadingLatestNewsOnPageLoad();
//     });
//   });
// }



let requestPermission = () => {
  if ('Notification' in window && navigator.serviceWorker) {
    // Display the UI to let the user toggle notifications
    Notification.requestPermission(function (status) {
      console.log('Notification permission status:', status);
    });
  }

}



// askPerm();
