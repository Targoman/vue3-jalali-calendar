<template>
  <div id="persian-calendar">
      <!--CALENDAR HEADER-->
      <div id="vpc_header" slot="header">
          <div id="vpc_date-control">
              <div class="vpc_control-btn" @click="subtractPeriod" :disabled="isBeforeMin()">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mb-2" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
              </div>

              <span v-if="isWeekPeriod" class="vpc_now-date">
                 {{ displayRangeText.toPersianDigits() }}
              </span>
              <span v-else class="vpc_now-date">
                  {{ currentDate.locale('fa').format('jMMMM jYYYY').toPersianDigits() }}
              </span>

              <div class="vpc_control-btn" @click="addPeriod" :disabled="isAfterMax()">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mb-2" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
              </div>
              <div v-if="!disableToday" class="vpc_today-btn" @click="goToday" :disabled="todayBtnDisable">امروز</div>
          </div>
          <div v-if="!disablePeriod" class="vpc_period-control">
              <div class="vpc_period-btn" @click="togglePeriod">{{ displayPeriodText }}</div>
          </div>
      </div>
      <!--CALENDAR GRID-->
      <transition
          :name="transitionAction"
          @after-leave="afterLeave"
      >
          <div v-if="currentDateChange">
              <div id="vpc_calendar">
                  <!--DAYS HEADER-->
                  <div id="vpc_days-header">
                      <div>شنبه</div>
                      <div>یکشنبه</div>
                      <div>دوشنبه</div>
                      <div>سه شنبه</div>
                      <div>چهار شنبه</div>
                      <div>پنج شنبه</div>
                      <div>جمعه</div>
                  </div>
                  <!--WEEKS ROW-->
                  <div
                      v-for="week in periodWeeks"
                      :key="week.uid"
                      :class="weekClassObject"
                  >
                      <div class="week_events">
                          <template v-for="(i, index) in getWeekEventsForCurrentPeriod(week[0].startOf('jWeek'))">
                              <slot
                                  :value="i"
                                  :weekStartDate="$moment(week).startOf('jWeek')"
                                  :top="getEventTop(i)"
                                  name="event"
                              >
                                  <button
                                      :key="index"
                                      :class="i.classes"
                                      :id="`popover-show-event-details_${i.id}_${joinClassesItems(i.classes)}`"
                                      :style="`top:${getEventTop(i)};background-color:${i.type.color};`"
                                      class="vpc_event border-0"
                                  >
                                      <div :style="{'background-color':i.type.color}" class="vpc_event-ball"></div>
                                      <span class="vpc_event-start-time"
                                            v-if="!hideEventTimes">
                                          {{ i.startDateTime.format('HH:mm').toPersianDigits() }}
                                          <span>
                                              - {{ i.endDateTime.format('HH:mm').toPersianDigits() }}
                                          </span>
                                      </span>
                                      <span class="vpc_event-start-date" v-if="!hideEventTimes">
                                          {{ i.startDateTime.format('jMM/jDD').toPersianDigits() }}
                                      </span>
                                      <span class="vpc_event-title">{{ i.title }}</span>
                                      <span class="vpc_event-end-time" v-if="!hideEventTimes">
                                          {{ i.endDateTime.format('HH:mm').toPersianDigits() }}
                                      </span>
                                      <span class="vpc_event-end-date" v-if="!hideEventTimes">
                                          {{ i.endDateTime.format('jMM/jDD').toPersianDigits() }}
                                      </span>
                                  </button>
                              </slot>
                              <div
                                  v-if="showWeekEventsButton(week[0].startOf('jWeek')) && index === 0 && period === 'month'"
                                  class="vpc_event offset6 more_event_btn pl-0"
                                  style="top:calc(5.5em + 2px);background-color:#9e9e9e;">
                                  <button variant="transparent" size="sm" class="w-100 py-2"
                                            @click="allEventsOfWeek(getWeekEvents(week[0].startOf('jWeek')))">
                                      رویدادهای هفته
                                      ({{ (getWeekEvents(week[0].startOf('jWeek')).length) }})
                                  </button>
                              </div>
                          </template>
                      </div>
                      <!--DAYS-->
                      <div
                          v-for="day in week"
                          :key="day.uid"
                          :class="dayClassObject(day)"
                          :id="`popover-show-vacation-description_${day.format('jYYYY-jMM-jDD')}`"
                          @click="emitDay(day, $event)"
                      >
                          <div class="vpc_day-number">
                              <div>
                                  {{ day.format('jD').toPersianDigits() }}
                              </div>
                              <div class="vpc_vacations-description">
                                  {{ descriptionOfVacationDay(day) }}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </transition>
  </div>
