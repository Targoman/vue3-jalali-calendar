<template>
  <div id="app">
    <persian-calendar
      :events-list="events"
      :vacations-list="vacations"
      :disable-past-days="true"
      :display-period.sync="period"
      @on-day-click="showEventModal"
      @on-event-click="eventClick"
      @on-event-delete="removeEvent"
      @week-events="getEventsOfWeek"
    >
    </persian-calendar>

      <!-- modal of event-->
      <b-modal v-model="showModalEvent"
               size="sm"
               no-close-on-backdrop
               :title="eventModalTitle"
               cancel-title="انصراف"
               ok-title="ثبت"
               button-size="sm"
               @ok="addEvent"
               @cancel="emptyFieldsOfEvent"
               @hidden="emptyFieldsOfEvent"
               modal-class="event-modal-class"
               dialog-class="event-modal-dialog-class"
               content-class="event-modal-content-class"
               header-class="event-modal-header-class"
               body-class="event-modal-body-class"
               footer-class="event-modal-footer-class"
      >
          <div dir="rtl" class="text-right">
              <b-form-group
                  label="عنوان رویداد"
                  label-for="event-title"
              >
                  <b-form-input
                      id="event-title"
                      v-model="event.title"
                      placeholder="عنوان رویداد ..."
                      size="sm"
                  ></b-form-input>
              </b-form-group>

              <b-form-group
                  label="توضیحات رویداد"
                  label-for="event-description"
              >
                  <b-textarea
                      id="event-description"
                      v-model="event.description"
                      rows="3"
                      placeholder="توضیحات رویداد ..."
                      size="sm"
                  ></b-textarea>
              </b-form-group>

              <b-form-group>
                  <label>زمان شروع رویداد</label>
                  <div class="d-flex">
                      <vue-date-picker
                          type="datetime"
                          compact-time
                          :jump-minute="15"
                          v-model="event.startDateTime"
                          format="jYYYY/jMM/jDD HH:mm"
                          display-format="jYYYY/jMM/jDD HH:mm"
                          placeholder="انتخاب زمان شروع رویداد ..."
                          class="col-12 px-0"
                      />
                  </div>
              </b-form-group>

              <b-form-group>
                  <label>زمان پایان رویداد</label>
                  <div class="d-flex">
                      <vue-date-picker
                          type="datetime"
                          compact-time
                          :jump-minute="15"
                          v-model="event.endDateTime"
                          format="jYYYY/jMM/jDD HH:mm"
                          display-format="jYYYY/jMM/jDD HH:mm"
                          placeholder="انتخاب زمان پایان رویداد ..."
                          class="col-12 px-0"
                      />
                  </div>
              </b-form-group>

              <b-form-group
                  label="نوع رویداد"
                  label-for="event-type"
              >
                  <b-form-select id="event-type"
                               v-model="event.type.value"
                               placeholder="نوع رویداد را انتخاب کنید"
                               :options="types"
                               @change="changeEventType"
                  ></b-form-select>
              </b-form-group>
          </div>

          <!-- footer -->
          <template #modal-footer="{ ok, cancel }">
              <b-button size="sm" @click="cancel()">
                  انصراف
              </b-button>
              <b-button size="sm" variant="primary" :disabled="eventDataIsValid" @click="ok()">
                  ثبت
              </b-button>
          </template>
      </b-modal>

      <!-- modal of all events of week -->
      <b-modal v-model="showModalEventsOfWeek"
               no-close-on-backdrop
               size="xl"
               title="رویدادهای هفته"
               hide-footer
               modal-class="week-events-modal-class"
               dialog-class="week-events-modal-dialog-class"
               content-class="week-events-modal-content-class"
               header-class="week-events-modal-header-class"
               body-class="week-events-modal-body-class"
               footer-class="week-events-modal-footer-class"
      >
          <b-table striped hover :items="eventsOfWeek" :fields="eventsFields" table-class="week-events-table-class">
              <!-- index of event -->
              <template #cell(index)="data">
                  {{ data.index + 1 }}
              </template>

              <!-- event title -->
              <template #cell(title)="data">
                  <div class="event-title"> {{ data.item.title }} </div>
              </template>

              <!-- event description -->
              <template #cell(description)="data">
                  <div class="event-description"> {{ data.item.description }} </div>
              </template>

              <!-- startDateTime-->
              <template #cell(startDateTime)="data" dir="ltr">
                    <span class="event-start-date-time" dir="ltr">
                        {{ data.item.startDateTime | moment('YYYY/MM/DD - HH:mm') }}
                    </span>
              </template>

              <!-- endDateTime-->
              <template #cell(endDateTime)="data">
                    <span class="event-end-date-time" dir="ltr">
                        {{ data.item.endDateTime | moment('YYYY/MM/DD - HH:mm') }}
                    </span>
              </template>

              <!-- event type -->
              <template #cell(type)="data">
                  <div class="d-flex align-items-center">
                        <span class="d-block ml-2"
                              :style="`background-color: ${data.item.type.color}; width: 7px; height: 7px; border-radius: 50%`"
                        ></span>
                      {{ data.item.type.label }}
                  </div>
              </template>

              <!-- event actions -->
              <template #cell(action)="data">
                  <div class="event-actions" v-if="data.item.type.value !== 'hami'">
                        <span class="icon-Edit-outline ml-2" title="ویرایش رویداد"
                              @click="eventClick(data.item)"></span>
                      <span class="icon-Remove-outline" title="حذف رویداد" @click="removeEvent(data.item)"></span>
                  </div>
              </template>
          </b-table>
      </b-modal>
  </div>
