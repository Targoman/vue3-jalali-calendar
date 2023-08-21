<template>
	<div id="persian-calendar">
		<!--CALENDAR HEADER-->
		<div id="vpc_header" slot="header">
			<div id="vpc_date-control">
				<div
					class="vpc_control-btn"
					@click="subtractPeriod"
					:disabled="isBeforeMin()"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</div>
				<span class="vpc_now-date" :style="isWeekPeriod ? '' : 'width: 80px'">
					{{ displayRangeText }}
				</span>

				<div class="vpc_control-btn" @click="addPeriod" :disabled="isAfterMax()">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
				</div>
				<div
					v-if="!disableToday"
					class="vpc_today-btn"
					:style="
						todayBtnDisable
							? 'background-color: #ccc !important;cursor: not-allowed !important  '
							: ''
					"
					@click="goToday"
				>
					امروز
				</div>
			</div>
			<div v-if="!disablePeriod" class="vpc_period-control">
				<button
					v-if="addEventButton"
					class="vpc_period-btn"
					style="font-size: 15px"
					@click="emitDay()"
				>
					رویداد جدید
				</button>
				<div class="vpc_period-btn" @click="togglePeriod">
					{{ period === "week" ? "ماه" : "هفته" }}
				</div>
			</div>
		</div>
		<!--CALENDAR GRID-->
		<transition :name="transitionAction" @after-leave="currentDateChange = true">
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
					<!-- {{ events }} -->
					<div
						v-for="week in period === 'week' ? [daysInWeek] : weeksInMonth()"
						:key="Math.random()"
						:class="weekClassObject"
					>
						<template v-for="(i, index) in getWeekEvents(week[0], week[6])">
							<slot :value="i">
								<div
									:key="index"
									:class="i.classes"
									:style="`top:${getEventTop(index + 1)};background-color:${i.color};`"
									class="vpc_event"
									@click="$emit('on-event-click', i)"
								>
									<div
										:style="{ 'background-color': i.color }"
										class="vpc_event-ball"
									></div>
									<span class="vpc_event-start-time" v-if="!hideEventTimes"
										>{{ i.startDateTime.format("HH:mm")
										}}<span> - {{ i.endDateTime.format("HH:mm") }} </span>
									</span>
									<span class="vpc_event-start-date" v-if="!hideEventTimes">{{
										i.startDateTime.format("jMM/jDD")
									}}</span>
									<span class="vpc_event-title">{{ i.title }}</span>

									<span class="vpc_event-end-time" v-if="!hideEventTimes">{{
										i.endDateTime.format("HH:mm")
									}}</span>
									<span class="vpc_event-end-date" v-if="!hideEventTimes">{{
										i.endDateTime.format("jMM/jDD")
									}}</span>
								</div>
							</slot>
						</template>
						<!--DAYS-->
						<div
							v-for="day in week"
							:key="Math.random()"
							:class="dayClassObject(day)"
							:id="`popover-show-vacation-description_${Math.random()}`"
							@click="emitDay(day, $event)"
						>
							<div class="vpc_day-number">
								<div>{{ moment(day).format("D") }}</div>
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

<script setup lang="ts">
import { computed, ref, onMounted, watch, Ref } from "vue";
import moment, { Moment } from "jalali-moment";

const getTodayInJalali = () => moment().locale("fa").format(jalaliFormat);
const jalaliFormat = "jYYYY-jM-jD";
const currentDate = ref(getTodayInJalali());
const currentStartDate = ref();
const currentEndDate = ref();
const currentDateChange = ref(true);
const transitionAction = ref("slide-right");
const period = ref("week");
const events = ref([]);
const min: Ref<string | null> = ref(null);
const max: Ref<string | null> = ref(null);
const props = defineProps({
	dateFormat: {
		type: String,
		default: "jYYYYDD",
	},
	showDate: {
		type: [Object, String],
		default: new Date(),
	},
	eventsList: {
		type: Array,
		default: [],
	},
	vacationsList: {
		type: Array,
		default: [],
	},
	minDate: [Object, String],
	maxDate: [Object, String],
	hideEventTimes: {
		type: Boolean,
		default: false,
	},
	disableToday: {
		type: Boolean,
		default: false,
	},
	disablePeriod: {
		type: Boolean,
		default: false,
	},
	hideMonthShadow: {
		type: Boolean,
		default: false,
	},
	hidePastDaysShadow: {
		type: Boolean,
		default: false,
	},
	disablePastDays: {
		type: Boolean,
		default: false,
	},
	addEventButton: Boolean,
});

