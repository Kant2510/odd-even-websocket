export const isValidRoomId = (roomId: string) => {
    // must be all numeric
    // length === 6
    const numericRegex = /^[0-9]+$/
    if (!numericRegex.test(roomId)) return false
    if (roomId.length !== 6) return false
    return true
}
