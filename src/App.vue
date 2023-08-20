<template>
	<jalaliCalendar
		:eventsList="events"
		:vacationsList="vacations"
		:disable-past-days="true"
		@dayClick="showEventModal"
		@on-event-click="showEventModal"
	/>
</template>

<script setup lang="ts">
import { ref } from "vue";
import jalaliCalendar from "./components/jalaliCalendar.vue";
import moment from "jalali-moment";

const showEventModal = (e: any) => (console.log(e), alert("check your log"));
const events = ref([
	{
		id: 1,
		startDateTime: moment("2023-03-06T13:37:41.020+00:00"),
		endDateTime: moment("2023-03-06T20:49:41.020+00:00"),
		title: "رویداد شماره ۱",
		color: "#29B6F6",
	},
	{
		id: 11,
		startDateTime: moment("1401/12/13 13:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1401/12/14 15:30", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره 11",
		color: "#29B6F6",
	},
	{
		id: 12,
		startDateTime: moment("1402/5/15 08:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1402/5/30 12:30", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره 12",
		color: "#29B6F6",
	},
	{
		id: 13,
		startDateTime: moment("1402/05/24 10:00", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1402/05/28 11:30", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره 13",
		color: "#6256e5",
	},
	{
		id: 14,
		startDateTime: moment("2023-03-06T13:37:41.020+00:00"),
		endDateTime: moment("2023-03-06T20:49:41.020+00:00"),
		title: "رویداد شماره 14",
		color: "#f5365c",
	},
	{
		id: 15,
		startDateTime: moment("2023-03-06T13:37:41.020+00:00"),
		endDateTime: moment("2023-03-06T20:49:41.020+00:00"),
		title: "رویداد شماره 15",
		color: "#6256e5",
	},
	{
		id: 16,
		startDateTime: moment("2023-03-06T13:37:41.020+00:00"),
		endDateTime: moment("2023-03-06T20:49:41.020+00:00"),
		title: "رویداد شماره 16",
		color: "#f5365c",
	},
	{
		id: 17,
		startDateTime: moment("2023-03-06T13:37:41.020+00:00"),
		endDateTime: moment("2023-03-06T20:49:41.020+00:00"),
		title: "رویداد شماره 17",
		color: "#f5365c",
	},
	{
		id: 2,
		startDateTime: moment("1402/05/23 10:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1402/05/23 15:00", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره ۲",
		color: "#29B6F6",
		classes: [],
	},
	{
		id: 7,
		startDateTime: moment("1401/12/1 23:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1401/12/03 00:30", "jYYYY/jMM/jDD HH:mm"),
		title: "گفتگوی اسکایپی با مدیر شرکت آرمان",
		color: "#f5365c",
	},
	{
		id: 4,
		startDateTime: moment("1401/12/09 10:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1401/12/13 14:00", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره ۳",
		color: "#f5365c",
		classes: [],
	},
	{
		id: 5,
		startDateTime: moment("1401/12/06 10:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1401/12/08 18:35", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره ۴",
		color: "#29B6F6",
		classes: [],
	},
	{
		id: 3,
		startDateTime: moment("1401/12/10", "jYYYY/jMM/jDD"),
		endDateTime: moment("1403/12/25", "jYYYY/jMM/jDD"),
		title: "گفتگوی اسکایپی با مدیر شرکت آرمان",
		color: "#6256e5",
		classes: [],
	},
]);
const vacations = ref([
	{
		id: 1,
		date: "2023-03-21",
		description: "آغاز نوروز",
	},
	{
		id: 2,
		date: "2023-03-22",
		description: "آغاز نوروز",
	},
	{
		id: 3,
		date: "2023-03-23",
		description: "آغاز نوروز",
	},
	{
		id: 4,
		date: moment("1402/05/23 10:30", "jYYYY/jMM/jDD HH:mm").format(),
		description: "آغاز نوروز",
	},
	{
		id: 5,
		date: "2023-08-19",
		description: "روز طبیعت",
	},
]);
</script>
