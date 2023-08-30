
// Sample driver data (replace with your actual driver data)
const drivers = [
    { id: '1', latitude: 20.31009, longitude: 85.82009, isAvailable: true, deviceToken: 'dAS0FSg1Q2SAQG-V1DE7th:APA91bHpjjRbxRw9UIdKLkupn7hDET8yKEEO2zK1qHpLVCfcdSPCKSPLSh5b766-xjgnqAYB6w688yI5BnGYSFcO1H63jKu_ayBqSWcgd6RJngOs9wk7f0_9Ix6V8ieu-uxy0tHoQl1T' },
    // Add more driver data as needed
  ];
  
  const FCM = require('fcm-node');
  const serverKey = 'AAAAXaN35Ss:APA91bGHihxZ4wDVO2J-yZiXkEOGn0ymytR6STB7zaxM-pfn50CaBWUQI9llthgCZn2ab98CzGln7zEl-38WtztISHvXmsrxAWUBqlnRB3Fqy4X4GrmA64tXCijlhaA2bCLx6PbtsJUj'; // Replace with your actual FCM server key
  const fcm = new FCM(serverKey);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log(earthRadius * c)
    return earthRadius * c;
  }
  
  
  // async function sendFCMNotificationToDriver(driverToken, bookingDetails) {
  //   // Construct the notification message
  //   const message = {
  //       to: driverToken,
  //       notification: {
  //         title: 'New Booking Request',
  //         body: 'You have a new booking request.',
  //       },
  //       data: {
  //         // Include booking details here
  //         ...bookingDetails,
  //       },
  //     };
  //   console.log(message.data)
  //     // Send the notification
  //     try {
  //       fcm.send(message, function (err, response) {
  //         if (err) {
  //           console.error(`Error sending notification to driver: ${err}`);
  //         } else {
  //           console.log(`Notification sent to driver.`);
  //         }
  //       });
  //     } catch (error) {
  //       console.error(`Error sending notification to driver: ${error}`);
  //     }
  // }
  
  // async function findDriversWithinRadius(pickupLat, pickupLon, radius) {
    
  //   const driversWithinRadius = drivers.map((driver) => {
  //     console.log(driver.latitude)
  //     const distance = calculateDistance(pickupLat, pickupLon, driver.latitude, driver.longitude);
  //        return driver.isAvailable && distance <= radius;
  
  //   });
  
  //   return driversWithinRadius;
  
  // }
  
  // const sendNotificationsToDrivers  = async (pickupLat, pickupLon, maxRadius , bookingDetails) => {
  
  //   let currentRadius = 0;
  //   while (currentRadius <= maxRadius) {
  //     const driversWithinRadius = findDriversWithinRadius(pickupLat, pickupLon, currentRadius);
  
  //     if (driversWithinRadius.length > 0) {
  //       console.log(`Found drivers within ${currentRadius} km radius, sending notifications.`);
  
  //       // Send notifications to each driver found
  //       for (const drivers of driversWithinRadius) {
  //         const driverToken = drivers.deviceToken;
  //         console.log(driverToken);
  //         await sendFCMNotificationToDriver(driverToken, bookingDetails);
  //       }
  
  //       // Drivers found, exit the loop
  //       break;
  //     } else {
  //       console.log(`No drivers found within ${currentRadius} km radius.`);
  
  //       // Increase the search radius by 5 km, up to the maximum specified
  //       currentRadius += 5;
  
  //       if (currentRadius > maxRadius) {
  //         console.log(`No drivers found within the maximum radius of ${maxRadius} km.`);
  //         // Handle the case where no drivers are found even within the maximum radius.
  //         break;
  //       }
  //     }
  //   }
  // }

const sendNotificationsToDrivers = async (pickupLat , pickupLong , bookingData) => {

  const maxRadius = 30; // Maximum search radius in kilometers
  let currentRadius = 10; // Initial radius in kilometers

  while (currentRadius <= maxRadius) {
    const driversWithinRadius = drivers.filter((driver) => {
      const distance = calculateDistance(pickupLat, pickupLong, driver.latitude, driver.longitude);
      return driver.isAvailable && distance <= currentRadius;
    });

    if (driversWithinRadius.length > 0) {
      // Send notifications to drivers
      driversWithinRadius.forEach(async (driver) => {
    
        const message = {
          to: driver.deviceToken,
          notification: {
            title: 'New Ride Request',
            body: 'You have a new ride request.',
          },
          data: {
            ...bookingData
          },
          
        };
        console.log(message.data)

        try {
         
         await fcm.send(message, function (err, response) {

                    if (err) {
                      console.error(`Error sending notification to driver: ${err}`);
                    } else {
                      console.log(`Notification sent to driver.`);
                    }
                  });
        } catch (error) {
          console.error(`Error sending notification to driver: ${error}`);
        }
      });

    }

    currentRadius += 5; // Increase the search radius by 5 km
  }

}

pickupLat = 20.27241
pickupLong  = 85.81632
let bookingData = {
  "customer_name": "prakash",
  "email":"prakash@909.com"
}

sendNotificationsToDrivers(pickupLat, pickupLong , bookingData)
      .then(() => {
        console.log('Notification send successfully')
      })
      .catch((error) => {
        console.error('Error sending notifications:', error);
      });