const month = computed({
	get() {
		return moment(currentDate.value).format("M");
	},
	set(value) {
		currentDate.value = value;
	},
});
const year = computed({
	get() {
		return moment(currentDate.value).format("YYYY");
	},
	set(value) {
		currentDate.value = value;
	},
});
const daysInMonth = computed(() => {
	// Generating all days in current month
	const days = [];
	let currentDay = moment(`${year.value}-${month.value}-1`, jalaliFormat).locale(
		"fa"
	);

	do {
		days.push(currentDay);
		currentDay = moment(currentDay).add(1, "days");
	} while (moment(currentDay).format("M") === month.value);
	// Add previous days to start
	currentDay = moment(days[0]);
	const isSaturday = 0;
	const isFriday = 6;
	if (currentDay.jDay() !== isSaturday) {
		do {
			currentDay = moment(currentDay).subtract(1, "days");
			days.unshift(currentDay);
		} while (currentDay.jDay() !== isSaturday);
	}
	// Add following days to end
	currentDay = moment(days[days.length - 1]);
	if (currentDay.jDay() !== isFriday) {
		do {
			currentDay = moment(currentDay).add(1, "days");
			days.push(currentDay);
		} while (currentDay.jDay() !== isFriday);
	}

	return days;
});
const emit = defineEmits([
	"startAndEndOfWeekPeriod",
	"startAndEndOfMonthPeriod",
	"on-page-add",
	"on-page-subtract",
	"on-display-period",
	"dayClick",
]);
const daysInWeek = computed(() => {
	const c = currentStartDate;
	const days = [c.value.format(jalaliFormat)];
	for (let step = 1; step <= 6; step++) {
		days[step] = c.value.add(1, "day").format(jalaliFormat);
	}
	return days;
});

const weeksInMonth = () => {
	const weeks = [];
	let week = [];
	for (let i = 0; i < daysInMonth.value.length; i++) {
		week.push(daysInMonth.value[i]);
		if (week.length === 7) {
			weeks.push(week);
			week = [];
		}
	}
	return weeks;
};

const isWeekPeriod = computed(() => {
	return period.value === "week";
});

const displayRangeText = computed(() => {
	currentStartDate.value = moment(currentDate.value, jalaliFormat)
		.locale("fa")
		.startOf(isWeekPeriod.value ? "week" : "month");
	currentEndDate.value = moment(currentDate.value, jalaliFormat)
		.locale("fa")
		.endOf(isWeekPeriod.value ? "week" : "month");
	let startformat = "DD";
	if (!currentStartDate.value.isSame(currentEndDate.value, "month"))
		startformat = "DD MMMM";
	if (!currentStartDate.value.isSame(currentEndDate.value, "year"))
		startformat = "DD MMMM YYYY";
	if (isWeekPeriod.value)
		return `${currentStartDate.value.format(
			startformat
		)} - ${currentEndDate.value.format("DD MMMM YYYY")}`;
	else
		return moment(currentDate.value, jalaliFormat)
			.locale("fa")
			.format("MMMM YYYY");
});
const todayBtnDisable = ref(true);

const weekClassObject = computed(() => {
	return {
		vpc_week: true,
		"vpc_week-period": isWeekPeriod.value,
	};
});

watch(currentDate, () => (currentDateChange.value = false));
watch(
	() => props.showDate,
	(value) => (currentDate.value = getDateByFormat(value) as string)
);
watch(props.eventsList, (value) => (events.value = value as any));
watch(
	() => props.minDate,
	(value) => getDateByFormat(value)
);
watch(
	() => props.maxDate,
	(value) => getDateByFormat(value)
);