</template>

<script setup >
import {getCurrentInstance ,computed,watch,onMounted} from 'vue';

const {moment} = getCurrentInstance().proxy.$filter
console.log(moment(new Date(), 'jYYYY/jMM/jDD'));

const currentDate = null
    const currentDateChange= true
    const transitionAction= 'slide-right'
    const addEventModalShow= false
    const period= 'month'
    const events= []
    const min= null
    const max= null
defineProps({
  dateFormat: {
    type: String,
    default: 'jYYYYDD'
    },
  showDate: {
    type: [Object, String],
    default: 'moment'
  },
  displayPeriod: String,
  eventsList: {
    type: Array,
    default: []
  },
  vacationsList: {
    type: Array,
    default: []
  },
  minDate: [Object, String],
  maxDate: [Object, String],
  hideEventTimes: {
    type: Boolean,
    default: false
  },
  disableToday: {
    type: Boolean,
    default: false
  },
  disablePeriod: {
    type: Boolean,
    default: false
    },
  hideMonthShadow: {
    type: Boolean,
    default: false
  },
  hidePastDaysShadow: {
    type: Boolean,
    default: false
  },
  disablePastDays: {
    type: Boolean,
    default: false
  },
})


const month = computed({
  get () {
      return currentDate.format('jM')
    },
    set (value) {
      currentDate = value
    }
})
const year = computed({
  get () {
      return currentDate.format('jYYYY')
    },
    set (value) {
     currentDate = value
    }
})
const daysInMonth = computed ( ()=>
  {
    // Generating all days in current month
    const days = []
    let currentDay = moment(`${year}-${month}-1`, 'jYYYY-jM-jD').locale('fa')
    do {
      days.push(currentDay)
      currentDay =moment(currentDay).add(1, 'days')
    } while (moment(currentDay).format('M') === month)
    // Add previous days to start
    currentDay =moment(days[0])
    const SHANBE = 0
    const JOMEE = 6
    if (currentDay.jDay() !== SHANBE) {
      do {
        currentDay =moment(currentDay).subtract(1, 'days')
        days.unshift(currentDay)
      } while (currentDay.jDay() !== SHANBE)
    }
    // Add following days to end
    currentDay =moment(days[days.length - 1])
    if (currentDay.jDay() !== JOMEE) {
      do {
        currentDay =moment(currentDay).add(1, 'days')
        days.push(currentDay)
      } while (currentDay.jDay() !== JOMEE)
    }
    return days
  },
) 
const emit  = defineEmits([
'startAndEndOfWeekPeriod',
'startAndEndOfMonthPeriod',
'week-events',
'on-page-add',
'on-page-subtract',
'update:displayPeriod',
'on-display-period',
'on-day-click'])
const daysInWeek =computed (() =>  {
    const days = []
    const showDay =moment(currentDate)
    let day = showDay.startOf('jWeek')
    do {
      days.push(day)
      day =moment(day).add(1, 'days')
    } while (!day.isSame(moment(showDay).add(7, 'days')))
    emit('startAndEndOfWeekPeriod', days[0], days[6])
    return days
  })


  const weeksInMonth=(() =>  {
    const weeks = []
    let week = []
    for (let i = 0; i < daysInMonth.length; i++) {
      week.push(daysInMonth[i])
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }
    emit('startAndEndOfMonthPeriod', weeks[0][0], weeks.slice(-1)[0][6])
    return weeks
  })



 const isWeekPeriod =computed (() => {
    return period === 'week'
 })
  const periodWeeks =computed (() => {
    return isWeekPeriod ? [daysInWeek] : weeksInMonth
  })
  const  displayPeriodText =computed (() => {
    return isWeekPeriod ? 'ماه' : 'هفته'
  })

  const displayRangeText=computed (()=>{
    const start =moment(currentDate).locale('fa').startOf('jWeek')
    const end =moment(start).locale('fa').add(6, 'days')
    let startformat = 'DD'
    if (!start.isSame(end, 'month')) startformat = 'DD jMMMM'
    if (!start.isSame(end, 'year')) startformat = 'DD jMMMM jYYYY'
    return `${start.format(startformat)} - ${end.format('DD jMMMM jYYYY')}`
  }) 
  const todayBtnDisable =computed (()=> {
    if (min) {
      if (max) return !moment().isBetween(moment(this.min).startOf('day'),moment(max).endOf('day'))
      return min.isAfter(moment().startOf('day'), 'day')
    }
    if (max) {
      return max.isBefore(moment().endOf('day'), 'day')
    }
    return false
  })
  const weekClassObject= computed (()=> {
    return {
      'vpc_week': true,
      'vpc_week-period': isWeekPeriod
    }
  })