</template>

<script>
import PersianCalendar from './PersianCalendar.vue'

export default {
  components:{
    PersianCalendar
  },
  data () {
    return {
      period: 'month',
      min: this.$moment('1401/12/01', 'jYYYY/jMM/jDD'),
      max: '1401/12/29',
      events: [
        {
          id: 1,
          startDateTime: this.$moment('2023-03-06T13:37:41.020+00:00'),
          endDateTime: this.$moment('2023-03-06T20:49:41.020+00:00'),
          title: 'رویداد شماره ۱',
          description: 'رویداد شماره ۱',
          type: {value: 'meeting', label: 'جلسه', color: '#29B6F6'},
          classes: ['asd', '123']
        },
        {
          id: 11,
          startDateTime: this.$moment('1401/12/13 13:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$moment('1401/12/14 15:30', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره 11',
          description: 'رویداد شماره 11',
          type: {value: 'meeting', label: 'جلسه', color: '#29B6F6'},
          classes: ['asd', '123']
        },
        {
          id: 12,
          startDateTime: this.$moment('1401/12/19 08:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$moment('1401/12/19 12:30', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره 12',
          description: 'رویداد شماره 12',
          type: {value: 'meeting', label: 'جلسه', color: '#29B6F6'},
          classes: ['asd', '123']
        },
        {
          id: 13,
          startDateTime: this.$moment('1401/12/18 10:00', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$moment('1401/12/19 11:30', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره 13',
          description: 'رویداد شماره 13',
          type: {value: 'hami', label: 'حامی', color: '#6256e5'},
          classes: ['asd', '123']
        },
        {
          id: 14,
          startDateTime: this.$moment('2023-03-06T13:37:41.020+00:00'),
          endDateTime: this.$moment('2023-03-06T20:49:41.020+00:00'),
          title: 'رویداد شماره 14',
          description: 'رویداد شماره 14',
          type: {value: 'personal', label: 'شخصی', color: '#f5365c'},
          classes: ['asd', '123']
        },
        {
          id: 15,
          startDateTime: this.$moment('2023-03-06T13:37:41.020+00:00'),
          endDateTime: this.$moment('2023-03-06T20:49:41.020+00:00'),
          title: 'رویداد شماره 15',
          description: 'رویداد شماره 15',
          type: {value: 'hami', label: 'حامی', color: '#6256e5'},
          classes: ['asd', '123']
        },
        {
          id: 16,
          startDateTime: this.$moment('2023-03-06T13:37:41.020+00:00'),
          endDateTime: this.$moment('2023-03-06T20:49:41.020+00:00'),
          title: 'رویداد شماره 16',
          description: 'رویداد شماره 16',
          type: {value: 'personal', label: 'شخصی', color: '#f5365c'},
          classes: ['asd', '123']
        },
        {
          id: 17,
          startDateTime: this.$moment('2023-03-06T13:37:41.020+00:00'),
          endDateTime: this.$moment('2023-03-06T20:49:41.020+00:00'),
          title: 'رویداد شماره 17',
          description: 'رویداد شماره 17',
          type: {value: 'personal', label: 'شخصی', color: '#f5365c'},
          classes: ['asd', '123']
        },
        {
          id: 2,
          startDateTime: this.$moment('1401/12/01 10:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$moment('1401/12/01 15:00', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره ۲',
          description: 'رویداد شماره ۲',
          type: {value: 'meeting', label: 'جلسه', color: '#29B6F6'},
          classes: []
        },
        {
          id: 7,
          startDateTime: this.$moment('1401/12/1 23:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$moment('1401/12/03 00:30', 'jYYYY/jMM/jDD HH:mm'),
          title: 'گفتگوی اسکایپی با مدیر شرکت آرمان',
          description: 'گفتگوی اسکایپی با مدیر شرکت آرمان',
          type: {value: 'personal', label: 'شخصی', color: '#f5365c'}
        },
        {
          id: 4,
          startDateTime: this.$moment('1401/12/09 10:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$moment('1401/12/13 14:00', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره ۳',
          description: 'رویداد شماره ۳',
          type: {value: 'personal', label: 'شخصی', color: '#f5365c'},
          classes: []
        },
        {
          id: 5,
          startDateTime: this.$moment('1401/12/06 10:30', 'jYYYY/jMM/jDD HH:mm'),
          endDateTime: this.$moment('1401/12/08 18:35', 'jYYYY/jMM/jDD HH:mm'),
          title: 'رویداد شماره ۴',
          description: 'رویداد شماره ۴',
          type: {value: 'meeting', label: 'جلسه', color: '#29B6F6'},
          classes: []
        },
        {
          id: 3,
          startDateTime: this.$moment('1401/12/10', 'jYYYY/jMM/jDD'),
          endDateTime: this.$moment('1401/12/25', 'jYYYY/jMM/jDD'),
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
        this.event.startDateTime = this.$moment(e.startDateTime).format('YYYY/MM/DD HH:mm')
        this.event.endDateTime = this.$moment(e.endDateTime).format('YYYY/MM/DD HH:mm')
        this.event.type = this.types.filter((type) => type.value === e.type.value)[0]
        this.event.classes = e.classes
      } else {
        if (this.events.length !== 0) {
          // this.event.id = _.maxBy(this.events, 'id').id + 1
        }

        this.event.startDateTime = this.$moment(e).format('YYYY/MM/DD HH:mm')
        this.event.endDateTime = this.$moment(e).format('YYYY/MM/DD HH:mm')
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
        startDateTime: this.$moment(this.event.startDateTime, 'jYYYY/jMM/jDD HH:mm'),
        endDateTime: this.$moment(this.event.endDateTime, 'jYYYY/jMM/jDD HH:mm'),
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
}
</script>

<style lang="scss">
@font-face {
  font-family: Vazir;
  src: url('~vazir-font/dist/Vazir-Medium.eot');
  src: url('~vazir-font/dist/Vazir-Medium.eot?#iefix') format('embedded-opentype'),
  url('~vazir-font/dist/Vazir-Medium.woff2') format('woff2'),
  url('~vazir-font/dist/Vazir-Medium.woff') format('woff'),
  url('~vazir-font/dist/Vazir-Medium.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: Vazir;
  src: url('~vazir-font/dist/Vazir-Bold.eot');
  src: url('~vazir-font/dist/Vazir-Bold.eot?#iefix') format('embedded-opentype'),
  url('~vazir-font/dist/Vazir-Bold.woff2') format('woff2'),
  url('~vazir-font/dist/Vazir-Bold.woff') format('woff'),
  url('~vazir-font/dist/Vazir-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}

#app {
  font-family: Vazir,serif;
  padding: 30px;
}

* {
  font-family: Vazir, serif;
}
</style>

<style lang="scss">
.event-modal-class {
    .modal-sm {
        max-width: 400px;
    }

    .event-modal-dialog-class {
        top: 10% !important;

        .event-modal-content-class {
            direction: rtl;
            .event-modal-header-class {
              direction: rtl;
              .close {
                padding: 0;
                margin: 0;
              }
            }
            .event-modal-body-class {
                .form-group {
                    label {
                        margin-bottom: 0;
                        font-size: 0.75rem;
                    }

                    .form-control {
                        font-size: 0.75rem;
                    }

                    .multiselect {
                        .multiselect__input,
                        .multiselect__single,
                        .multiselect__content {
                            font-size: 0.75rem;
                        }
                    }
                }

                .vpd-main {
                    .vpd-input-group input {
                        height: 2.3rem;

                        &::placeholder {
                            font-size: 0.7rem;
                        }
                    }
                }
                input.form-control {
                    height: 2.3rem;
                }

                .event-start-hour, .event-end-hour {
                    border-right: 1px solid #dadada;
                    border-radius: 0.25rem;

                    &::placeholder {
                        font-size: 0.7rem;
                    }

                    .vpd-input-group input {
                        border-top-right-radius: 0.25rem;
                        border-bottom-right-radius: 0.25rem;
                    }

                    label {
                        display: none;
                    }
                }
            }

            .event-modal-footer-class {
                padding-top: 0;
                border-top: none;

                button {
                    width: 70px;
                }
            }
        }
    }
}

.week-events-modal-class {
    .week-events-table-class {
        tr {
            .event-actions {
                transition: .4s;
                opacity: 0;

                .icon-Edit-outline {
                    cursor: pointer;
                    font-size: 0.9rem;

                    &:hover {
                        color: #6256e5;
                    }
                }

                .icon-Remove-outline {
                    cursor: pointer;
                    font-size: 0.9rem;

                    &:hover {
                        color: #f5365c;
                    }
                }
            }

            &:hover {
                .event-actions {
                    opacity: 1;
                }
            }

            td {
                font-size: 0.7rem;

                .event-title {
                    max-width: 230px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

                    @media (max-width: 1500px) {
                        max-width: 220px;
                    }
                    @media (max-width: 1200px) {
                        max-width: 150px;
                    }
                    @media (max-width: 992px) {
                        max-width: 130px;
                    }
                }
                .event-description {
                    max-width: 250px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

                    @media (max-width: 1500px) {
                        max-width: 220px;
                    }
                    @media (max-width: 1200px) {
                        max-width: 170px;
                    }
                    @media (max-width: 992px) {
                        max-width: 160px;
                    }
                }
                .event-start-date-time,
                .event-end-date-time {
                    font-size: 0.6rem;
                }
            }
        }
    }
}
</style>