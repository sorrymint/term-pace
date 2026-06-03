<script>
	import { Calendar, TimeGrid, DayGrid } from '@event-calendar/core';

	let activeForm = $state('blueprint');

	let options = $state({
		view: 'dayGridMonth',
		events: [
			// your list of events
		]
	});
</script>

<h1 class="p-2 text-2xl font-bold">Term Pace</h1>
<p class="pl-2 text-slate-600">Built to help you plan your classes assignments due dates.</p>
<div class="grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start">
	<div class="m-6">
		<div>
			<button class="border" onclick={() => (activeForm = 'blueprint')}> Blueprint Mode </button>
			<button class="border" onclick={() => (activeForm = 'sandbox')}> Sandbox Mode </button>
		</div>
		{#if activeForm === 'blueprint'}
			<!-- TODO send this to a component -->
			<!-- Blueprint mode -->
			<form class="space-y-5 border p-3">
				<div>
					<label for="class">Class name:</label>
					<input class=" w-full" type="text" id="class" name="class" required />
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label for="start-date">Start Date:</label>
						<input class="w-full" type="date" id="start-date" name="start-date" required />
					</div>

					<div>
						<label for="end-date">End Date:</label>
						<input class=" w-full" type="date" id="end-date" name="end-date" required />
					</div>
				</div>

				<div>
					<label for="modules">Modules:</label>
					<input class="w-full" type="number" id="modules" name="modules" required />
				</div>

				<div class="bg-slate-50 p-2">
					<h3>Breaks</h3>
					<p class="text-xs text-slate-500">
						Enter any holidays or breaks you would like to schedule around.
					</p>
					<div class="grid gap-4 sm:grid-cols-2">
						<!-- TODO make this repeatable, so you can add multiple breaks -->
						<div>
							<label for="break-start">Start:</label>
							<input class="block w-full text-sm" type="date" id="break-start" name="break-start" />
						</div>
						<div>
							<label for="break-end">End:</label>
							<input class="block w-full text-sm" type="date" id="break-end" name="break-end" />
						</div>
					</div>
				</div>
				<div>
					<h3>Model Outline</h3>
					<p>Describe content of each module:</p>
					<!-- TODO: Implement model outline, needs to be a repeatable component -->
				</div>
			</form>
		{:else}
			<!-- Sandbox mode -->
			<form>
				<h3>Coming Soon...</h3>
			</form>
		{/if}
	</div>

	<div class="m-6 overflow-hidden border p-3">
		<Calendar plugins={[DayGrid]} {options} />
	</div>
</div>

<div class="m-4">
	<h2 class="text-lg">Export schedule</h2>
	<button class="border p-2"> PDF </button>
	<button class="border p-2"> SpreedSheet (CSV) </button>
</div>