onMounted(() => {
	watch([currentStartDate, period], () => {
		todayBtnDisable.value = moment()
			.locale("fa")
			.isBetween(
				moment(currentStartDate.value.format(jalaliFormat), jalaliFormat),
				moment(currentEndDate.value.format(jalaliFormat), jalaliFormat)
			);
	});
	currentDate.value = getDateByFormat(props.showDate) as string;
	if (props.minDate) min.value = getDateByFormat(props.minDate) as string;
	if (props.maxDate) max.value = getDateByFormat(props.maxDate) as string;
	events.value = props.eventsList as any;
});

function getDateByFormat(value: any) {
	try {
		if (typeof value === "string") return moment(value).format(jalaliFormat);
		else if (typeof value === "object") return moment(value).format(jalaliFormat);
	} catch (error) {
		throw new TypeError(
			"[VuePersianCalendar Error]: showDate property value is not valid"
		);
	}
}
function isAfterMax() {
	if (!max.value) return;
	const newDate = moment(currentDate.value).add(
		1,
		isWeekPeriod.value ? "weeks" : "months"
	); //@ts-ignore
	const periodStart = newDate.startOf(isWeekPeriod.value ? "jWeek" : "jMonth"); //@ts-ignore
	return max.value.isValid() && periodStart.isAfter(max.value);
}
function isBeforeMin() {
	if (!min.value) return;
	const newDate = moment(currentDate.value).subtract(
		1,
		isWeekPeriod.value ? "weeks" : "months"
	); //@ts-ignore
	const periodEnd = moment(min.value).startOf(
		isWeekPeriod.value ? "jWeek" : ("jMonth" as any)
	); //@ts-ignore
	return min.value.isValid() && periodEnd.isAfter(newDate);
}
function addPeriod() {
	if (isAfterMax()) return;
	transitionAction.value = "slide-left";
	currentDate.value = moment(currentDate.value, jalaliFormat)
		.add(1, isWeekPeriod.value ? "week" : "jmonth")
		.format(jalaliFormat);
	emit("on-page-add", currentDate.value);
}
function subtractPeriod() {
	if (isBeforeMin()) return;
	transitionAction.value = "slide-right";
	currentDate.value = moment(currentDate.value, jalaliFormat)
		.subtract(1, isWeekPeriod.value ? "week" : "jmonth")
		.format(jalaliFormat);
	emit("on-page-subtract", currentDate.value);
}

function goToday() {
	const today = moment(currentDate.value, jalaliFormat);
	if (todayBtnDisable.value) return;
	//@ts-ignore
	if (
		today.isBefore(moment(), "month") ||
		(isWeekPeriod.value && today.isBefore(moment().startOf("jWeek" as "week")))
	) {
		transitionAction.value = "slide-left";
		currentDate.value = getTodayInJalali();
	} else if (
		today.isAfter(moment(), "month") ||
		(isWeekPeriod.value && today.isAfter(moment(), "week"))
	) {
		transitionAction.value = "slide-right";
		currentDate.value = getTodayInJalali();
	}
}