// watch: {
//   currentDate () {
//     // update transition
//     this.currentDateChange = false
//   },
//   showDate (value) {
//     this.currentDate = this.getDateByFormat(value)
//   },
//   displayPeriod (value) {
//     this.period = value
//   },
//   eventsList (value) {
//     this.events = value
//   },
//   minDate (value) {
//     this.min = this.getDateByFormat(value)
//   },
//   maxDate (value) {
//     this.max = this.getDateByFormat(value)
//   }
// },

onMounted(() => {
  console.log({testMoment});
  currentDate = getDateByFormat(showDate)
  if (minDate) min = getDateByFormat(minDate)
  if (maxDate) max = getDateByFormat(maxDate)
  period = displayPeriod
  events = eventsList
})


 function allEventsOfWeek (weekEvents) {
    emit('week-events', weekEvents)
  }
  function getDateByFormat (value) {
    try {
      if (typeof value === 'string') returnmoment(value, dateFormat)
      else if (typeof value === 'object') returnmoment(value)
    } catch (error) {
      throw new TypeError('[VuePersianCalendar Error]: showDate property value is not valid')
    }
  }
  function isAfterMax () {
    if (!max) return
    const newDate =moment(currentDate).add(1, isWeekPeriod ? 'weeks' : 'months')
    const periodStart = newDate.startOf(isWeekPeriod ? 'jWeek' : 'jMonth')
    return max.isValid() && periodStart.isAfter(max)
  }
  function isBeforeMin () {
    if (!min) return
    const newDate =moment(currentDate).subtract(1, isWeekPeriod ? 'weeks' : 'months')
    const periodEnd =moment(min).startOf(isWeekPeriod ? 'jWeek' : 'jMonth')
    return min.isValid() && periodEnd.isAfter(newDate)
  }
  function addPeriod () {
    if (isAfterMax()) return
    transitionAction = 'slide-left'
    currentDate =moment(currentDate).add(1, isWeekPeriod ? 'weeks' : 'months')
    emit('on-page-add', currentDate)
  }
  function subtractPeriod () {
    if (isBeforeMin()) return
    transitionAction = 'slide-right'
    currentDate =moment(currentDate).subtract(1, isWeekPeriod ? 'weeks' : 'months')
    emit('on-page-subtract', currentDate)
  }
  function goToday () {
    if (todayBtnDisable) return
    if (currentDate.isBefore(moment(), 'month') || (isWeekPeriod && currentDate.isBefore(moment().startOf('jWeek')))) {
      transitionAction = 'slide-left'
      currentDate =moment()
    } else if (currentDate.isAfter(moment(), 'month') || (isWeekPeriod && currentDate.isAfter(moment(), 'week'))) {
      transitionAction = 'slide-right'
      currentDate =moment()
    }
  }
  function togglePeriod () {
    period = isWeekPeriod ? 'month' : 'week'
    emit('update:displayPeriod', period)
    emit('on-display-period-change',period)
    // update transition
    currentDateChange = false
  }
  function miladiDate (day) {
    returnmoment(day).locale('en').format('YYYY-MM-DD')
  }
  function descriptionOfVacationDay (day) {
    const vacationDetails = vacationsList.find(e => e.date === miladiDate(day))
    return vacationDetails ? vacationDetails.description : ''
  }
  function dayClassObject (day) {
    const jomee =moment(day).jDay() === 6
    const today = day.isSame(moment(), 'day')
    const dayIsVacation = vacationsList.some(e => e.date === miladiDate(day))
    let disable = false
    if (min) {
      disable = (min.isValid() && day.isBefore(min, 'day')) || disable
    }
    if (max) {
      disable = (max.isValid() && day.isAfter(max, 'day')) || disable
    }
    return {
      'vpc_day': true,
      'vpc_today': today && !disableToday,
      'vpc_past': day.isSameOrBefore(moment(), 'day') && !today && !hidePastDaysShadow,
      'vpc_not-current-month': !day.isSame(currentDate, 'month') && !isWeekPeriod && !hideMonthShadow,
      'vpc_week-period-day': isWeekPeriod,
      'vpc_day-disable': disable,
      'vpc_weekend': jomee,
      'vpc_vacation': dayIsVacation
    }
  }
  function afterLeave () {
    // Transition show month after fade out
    currentDateChange = true
  }
  function eventComparer (a, b) {
    if (a.startDateTime.isBefore(b.startDateTime)) return -1
    if (b.startDateTime.isBefore(a.startDateTime)) return 1
    if (a.endDateTime.isAfter(b.endDateTime)) return -1
    if (b.endDateTime.isAfter(a.endDateTime)) return 1
    return a.id < b.id ? -1 : 1
  }
  function findAndSortEventsInWeek (weekStart) {
    // Return a list of events that INCLUDE any portion of a given week.
    return findAndSortEventsInDateRange(
      weekStart,moment(weekStart).hours(23).minutes(59).seconds(59).add(6, 'days')
    )
  }
  function findAndSortEventsInDateRange (startDateTime, endDateTime) {
    // Return a list of events that INCLUDE any day within the date range,
    // inclusive, sorted so events that start earlier are returned first.
    return events
      .filter(
        // (event) => event.endDateTime >= startDateTime && this.dateOnly(event.startDateTime) <= endDateTime,
        (event) => event.endDateTime.isSameOrAfter(startDateTime) && event.startDateTime.isSameOrBefore(endDateTime),
        this
      )
      .sort(this.eventComparer)
  }
  function dayHasEvents (day) {
    return events.find(
      (d) => d.endDateTime.isSameOrAfter(day) && d.startDateTime.isSameOrBefore(day)
    )
  }
  function dayEvents (day) {
    return this.events.filter(
      (d) => d.endDateTime.isSameOrAfter(day) && d.startDateTime.isSameOrBefore(day)
    )
      .sort(eventComparer)
  }
  function  dayIsSelected (day) {
    if (!selectionStart || day < selectionStart) return false
    return !(!selectionEnd || day > selectionEnd)
  }
  function   getWeekEvents (weekStart) {
    // Return a list of events that CONTAIN the week starting on a day.
    // Sorted so the events that start earlier are always shown first.
    const events = findAndSortEventsInWeek(weekStart.startOf('day'))
    const results = []
    const eventRows = [[], [], [], [], [], [], []]
    for (let i = 0; i < events.length; i++) {
      const ep = Object.assign({}, events[i], {
        classes: events[i].classes ? [...events[i].classes] : [],
        eventRow: 0
      })
      const continued = ep.startDateTime.isBefore(weekStart)
      const startOffset = continued ? 0 : diff(ep.startDateTime, weekStart)
      const spanContinued = continued ? diff(moment(ep.endDateTime), weekStart) + 1 : diff(moment(ep.endDateTime), ep.startDateTime) + 1
      const span = Math.min(7 - startOffset, spanContinued)
      if (continued) ep.classes.push('continued')
      // if (diff(ep.endDateTime, weekStart) > 6) ep.classes.push('toBeContinued')
      if (ep.endDateTime.isBefore(moment())) ep.classes.push('past')
      if (ep.endDateTime.isBetween(moment(ep.startDateTime),moment(ep.startDateTime).endOf('day'), undefined, '[]')) ep.classes.push('oneDay')
      for (let d = 0; d < 7; d++) {
        if (d === startOffset) {
          let s = 0
          while (eventRows[d][s]) s++
          ep.eventRow = s
          eventRows[d][s] = true
        } else if (d < startOffset + span) {
          eventRows[d][ep.eventRow] = true
        }
      }
      ep.classes.push(`offset${startOffset}`)
      ep.classes.push(`span${span}`)
      results.push(ep)
    }
    return results
  }
  function  showWeekEventsButton (weekEvents) {
    let showableEvents = []
    showableEvents = getWeekEvents(weekEvents).filter(event => event.eventRow <= 4) // just show 5 ( 0 <= eventRow <=4 ) row of events
    return getWeekEvents(weekEvents).length !== showableEvents.length
  }
  function getWeekEventsForCurrentPeriod (weekEvents) {
    if (period === 'month') {
      let showableEvents = []
      showableEvents = getWeekEvents(weekEvents).filter(event => event.eventRow <= 4) // just show 5 ( 0 <= eventRow <=4 ) row of events
      return showableEvents
    } else if (period === 'week') {
      return getWeekEvents(weekEvents)
    }
  }
  function getEventTop (e) {
    // Compute the top position of the event based on its assigned row within the given week.
    const r = e.eventRow
    const h = isWeekPeriod ? '2.6em' : '1.3em'
    const b = '2px'
    return `calc( 0em + ${r}*${h} + ${r}*${b})`
  }
  function joinClassesItems (classes) {
    return classes.join('_')
  }
  // function diff (e, s) {
  //   s.locale('fa')
  //   e.locale('fa')
  //   const add_diff = s.clone().startOf('day').add(e.diff(s, 'm'), 'm').locale('fa'),
  //     let diff = e.diff(s, 'day')

  //   if (add_diff.isBefore(e, 'day')) return diff + 1
  //   return diff
  //   const diff = e.diff(s, 'day')
  //   if (parseInt(e.format('jD')) > parseInt(s.format('jD'))) return parseInt(e.format('jD')) - parseInt(s.format('jD'))
  // }
  function emitDay (day, $event) {
    if (disablePastDays) {
      if (!day.isBefore(moment(), 'day')) {
        emit('on-day-click', day)
      } else {
        $event.stopPropagation()
      }
    }
  }

