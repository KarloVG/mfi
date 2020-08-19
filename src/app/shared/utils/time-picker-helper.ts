export function createMidnightTime(date: Date | null | undefined): Date | null | undefined {
    if(date) {
        let returnDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(),0,0,0);
        return returnDate;
    } else {
        return date
    }
}

export function createBeforeMidnightTime(date: Date | null | undefined): Date | null | undefined {
    if(date) {
        let returnDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59);
        return returnDate;
    } else {
        return date
    }
}