function togglePeriod() {
	period.value = isWeekPeriod.value ? "month" : "week";
	// update transition
	currentDateChange.value = false;
}
function miladiDate(day: string | Moment) {
	return moment(day, jalaliFormat).locale("en").format("YYYY-MM-DD");
}
function descriptionOfVacationDay(day: string | Moment) {
	//@ts-ignore
	const vacationDetails = props.vacationsList.find((e: any) => {
		return (
			e.date.format(jalaliFormat) ===
			moment(day, jalaliFormat).format(jalaliFormat)
		);
		// return e.date === miladiDate(day);
	});
	//@ts-ignore
	return vacationDetails ? vacationDetails.title : "";
}
function isInCurrentMonth(day: Moment) {
	const incomingDay = day.clone();
	return !moment(currentDate.value, jalaliFormat).isBetween(
		moment(incomingDay.startOf("month").format(jalaliFormat), jalaliFormat),
		moment(incomingDay.endOf("month").format(jalaliFormat), jalaliFormat)
	);
}
function dayClassObject(day: string | Moment) {
	if (typeof day === "string") day = moment(day, jalaliFormat);

	const today = day.format(jalaliFormat) === getTodayInJalali(); //@ts-ignore

	// console.log({ day });

	const dayIsVacation = props.vacationsList.some(
		(e: any) => e.date === miladiDate(day)
	);
	let disable = false;
	if (min) {
		disable = (min.value && day.isBefore(min.value, "day")) || disable;
	}
	if (max) {
		disable = (max.value && day.isAfter(max.value, "day")) || disable;
	}

	return {
		vpc_day: true,
		vpc_today: today && !props.disableToday,
		vpc_past:
			props.disablePastDays &&
			day.isBefore(moment(getTodayInJalali(), jalaliFormat)),
		"vpc_not-current-month": !isWeekPeriod.value && isInCurrentMonth(day),
		"vpc_week-period-day": isWeekPeriod.value,
		"vpc_day-disable": disable,
		// vpc_weekend: isFriday,
		vpc_vacation: dayIsVacation,
	};
}

function eventComparer(a: any, b: any) {
	if (a.startDateTime.isBefore(b.startDateTime)) return -1;
	if (b.startDateTime.isBefore(a.startDateTime)) return 1;
	if (a.endDateTime.isAfter(b.endDateTime)) return -1;
	if (b.endDateTime.isAfter(a.endDateTime)) return 1;
	return a.id < b.id ? -1 : 1;
}

function findAndSortEventsInDateRange(startDateTime: any, endDateTime: any) {
	// Return a list of events that INCLUDE any day within the date range,
	// inclusive, sorted so events that start earlier are returned first.
	return props.eventsList
		.filter(
			(event: any) =>
				event.endDateTime.isSameOrAfter(startDateTime) &&
				event.startDateTime.isSameOrBefore(endDateTime)
		)
		.sort(eventComparer);
}
function getWeekEvents(weekS: string, weekE: string) {
	const weekEnd =
		typeof weekE === "string" ? moment(weekE, jalaliFormat) : weekE;
	const weekStart =
		typeof weekS === "string" ? moment(weekS, jalaliFormat) : weekS;
	// Return a list of events that CONTAIN the week starting on a day.
	// Sorted so the events that start earlier are always shown first.
	const events = findAndSortEventsInDateRange(weekStart, weekEnd) as any;
	const results = [];
	const eventRows = [[], [], [], [], [], [], []];
	for (let i = 0; i < events.length; i++) {
		const ep = Object.assign({}, events[i], {
			classes: events[i].classes ? [...events[i].classes] : [],
			eventRow: 0,
		}) as any;
		const continued = ep.startDateTime.isBefore(weekStart);
		const startOffset = continued ? 0 : diff(ep.startDateTime, weekStart);
		const spanContinued = continued
			? diff(ep.endDateTime, weekStart) + 1
			: diff(ep.endDateTime, ep.startDateTime) + 1;
		const span = Math.min(7 - startOffset, spanContinued);

		if (continued) ep.classes.push("continued");
		if (diff(ep.endDateTime, weekStart) > 6) ep.classes.push("toBeContinued");
		if (ep.endDateTime.isBefore(moment(getTodayInJalali(), jalaliFormat)))
			ep.classes.push("past");

		if (
			ep.endDateTime.isBetween(
				moment(ep.startDateTime),
				moment(ep.startDateTime).endOf("day"),
				undefined,
				"[]"
			)
		)
			ep.classes.push("oneDay");
		for (let d = 0; d < 7; d++) {
			if (d === startOffset) {
				let s = 0; //@ts-ignore
				while (eventRows[d][s]) s++;
				ep.eventRow = s; //@ts-ignore
				eventRows[d][s] = true;
			} else if (d < startOffset + span) {
				//@ts-ignore
				eventRows[d][ep.eventRow] = true;
			}
		}
		ep.classes.push(`offset${startOffset}`);
		ep.classes.push(`span${span}`);
		results.push(ep);
	}
	return results;
}
function getEventTop(e: number) {
	// Compute the top position of the event based on its assigned row within the given week.
	const r = e + 1;
	const h = isWeekPeriod.value ? "2.6em" : "1.3em";
	const b = "2px";
	return `calc( 0em + ${r}*${h} + ${r}*${b})`;
}
function diff(e: string | Moment, s: string | Moment) {
	const start = moment(s).locale("fa");
	const end = moment(e).locale("fa");
	const add_diff = start
			.clone()
			.startOf("day")
			.add(end.diff(start, "m"), "m")
			.locale("fa"),
		diff = end.diff(start, "day");

	if (add_diff.isBefore(end, "day")) return diff + 1;
	return diff;
}

