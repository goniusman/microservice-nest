// export const convertToUTC = (dateString:any, timezoneOffset = 6) => {
//     // Parse date string into a Date object at 00:00 local time
//     const localStartDate = new Date(`${dateString}T00:00:00`);
//     const localEndDate = new Date(`${dateString}T23:59:59`);

//     // Adjust by timezone offset (Bangladesh is +6, so -6 to convert to UTC)
//     const utcStartDate = new Date(localStartDate.getTime() - timezoneOffset * 60 * 60 * 1000);
//     const utcEndDate = new Date(localEndDate.getTime() - timezoneOffset * 60 * 60 * 1000);

//     return {
//         utcStart: utcStartDate.toISOString(),  // Start of the day in UTC
//         utcEnd: utcEndDate.toISOString()       // End of the day in UTC
//     };
// }

export const convertToUTC = (dateString: any) => {
    // Parse date string into a Date object at 00:00 local time
    const localStartDate = new Date(`${dateString}T00:00:00`)
    const localEndDate = new Date(`${dateString}T23:59:59`)

    // Get the local timezone offset in minutes (positive for locations behind UTC, negative for ahead)
    const timezoneOffset = localStartDate.getTimezoneOffset() // in minutes

    // Convert to UTC by adjusting for the timezone offset
    const utcStartDate = new Date(localStartDate.getTime() + timezoneOffset * 60 * 1000) // Add offset to local time to get UTC
    const utcEndDate = new Date(localEndDate.getTime() + timezoneOffset * 60 * 1000) // Add offset to local time to get UTC

    return {
        utcStart: utcStartDate.toISOString(), // Start of the day in UTC
        utcEnd: utcEndDate.toISOString() // End of the day in UTC
    }
}

// export const convertToUTC = (dateString: string) => {
//     const [year, month, day] = dateString.split('-').map(Number)

//     // Create the date in UTC
//     const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))

//     // Subtract 1 day
//     date.setUTCDate(date.getUTCDate())

//     const utcStartDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0))
//     const utcEndDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59))

//     return {
//         utcStart: utcStartDate.toISOString(), // start of day, 1 day behind
//         utcEnd: utcEndDate.toISOString() // end of day, 1 day behind
//     }
// }

export const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0') // Add leading zero if needed
    const day = String(today.getDate()).padStart(2, '0') // Add leading zero if needed
    return `${year}-${month}-${day}`
}

export const timeRange = (to_date: string, from_date: string) => {
    const startDate = convertToUTC(to_date ? to_date : getTodayDate())
    const endDate = convertToUTC(from_date ? from_date : to_date ? to_date : getTodayDate())
    return { startAt: new Date(startDate.utcStart), endAt: new Date(endDate.utcEnd) }
}

// const startDate = convertToUTC(to_date ? to_date : getTodayDate())
// const endDate = convertToUTC(from_date ? from_date : to_date ? to_date : getTodayDate())
