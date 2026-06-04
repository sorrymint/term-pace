<script lang="ts">
	import BluePrintForm from '$lib/BluePrintForm.svelte';
	import SandboxForm from '$lib/SandboxForm.svelte';
	import {
		blueprintToEvents,
		type BlueprintInput,
		type CalendarEventInput
	} from '$lib/models/coursePlan';
	// @ts-expect-error: package does not currently ship TypeScript declarations
	import { Calendar, DayGrid, Interaction } from '@event-calendar/core';

	let sandboxMode = $state(false);
	let events = $state<CalendarEventInput[]>([]);

	function handleBlueprintSubmit(input: BlueprintInput): void {
		events = blueprintToEvents(input);
	}

	function handleEventDrop(info: { event: { id: string | number; start: Date | null } }): void {
		if (!info.event.start) {
			return;
		}
		const droppedDate = info.event.start;

		events = events.map((event) =>
			event.id === String(info.event.id)
				? {
						...event,
						start: droppedDate,
						extendedProps: {
							...event.extendedProps,
							dueDate: toDateString(droppedDate)
						}
					}
				: event
		);
	}

	function toDateString(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	let options = $state({
		view: 'dayGridMonth',
		eventStartEditable: true,
		eventDurationEditable: false,
		eventDrop: handleEventDrop,
		events: [] as CalendarEventInput[]
	});

	$effect(() => {
		options.events = events;
	});
</script>

<h1 class="p-2 text-2xl font-bold">Term Pace</h1>
<p class="pl-2 text-slate-600">Built to help you plan your classes assignments due dates.</p>
<div class="grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start">
	<div class="m-6">
		<div>
			<button
				class="border {sandboxMode ? '' : 'bg-gray-500 text-white'}"
				onclick={() => (sandboxMode = false)}
			>
				Blueprint Mode
			</button>
			<button
				class="border {sandboxMode ? 'bg-gray-500 text-white' : ''}"
				onclick={() => (sandboxMode = true)}
			>
				Sandbox Mode
			</button>
		</div>
		{#if !sandboxMode}
			<BluePrintForm onBlueprintSubmit={handleBlueprintSubmit} />
		{:else}
			<SandboxForm />
		{/if}
	</div>

	<div class="m-6 overflow-hidden border p-3">
		<Calendar plugins={[DayGrid, Interaction]} {options} />
	</div>
</div>

<div class="m-4">
	<h2 class="text-lg">Export schedule</h2>
	<button class="border p-2"> PDF </button>
	<button class="border p-2"> SpreedSheet (CSV) </button>
</div>