function emitDay(day?: string, event?: any) {
	emit("dayClick", { day, event });
}
</script>

<style lang="scss">
/** Extra small devices (phones, 600px and down) */
$xs: "screen and (max-width: 600px)";
/** Small devices (portrait tablets and large phones, 601px to 768px) */
$sm: "screen and (min-width: 601px) and (max-width: 768px)";
/** Medium devices (landscape tablets, 769px to 991px) */
$md: "screen and (min-width: 769px) and (max-width: 991px)";
/** Large devices (laptops/desktops, 992px to 1200px) */
$lg: "screen and (min-width: 992px) and (max-width: 1200px)";
/** Extra large devices (large laptops and desktops, 1201px and up) */
$xl: "screen and (min-width: 1201px)";
// The media mixin
@mixin media($selectors...) {
	$selector: "";
	@each $s in $selectors {
		@if $selector == "" {
			$selector: $s;
		} @else {
			$selector: $selector + ", " + $s;
		}
	}
	@media #{unquote($selector)} {
		@content;
	}
}

$primary_color: #7367f0;
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
				margin: auto 0.75em;
				white-space: nowrap;
				width: 215px;
				text-align: center;
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
			}
		}

		.vpc_period-control {
			margin-right: auto;
			display: flex;
			justify-content: space-between;

			.vpc_period-btn {
				@include text-center;
				margin: 0 10px;
				height: 1.3em;
				line-height: 1em;
				vertical-align: middle;
				padding: 0.2em 1.2em;
				border-radius: 15px !important;
				border: 0;
				cursor: pointer !important;
				background-color: $primary_color !important;
				color: #fff !important;
			}
		}
	}

	#vpc_calendar {
		border-radius: 15px;
		box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);

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
				cursor: pointer;

				&:hover {
					background-color: darken($background, 10%);
				}

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
						justify-content: center;
						font-size: 1.4em;
						text-align: center;
						width: auto !important;
					}
				}

				&.vpc_today {
					.vpc_day-number {
						line-height: 1.5em;
						height: 1.2em;
						padding: 0;
						border-radius: 9999px !important;
						background-color: #019183 !important;
						color: #fff !important;
						justify-content: center;
						text-align: center;
						width: auto !important;
						margin: 3px;
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
				height: 1.3em;
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

				&:hover {
					opacity: 80%;
					cursor: pointer;
				}
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
						width: calc((#{$i+"00%"} / 7) - 0.75em);
					}
					&.offset#{$i} {
						right: calc((#{$i+"00%"} / 7));
					}
					$i: $i + 1;
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

	.slide-left-enter-active,
	.slide-right-enter-active {
		transition: all 0.2s ease;
	}

	.slide-left-leave-active,
	.slide-right-leave-active {
		transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.slide-left-enter,
	.slide-right-leave-to {
		transform: translateX(10px);
		opacity: 0;
	}

	.slide-left-leave-to,
	.slide-right-enter {
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
					.fa-pencil-square-o,
					.fa-trash-o {
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

			.card-body-class,
			.card-footer-class {
				font-size: 0.7rem;
			}
		}
	}

	.popover-show-vacation-description {
		width: 150px;
	}
}
</style>