</script>































<style lang="scss">
// @import 'bootstrap/scss/bootstrap';
// @import '~bootstrap-vue/dist/bootstrap-vue.css';

/** Extra small devices (phones, 600px and down) */
$xs: "screen and (max-width: 600px)";
/** Small devices (portrait tablets and large phones, 601px to 768px) */
$sm: 'screen and (min-width: 601px) and (max-width: 768px)';
/** Medium devices (landscape tablets, 769px to 991px) */
$md: 'screen and (min-width: 769px) and (max-width: 991px)';
/** Large devices (laptops/desktops, 992px to 1200px) */
$lg: 'screen and (min-width: 992px) and (max-width: 1200px)';
/** Extra large devices (large laptops and desktops, 1201px and up) */
$xl: 'screen and (min-width: 1201px)';
// The mdia mixin
@mixin media( $selectors... ) {
  $selector: '';
  @each $s in $selectors {
    @if $selector == '' {
      $selector: $s;
    } @else {
      $selector: $selector + ', ' + $s;
    }
  }
  @media #{unquote($selector)}{
    @content;
  }
}

$primary_color: #7367F0;
$background: #fff;
$past_background: rgb(250, 250, 250);
$not_current_month_background: rgb(236, 236, 236);
$days_header_color: #626262;

$event_green: #42b983;
$event_black: #262626;

