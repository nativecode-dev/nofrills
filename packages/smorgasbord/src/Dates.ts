import moment from 'moment'

export const Dates: any = {
  $: (date?: Date): moment.Moment => moment.utc(date),
  lastWeek: (date?: Date): Date => Dates.$(date).weekday(-7).toDate(),
  nextWeek: (date?: Date): Date => Dates.$(date).weekday(7).toDate(),
  today: (date?: Date): Date => Dates.$(date).toDate(),
  tomorrow: (date?: Date): Date => Dates.$(date).add(1, 'days').toDate(),
  yesterday: (date?: Date): Date => Dates.$(date).subtract(1, 'days').toDate(),
}
