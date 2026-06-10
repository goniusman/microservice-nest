export const handleUpdateResponse = (result: {
    acknowledged: boolean
    modifiedCount: number
    matchedCount: number
}): { status: boolean; message: string } => {
    if (result.matchedCount === 0) {
        return { status: false, message: 'No matching document found. Operation failed.' }
    }

    if (result.modifiedCount > 0) {
        return { status: true, message: 'Operation successful.' }
    } else {
        return { status: false, message: 'Document matched, but no changes were made.' }
    }
}