$border_color: #ddd;
$calendar_border: 1px solid $border_color;
$color-red-lighten: rgba(255, 0, 37, 0.1);

@mixin calendar-row {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  /* Shorthand flex: 1 1 0 not supported by IE11 */
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  flex-flow: row nowrap;
  border-width: 0;
  /* Allow week items to scroll if they are too tall */
  position: relative;
  overflow-y: auto;
  -ms-overflow-style: none;
}

@mixin calendar-cell {
  width: 100%;
  overflow: hidden;
  padding: 0.5em;
  border-right: $calendar_border;
  border-top: $calendar_border;
  user-select: none;
  background: $background;
}

@mixin shadow-text {
  background-color: #565656;
  color: transparent;
  text-shadow: 0px 1px 1px rgba(255, 255, 255, 0.5);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
}

@mixin text-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1em;
}

#persian-calendar {
  font-weight: normal;
  font-size: 1em;
  direction: rtl;
  user-select: none;

  * {
    padding: 0;
    margin: 0;
    box-sizing: content-box;
    -moz-box-sizing: content-box;
    -webkit-box-sizing: content-box;
    outline: none;
    text-transform: none;
    text-decoration: none;
  }

  #vpc_header {
    padding: 20px 15px;
    display: flex;

    #vpc_date-control {
      display: flex;
      justify-content: flex-start;
      font-size: 1em;

      .vpc_control-btn {
        width: 1em;
        height: 1em;
        padding: 0.3em;
        border-radius: 9999px !important;
        cursor: pointer !important;
        background-color: $primary_color !important;
        color: #fff !important;

        &[disabled] {
          background-color: #ccc !important;
          cursor: not-allowed !important;
        }
      }

      .vpc_now-date {
        margin: auto .75em;
        white-space: nowrap;
      }

      .vpc_today-btn {
        @include text-center;
        margin: 0 10px;
        height: 1.3em;
        line-height: 1em;
        vertical-align: middle;
        padding: 0.2em 1.2em;
        border-radius: 15px !important;
        cursor: pointer !important;
        background-color: $primary_color !important;
        color: #fff !important;

        &[disabled] {
          background-color: #ccc !important;
          cursor: not-allowed !important;
        }
      }
    }

    .vpc_period-control {
      margin-right: auto;

      .vpc_period-btn {
        @include text-center;
        margin: 0 10px;
        height: 1.3em;
        line-height: 1em;
        vertical-align: middle;
        padding: 0.2em 1.2em;
        border-radius: 15px !important;
        cursor: pointer !important;
        background-color: $primary_color !important;
        color: #fff !important;
      }
    }
  }

  #vpc_calendar {
    border-radius: 15px;
    box-shadow: 0 4px 25px 0 rgba(0, 0, 0, .1);

    #vpc_days-header {
      @include calendar-row;

      div {
        @include calendar-cell;
        color: $days_header_color;
        font-size: 0.9em;
        line-height: 0.6em;
        text-align: center;
        cursor: default;

        &:first-child {
          border-top-right-radius: 15px;
        }

        &:last-child {
          border-top-left-radius: 15px;
          border-left: $calendar_border;
        }
      }
    }

    .vpc_week {
      @include calendar-row;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .week_events {
        position: absolute;
        overflow: auto;
        overflow-x: hidden;
        height: calc(100% - 2em);
        width: 100%;
        top: 2em;

        /* width */
        &::-webkit-scrollbar {
          width: 5px;
        }

        /* Track */
        &::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        /* Handle */
        &::-webkit-scrollbar-thumb {
          background: #888;
        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .more_event_btn {
          z-index: 1;
          position: sticky !important;
          max-width: 9.5rem;
          padding: 8px 0 !important;
          border-radius: 0 !important;
        }
      }

      .vpc_day {
        @include calendar-cell;
        min-height: 120px;
        cursor: default;

        &.vpc_past {
          background-color: $past_background;

          .vpc_day-number {
            @include shadow-text;
            cursor: default;
          }
        }

        &.vpc_not-current-month {
          background-color: $not_current_month_background;

          .vpc_day-number {
            @include shadow-text;
          }
        }

        &.vpc_week-period-day {
          min-height: 600px;

          .vpc_day-number {
            font-size: 1.4em;
            text-align: center;
            width: auto !important;
          }
        }

        &.vpc_today {
          .vpc_day-number {
            line-height: 1.5em;
            width: 1.2em;
            height: 1.2em;
            padding: 0;
            margin-top: 0;
            margin-right: 0;
            border-radius: 9999px !important;
            background-color: $primary_color !important;
            color: #fff !important;
            text-align: center;
          }
        }

        &.vpc_day-disable {
          background-color: $not_current_month_background !important;
        }

        &.vpc_weekend {
          background-color: $not_current_month_background !important;
        }

        &.vpc_vacation {
          background-color: rgba(255, 0, 0, 0.1) !important;
        }

        .vpc_day-number {
          display: flex;
          flex-direction: row-reverse;
          justify-content: space-between;
          align-items: center;

          .vpc_vacations-description {
            font-size: 0.6rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }
        }

        &:last-child {
          border-left: $calendar_border;
        }
      }

      /* Events */
      .vpc_event {
        @include text-center;
        font-size: 0.7em;
        height: 1.2em;
        padding-left: 0.78em;
        border-color: #e0e0f0;
        border-radius: 0.5em;
        text-overflow: ellipsis;
        position: absolute;
        white-space: nowrap;
        overflow: hidden;
        background-color: #666;
        color: #fff;
        user-select: none;

        &:focus {
          box-shadow: none;
        }

        &.offset0 {
          right: 0;
        }

        $i: 1;
        @while $i <= 7 {
          &.span#{$i} {
            text-align: center;
            width: calc((#{$i+'00%'} / 7) - 0.75em);
          }
          &.offset#{$i} {
            right: calc((#{$i+'00%'} / 7));
          }
          $i: $i+1;
        }

        &.isHovered {
          filter: brightness(95%);
        }

        &.continued {
          border-right-style: none;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;

          &:not(.toBeContinued) {
            .vpc_event-end-time {
              display: block;
            }
          }

          &.span1 {
            .vpc_event-start-date {
              display: none;
            }
          }

          .vpc_event-start-date {
            display: block;
          }
        }

        &.toBeContinued {
          border-left-style: none;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;

          &:not(.continued) {
            .vpc_event-start-time {
              display: block;
            }
          }

          &.span1 {
            .vpc_event-end-date {
              display: none;
            }
          }

          .vpc_event-end-date {
            display: block;
          }
        }

        &.continued::before,
        &.toBeContinued::after {
          content: " \21e0 ";
          padding: 0 0.1em;
        }

        &:not(.continued):not(.toBeContinued) {
          .vpc_event-start-time,
          .vpc_event-end-time {
            display: block;
          }
        }

        &.oneDay {
          background-color: unset !important;
          color: #262626 !important;

          .vpc_event-title {
            justify-content: inherit;
            margin-right: 0;
            width: 100%;
          }

          .vpc_event-ball {
            width: 10px;
            height: 10px;
            margin: 0 0.1em;
            border-radius: 999px;
          }

          .vpc_event-end-time {
            display: none !important;
          }
        }

        .vpc_event-title {
          text-overflow: ellipsis;
          overflow: hidden;
          margin: 0 auto;
        }

        .vpc_event-start-time,
        .vpc_event-start-time span,
        .vpc_event-end-time,
        .vpc_event-start-date,
        .vpc_event-end-date {
          margin: 0 0.2em;
          display: none;
        }


        /* Event Times */

        & .startTime,
        & .endTime {
          font-weight: bold;
          color: #666;
        }
      }

      &.vpc_week-period {
        .vpc_event {
          height: 1.4em;

          &.oneDay {
            display: block;
            height: 2em;
            line-height: 1em;

            .vpc_event-ball {
              position: absolute;
              top: 0.1em;
            }

            .vpc_event-start-time span {
              display: contents;
            }

            .vpc_event-title {
              margin: 0 0.8em;
            }
          }
        }
      }

      &:last-child {
        .vpc_day {
          border-bottom: $calendar_border;
        }
      }
    }
  }

  .slide-left-enter-active, .slide-right-enter-active {
    transition: all .2s ease;
  }

  .slide-left-leave-active, .slide-right-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-left-enter, .slide-right-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }

  .slide-left-leave-to, .slide-right-enter {
    transform: translateX(-10px);
    opacity: 0;
  }

  .popover-show-event-details {
    width: 250px;

    .popover-body {
      .card-header-class {

        .event-title {
          font-size: 0.65rem;
          max-width: 75%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .event-action {
          .fa-pencil-square-o, .fa-trash-o {
            font-size: 1rem;
            margin: 0 0.2rem;
            cursor: pointer;
          }

          .fa-pencil-square-o:hover {
            color: #0093ee;
          }

          .fa-trash-o:hover {
            color: #f5365c;
          }
        }
      }

      .card-body-class , .card-footer-class {
        font-size: 0.7rem;
      }
    }
  }

  .popover-show-vacation-description{
    width: 150px;
  }
}

</style>