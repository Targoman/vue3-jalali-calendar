<template>
   <!-- <persian-calendar
      :events-list="events"
      :vacations-list="vacations"
      :disable-past-days="true"
      :display-period.sync="period"
      @on-day-click="showEventModal"
      @on-event-click="eventClick"
      @on-event-delete="removeEvent"
      @week-events="getEventsOfWeek"
    >
    </persian-calendar> -->
    <persian-calendar />
  vue Calendar
  <!-- <span>{{ $filter.moment(new Date(), "dddd, jMMMM jDo jYYYY") }}</span> -->
  <span>{{value}}</span>
</template>


<script setup>
import {getCurrentInstance} from 'vue';
import persianCalendar from './components/calendar.vue'


const {proxy} = getCurrentInstance()



 console.log(proxy.$filter)

const value = proxy.$filter.moment('1401/12/01', 'YYYY/MM/DD')
/*import persianCalendar from './components/calendar.vue'
export default {
  components:{
    persianCalendar
  },
  data () {
    return {
      period: 'month',
      min: this.$filter.moment('1401/12/01', 'jYYYY/jMM/jDD'),
      max: '1401/12/29',
      events: [
        {
          id: 1,
          startDateTime: this.$filter.moment('2023-03-06T13:37:41.020+00:00'),
          endDateTime: this.$filter.moment('2023-03-06T20:49:41.020+00:00'),
          title: 'رویداد شماره ۱',
          description: 'رویداد شماره ۱',
          type: {value: 'meeting', label: 'جلسه', color: '#29B6F6'},
          classes: ['asd', '123']
        },
        {
          id: 11,
          startDateTime: this.$filter.moment('1401/12/13 13:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$filter.moment('1401/12/14 15:30', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره 11',
          description: 'رویداد شماره 11',
          type: {value: 'meeting', label: 'جلسه', color: '#29B6F6'},
          classes: ['asd', '123']
        },
        {
          id: 12,
          startDateTime: this.$filter.moment('1401/12/19 08:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$filter.moment('1401/12/19 12:30', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره 12',
          description: 'رویداد شماره 12',
          type: {value: 'meeting', label: 'جلسه', color: '#29B6F6'},
          classes: ['asd', '123']
        },
        {
          id: 13,
          startDateTime: this.$filter.moment('1401/12/18 10:00', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$filter.moment('1401/12/19 11:30', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره 13',
          description: 'رویداد شماره 13',
          type: {value: 'hami', label: 'حامی', color: '#6256e5'},
          classes: ['asd', '123']
        },
        {
          id: 14,
          startDateTime: this.$filter.moment('2023-03-06T13:37:41.020+00:00'),
          endDateTime: this.$filter.moment('2023-03-06T20:49:41.020+00:00'),
          title: 'رویداد شماره 14',
          description: 'رویداد شماره 14',
          type: {value: 'personal', label: 'شخصی', color: '#f5365c'},
          classes: ['asd', '123']
        },
        {
          id: 15,
          startDateTime: this.$filter.moment('2023-03-06T13:37:41.020+00:00'),
          endDateTime: this.$filter.moment('2023-03-06T20:49:41.020+00:00'),
          title: 'رویداد شماره 15',
          description: 'رویداد شماره 15',
          type: {value: 'hami', label: 'حامی', color: '#6256e5'},
          classes: ['asd', '123']
        },
        {
          id: 16,
          startDateTime: this.$filter.moment('2023-03-06T13:37:41.020+00:00'),
          endDateTime: this.$filter.moment('2023-03-06T20:49:41.020+00:00'),
          title: 'رویداد شماره 16',
          description: 'رویداد شماره 16',
          type: {value: 'personal', label: 'شخصی', color: '#f5365c'},
          classes: ['asd', '123']
        },
        {
          id: 17,
          startDateTime: this.$filter.moment('2023-03-06T13:37:41.020+00:00'),
          endDateTime: this.$filter.moment('2023-03-06T20:49:41.020+00:00'),
          title: 'رویداد شماره 17',
          description: 'رویداد شماره 17',
          type: {value: 'personal', label: 'شخصی', color: '#f5365c'},
          classes: ['asd', '123']
        },
        {
          id: 2,
          startDateTime: this.$filter.moment('1401/12/01 10:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$filter.moment('1401/12/01 15:00', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره ۲',
          description: 'رویداد شماره ۲',
          type: {value: 'meeting', label: 'جلسه', color: '#29B6F6'},
          classes: []
        },
        {
          id: 7,
          startDateTime: this.$filter.moment('1401/12/1 23:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$filter.moment('1401/12/03 00:30', 'jYYYY/jMM/jDD HH:mm'),
          title: 'گفتگوی اسکایپی با مدیر شرکت آرمان',
          description: 'گفتگوی اسکایپی با مدیر شرکت آرمان',
          type: {value: 'personal', label: 'شخصی', color: '#f5365c'}
        },
        {
          id: 4,
          startDateTime: this.$filter.moment('1401/12/09 10:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$filter.moment('1401/12/13 14:00', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره ۳',
          description: 'رویداد شماره ۳',
          type: {value: 'personal', label: 'شخصی', color: '#f5365c'},
          classes: []
        },
        {
          id: 5,
          startDateTime: this.$filter.moment('1401/12/06 10:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$filter.moment('1401/12/08 18:35', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره ۴',
          description: 'رویداد شماره ۴',
          type: {value: 'meeting', label: 'جلسه', color: '#29B6F6'},
          classes: []
        },
        {
          id: 3,
          startDateTime: this.$filter.moment('1401/12/10', 'jYYYY/jMM/jDD'),
          endDateTime: this.$filter.moment('1401/12/25', 'jYYYY/jMM/jDD'),
          title: 'گفتگوی اسکایپی با مدیر شرکت آرمان',
          description: 'گفتگوی اسکایپی با مدیر شرکت آرمان',
          type: {value: 'hami', label: 'حامی', color: '#6256e5'},
          classes: []
        }
      ],
      vacations: [
        {
          id: 1,
          date: '2023-03-21',
          description: 'آغاز نوروز'
        },
        {
          id: 2,
          date: '2023-03-22',
          description: 'آغاز نوروز'
        },
        {
          id: 3,
          date: '2023-03-23',
          description: 'آغاز نوروز'
        },
        {
          id: 4,
          date: '2023-03-24',
          description: 'آغاز نوروز'
        },
        {
          id: 5,
          date: '2023-04-02',
          description: 'روز طبیعت'
        }
      ],

      showModalEvent: false,
      eventMode: 'add',
      event: {
        id: 0,
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        type: {value: 'personal', text: 'شخصی', color: '#f5365c'},
        classes: []
      },
      types: [
        {value: 'personal', text: 'شخصی', color: '#f5365c'},
        {value: 'meeting', text: 'جلسه', color: '#29B6F6'}
      ],

      showModalEventsOfWeek: false,
      eventsOfWeek: [],
      eventsFields: [
        {key: 'index', label: 'ردیف', thStyle: {width: `${5  }%`}},
        {key: 'title', label: 'رویداد', thStyle: {width: `${25  }%`}},
        {key: 'description', label: 'توضیحات', thStyle: {width: `${26  }%`}},
        {key: 'startDateTime', label: 'زمان شروع', thStyle: {width: `${12  }%`}},
        {key: 'endDateTime', label: 'زمان پایان', thStyle: {width: `${12  }%`}},
        {key: 'type', label: 'نوع', thStyle: {width: `${10  }%`}},
        {key: 'action', label: 'عملیات', thStyle: {width: `${10  }%`}}
      ]
    }
  },
  computed: {
    eventModalTitle () {
      return this.eventMode === 'edit' ? 'ویرایش رویداد' : 'رویداد جدید'
    },
    eventDataIsValid () {
      return (!this.event.title)
    }
  },
  methods: {
      changeEventType(value) {
          const modalHeader = document.querySelector('.event-modal-header-class')
          modalHeader.style.backgroundColor = this.types.filter((type) => type.value === value)[0].color
      },
    showEventModal (e) {
      this.showModalEvent = true

      if (this.eventMode === 'edit') {
        this.event.id = e.id
        this.event.title = e.title
        this.event.description = e.description
        this.event.startDateTime = this.$filter.moment(e.startDateTime).format('YYYY/MM/DD HH:mm')
        this.event.endDateTime = this.$filter.moment(e.endDateTime).format('YYYY/MM/DD HH:mm')
        this.event.type = this.types.filter((type) => type.value === e.type.value)[0]
        this.event.classes = e.classes
      } else {
        if (this.events.length !== 0) {
          this.event.id = Math.max(...this.events.map(event => event.id)) + 1
        }

        this.event.startDateTime = this.$filter.moment(e).format('YYYY/MM/DD HH:mm')
        this.event.endDateTime = this.$filter.moment(e).format('YYYY/MM/DD HH:mm')
        this.event.type = {value: 'personal', label: 'شخصی', color: '#f5365c'}
      }

      this.$nextTick(() => {
        const modalHeader = document.querySelector('.event-modal-header-class')
        modalHeader.style.backgroundColor = this.event.type.color
      })
    },
    addEvent () {
      const event = {
        id: this.event.id,
        title: this.event.title,
        description: this.event.description,
        startDateTime: this.$filter.moment(this.event.startDateTime, 'jYYYY/jMM/jDD HH:mm'),
        endDateTime: this.$filter.moment(this.event.endDateTime, 'jYYYY/jMM/jDD HH:mm'),
        type: this.event.type,
        classes: []
      }

      if (this.eventMode === 'edit') {
        this.events = this.events.map((e) => (e.id === event.id ? event : e))
        this.eventsOfWeek = this.eventsOfWeek.map((e) => (e.id === this.event.id ? event : e))

      } else {
        this.events.push(event)
      }
    },
    emptyFieldsOfEvent () {
      this.event = {
        id: 0,
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        type: {value: 'personal', label: 'شخصی', color: '#f5365c'},
        classes: []
      }
      this.eventMode = 'add'
    },
    removeEvent (event) {
      this.events = this.events.filter((ev) => ev.id !== event.id)
      this.eventsOfWeek = this.eventsOfWeek.filter(ev => ev.id !== event.id)
    },
    eventClick (e) {
      this.eventMode = 'edit'
      this.showEventModal(e)
    },
    getEventsOfWeek (weekEvents) {
      this.showModalEventsOfWeek = true
      this.eventsOfWeek = weekEvents
    }
  }
}*/
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
