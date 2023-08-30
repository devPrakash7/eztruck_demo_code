const driver = require('../models/driver.model');
const FCM = require("fcm-node");
const { SERVICE_KEY } = require("../keys/development.keys");
const fcm = new FCM(SERVICE_KEY);



function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
<<<<<<< HEAD
  console.log(earthRadius * c)
  return earthRadius * c;
}


exports.sendNotificationsToDrivers = async () => {
=======
  return earthRadius * c;
}
>>>>>>> 09216c2481ce82aa43ee90197389fb67541cba2a

  const maxRadius = 30; // Maximum search radius in kilometers
  let currentRadius = 10; // Initial radius in kilometers

  while (currentRadius <= maxRadius) {

    const drivers = await driver.find();
     const driversWithinRadius = drivers.filter((driver) => {
      const distance = calculateDistance(20.27241, 85.81632, driver.driver_lat, driver.driver_long);
      return driver.driver_status && distance <= currentRadius;
    });

    if (driversWithinRadius.length > 0) {
      // Send notifications to drivers
      driversWithinRadius.forEach(async (driver) => {
     console.log(driver.device_token)
        const message = {
          to: driver.device_token,
          collapse_key:'',
          notification: {
            title: 'New Ride Request',
            body: 'You have a new ride request.',
          },
          
        }

        try {
         
         await fcm.send(message, function (err, response) {
                    if (err) {
                      console.error(`Error sending notification to driver: ${err.message}`);
                    } else {
                      console.log(`Notification sent to driver.`);
                    }
                  });
        } catch (error) {
          console.error(`Error sending notification to driver: ${error.message}`);
        }
      });

    }

    currentRadius += 5; // Increase the search radius by 5 km
  }

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
//   const drivers = await driver.find();
//   const driversWithinRadius = drivers.map((driver) => {
//     const distance = calculateDistance(pickupLat, pickupLon, driver.latitude, driver.longitude);
//     if(driver.driver_status === "available"){
//        return driver.driver_status && distance <= radius;
//     }
//   });

//   return driversWithinRadius;

// }

// exports.sendNotificationsToDrivers  = async (pickupLat, pickupLon, maxRadius , bookingDetails) => {

//   let currentRadius = 0;
//   while (currentRadius <= maxRadius) {
//     const driversWithinRadius = findDriversWithinRadius(pickupLat, pickupLon, currentRadius);

//     if (driversWithinRadius.length > 0) {
//       console.log(`Found drivers within ${currentRadius} km radius, sending notifications.`);

//       // Send notifications to each driver found
//       for (const driver of driversWithinRadius) {
//         const driverToken = driver.deviceToken;
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


exports.sendFCMNotificationToCustomer = async (customerToken, driverData) => {
  // Construct the notification message for the customer
  const message = {
    to: customerToken,
    notification: {
      title: 'Booking Accepted',
      body: 'Your booking request has been accepted by the driver.',
    },
    data: {
      // Include driver data here
      ...driverData,
    },
  };

  // Send the notification to the customer
  try {
    fcm.send(message, function (err, response) {
      if (err) {
        console.error(`Error sending notification to customer: ${err}`);
      } else {
        console.log(`Notification sent to customer.`);
      }
    });
  } catch (error) {
    console.error(`Error sending notification to customer: ${error}`);
  }
}


<<<<<<< HEAD

=======
>>>>>>> 09216c2481ce82aa43ee90197389fb67541cba2a
