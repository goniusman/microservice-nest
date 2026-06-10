export const alarmDetails = () => {
    return [
        {
            alert: 'Alert',
            title: 'Fall Alert Detected',
            description: 'The device detected a fall in [Room]. Immediate help may be needed.',
            pushNotificationTitle: "Fall Detected: [User's Name]",
            pushNotificationText: "[User's Name] had a fall. Immediate assistance is required.",
            alertType: 'Critical'
        },
        {
            alert: 'Alert',
            title: 'High Heart Rate Detected',
            description: 'The device detected a high heart rate in [Room]. Immediate attention is required.',
            pushNotificationTitle: "High Heart Rate Alert: [User's Name]",
            pushNotificationText: "[User's Name] is experiencing a high heart rate. Please check on them now.",
            alertType: 'Critical'
        },
        {
            alert: 'Alert',
            title: 'Low Heart Rate Detected',
            description: 'The device detected a low heart rate in [Room]. Immediate help is required.',
            pushNotificationTitle: "Low Heart Rate Alert: [User's Name]",
            pushNotificationText: "[User's Name]'s heart rate is critically low. Immediate attention is needed.",
            alertType: 'Critical'
        },
        {
            alert: 'Alert',
            title: 'High Respiratory Rate Detected',
            description: 'The device detected a high respiratory rate in [Room]. Immediate attention is recommended.',
            pushNotificationTitle: "Rapid Breathing Detected: [User's Name]",
            pushNotificationText: "[User's Name] is breathing rapidly. Please monitor their condition.",
            alertType: 'Critical'
        },
        {
            alert: 'Alert',
            title: 'Low Respiratory Rate Detected',
            description: 'The device detected a low respiratory rate in [Room]. Immediate help is required.',
            pushNotificationTitle: "Slow Breathing Detected: [User's Name]",
            pushNotificationText: "[User's Name] is breathing abnormally slowly. Immediate action may be required.",
            alertType: 'Critical'
        },
        {
            alert: 'Alert',
            title: 'Sleep Apnea Detected',
            description: 'The device detected signs of sleep apnea in [Room]. Follow-up is needed.',
            pushNotificationTitle: "Sleep Apnea Warning: [User's Name]",
            pushNotificationText: "[User's Name] may have experienced a breathing pause. Please follow up.",
            alertType: 'Warning'
        },
        {
            alert: 'Alert',
            title: 'Weak Vital Signs Detected',
            description: 'The device detected weak vital signs in [Room]. Immediate response is recommended.',
            pushNotificationTitle: "Weak Vital Signs: [User's Name]",
            pushNotificationText: "[User's Name]'s vital signs appear weak. Immediate response recommended.",
            alertType: 'Critical'
        },
        {
            alert: 'In and Out Door',
            title: 'User Enters the Room',
            description: 'Entered [Room].',
            pushNotificationTitle: "[User's Name] Entered [Room]",
            pushNotificationText: "[User's Name] has just entered [Room].",
            alertType: 'Info'
        },
        {
            alert: 'In and Out Door',
            title: 'User Leaves the Room',
            description: 'Left [Room].',
            pushNotificationTitle: "[User's Name] Left [Room]",
            pushNotificationText: "[User's Name] has just left [Room].",
            alertType: 'Info'
        },
        {
            alert: 'Online / Offline',
            title: 'Device Offline',
            description: 'The monitoring device in [Room] is offline. Please check immediately.',
            pushNotificationTitle: "Device Offline: [User's Name]",
            pushNotificationText: "Monitoring device for [User's Name] is offline. Please check immediately.",
            alertType: 'Critical'
        },
        {
            alert: 'Online / Offline',
            title: 'Device Back Online',
            description: 'The monitoring device in [Room] is back online.',
            pushNotificationTitle: "Device Restored: [User's Name]",
            pushNotificationText: "Monitoring device for [User's Name] is back online and functioning normally.",
            alertType: 'Info'
        },
        {
            alert: 'Getting in and out of bed',
            title: 'User Enters the Monitoring Bed',
            description: 'Entered the monitoring bed in [Room].',
            pushNotificationTitle: "[User's Name] in Monitoring Bed",
            pushNotificationText: "[User's Name] has entered the monitoring bed.",
            alertType: 'Info'
        },
        {
            alert: 'Getting in and out of bed',
            title: 'User Leaves the Monitoring Bed',
            description: 'Left the monitoring bed in [Room].',
            pushNotificationTitle: "[User's Name] Left Monitoring Bed",
            pushNotificationText: "[User's Name] has left the monitoring bed.",
            alertType: 'Info'
        },
        {
            alert: 'Poor Signal',
            title: 'Poor Internet Signal',
            description: 'The monitoring device in [Room] has poor internet signal.',
            pushNotificationTitle: "Weak Signal: [User's Name]",
            pushNotificationText: "The monitoring device for [User's Name] has poor signal. Please check.",
            alertType: 'Warning'
        },
        {
            alert: 'Poor Signal',
            title: 'Internet Signal Recovered',
            description: 'The internet signal for the monitoring device in [Room] has been restored.',
            pushNotificationTitle: "Signal Restored: [User's Name]",
            pushNotificationText: "The signal for [User's Name]'s monitoring device has been restored.",
            alertType: 'Info'
        },
        {
            alert: 'Abnormal Inclination',
            title: 'Abnormal Device Tilt Detected',
            description: 'The monitoring device in [Room] is tilted abnormally.',
            pushNotificationTitle: "Device Moved: [User's Name]",
            pushNotificationText: "The monitoring device for [User's Name] has been repositioned. Please check it.",
            alertType: 'Warning'
        },
        {
            alert: 'Abnormal Inclination',
            title: 'Device Tilt is Correct',
            description: 'The monitoring device in [Room] is now positioned correctly.',
            pushNotificationTitle: "Device Stabilized: [User's Name]",
            pushNotificationText: "The monitoring device for [User's Name] is now positioned correctly.",
            alertType: 'Info'
        },
        {
            alert: 'Others',
            title: 'User Did Not Leave the Bed',
            description: 'Has not left the bed in [Room] for an extended time.',
            pushNotificationTitle: "[User's Name] Hasn't Left Bed",
            pushNotificationText: "[User's Name] has not left the bed for an extended time. Please check on them.",
            alertType: 'Critical'
        },
        {
            alert: 'Others',
            title: 'User in Toilet for Too Long',
            description: 'Has been in the toilet in [Room] for an unusually long time.',
            pushNotificationTitle: "[User's Name] in Toilet for Too Long",
            pushNotificationText: "[User's Name] has been in the toilet for an unusually long time. Please assist.",
            alertType: 'Warning'
        },
        {
            alert: 'Others',
            title: 'No Activity Detected',
            description: 'No activity has been detected in [Room] for a long time.',
            pushNotificationTitle: "Inactivity Alert: [User's Name]",
            pushNotificationText: "No activity has been detected for [User's Name]. Please check on them.",
            alertType: 'Critical'
        }
    ]
}
