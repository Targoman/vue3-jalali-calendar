<template>
	<jalaliCalendar
		:eventsList="events"
		:vacationsList="vacations"
		disablePastDays
		addEventButton
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
		startDateTime: moment("2023-03-06T13:37:41.020+00:00"),
		endDateTime: moment("2023-03-06T20:49:41.020+00:00"),
		title: "رویداد شماره ۱",
		color: "#29B6F6",
	},
	{
		startDateTime: moment("1401/12/13 13:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1401/12/14 15:30", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره 11",
		color: "#29B6F6",
	},
	{
		startDateTime: moment("1402/5/15 08:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1402/5/30 12:30", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره 12",
		color: "#29B6F6",
	},
	{
		startDateTime: moment("1402/05/24 10:00", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1402/05/28 11:30", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره 13",
		color: "#6256e5",
	},
	{
		startDateTime: moment("2023-03-06T13:37:41.020+00:00"),
		endDateTime: moment("2023-03-06T20:49:41.020+00:00"),
		title: "رویداد شماره 14",
		color: "#f5365c",
	},
	{
		startDateTime: moment("2023-03-06T13:37:41.020+00:00"),
		endDateTime: moment("2023-03-06T20:49:41.020+00:00"),
		title: "رویداد شماره 15",
		color: "#6256e5",
	},
	{
		startDateTime: moment("2023-03-06T13:37:41.020+00:00"),
		endDateTime: moment("2023-03-06T20:49:41.020+00:00"),
		title: "رویداد شماره 16",
		color: "#f5365c",
	},
	{
		startDateTime: moment("2023-03-06T13:37:41.020+00:00"),
		endDateTime: moment("2023-03-06T20:49:41.020+00:00"),
		title: "رویداد شماره 17",
		color: "#f5365c",
	},
	{
		startDateTime: moment("1402/05/23 10:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1402/05/23 15:00", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره ۲",
		color: "#29B6F6",
		classes: [],
	},
	{
		startDateTime: moment("1401/12/1 23:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1401/12/03 00:30", "jYYYY/jMM/jDD HH:mm"),
		title: "گفتگوی اسکایپی با مدیر شرکت آرمان",
		color: "#f5365c",
	},
	{
		startDateTime: moment("1401/12/09 10:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1401/12/13 14:00", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره ۳",
		color: "#f5365c",
		classes: [],
	},
	{
		startDateTime: moment("1401/12/06 10:30", "jYYYY/jMM/jDD HH:mm"),
		endDateTime: moment("1401/12/08 18:35", "jYYYY/jMM/jDD HH:mm"),
		title: "رویداد شماره ۴",
		color: "#29B6F6",
		classes: [],
	},
	{
		startDateTime: moment("1401/12/10", "jYYYY/jMM/jDD"),
		endDateTime: moment("1403/12/25", "jYYYY/jMM/jDD"),
		title: "گفتگوی اسکایپی با مدیر شرکت آرمان",
		color: "#6256e5",
		classes: [],
	},
]);
const vacations = ref([
	{
		date: moment("1402/05/23 10:30", "jYYYY/jMM/jDD HH:mm"),
		title: "آغاز نوروز",
	},
	{
		date: moment("1402/05/30", "jYYYY/jMM/jDD"),
		title: "روز طبیعت",
	},
]);
</script>
