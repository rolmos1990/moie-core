export enum StatTimeTypes {
    DAILY = 'dia',
    WEEKLY= 'semana',
    MONTHLY= 'mes',
    YEARLY= 'año'
};


export const isValidStatTimes = (timeType) => {
    if(!timeType){
        return false;
    }
    return [StatTimeTypes.DAILY,StatTimeTypes.WEEKLY,StatTimeTypes.MONTHLY, StatTimeTypes.YEARLY].includes(timeType.toLowerCase());
}
