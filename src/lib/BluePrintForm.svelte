<script lang="ts">
	import {
		ASSIGNMENT_TYPE_OPTIONS,
		type AssignmentTemplateInput,
		type BlueprintInput
	} from '$lib/models/coursePlan';

	type Props = {
		onBlueprintSubmit?: (input: BlueprintInput) => void;
	};

	let { onBlueprintSubmit }: Props = $props();

	let blueprint = $state<BlueprintInput>({
		startDate: '',
		endDate: '',
		moduleCount: 4,
		assignmentTemplates: [{ name: 'Assignment 1', type: 'project' }]
	});

	function addAssignmentTemplate(): void {
		const nextIndex = blueprint.assignmentTemplates.length + 1;
		blueprint.assignmentTemplates = [
			...blueprint.assignmentTemplates,
			{ name: `Assignment ${nextIndex}`, type: 'project' }
		];
	}

	function removeAssignmentTemplate(indexToRemove: number): void {
		// if (blueprint.assignmentTemplates.length <= 1) {
		// 	return;
		// }

		blueprint.assignmentTemplates = blueprint.assignmentTemplates.filter(
			(_, index) => index !== indexToRemove
		);
	}

	function handleSubmit(event: SubmitEvent): void {
		event.preventDefault();
		const cleanedTemplates = blueprint.assignmentTemplates
			.map((template: AssignmentTemplateInput) => ({
				name: template.name.trim(),
				type: template.type
			}))
			.filter((template) => template.name.length > 0);

		const safeModuleCount = Math.max(1, Math.floor(Number(blueprint.moduleCount) || 1));

		onBlueprintSubmit?.({
			...blueprint,
			moduleCount: safeModuleCount,
			assignmentTemplates:
				cleanedTemplates.length > 0 ? cleanedTemplates : [{ name: 'Assignment', type: 'project' }]
		});
	}
</script>

<form class="space-y-5 border p-3" onsubmit={handleSubmit}>
	<div class="grid gap-4 sm:grid-cols-2">
		<div>
			<label for="start-date">Start Date:</label>
			<input
				class="w-full"
				type="date"
				id="start-date"
				name="start-date"
				bind:value={blueprint.startDate}
				required
			/>
		</div>

		<div>
			<label for="end-date">End Date:</label>
			<input
				class="w-full"
				type="date"
				id="end-date"
				name="end-date"
				bind:value={blueprint.endDate}
				required
			/>
		</div>
	</div>

	<div>
		<div>
			<label for="modules">Modules:</label>
			<p class="text-xs text-slate-500">
				Units, Topics, or Sections. Will be used to multiply assignment.
			</p>
			<input
				class="w-full"
				type="number"
				id="modules"
				name="modules"
				min="1"
				bind:value={blueprint.moduleCount}
				required
			/>
		</div>
	</div>

	<div class="space-y-3 bg-slate-50 p-2">
		<div class="flex items-center justify-between">
			<h3>Assignments</h3>
		</div>
		<p class="text-xs text-slate-500">What assignments will be present in each module.</p>
		{#each blueprint.assignmentTemplates as template, index}
			<!--TODO make this a reusable component -->
			<div class="space-y-3 border bg-white p-2">
				<div>
					<label for={`assignment-name-${index}`}>Name: </label>
					<input
						class="w-full"
						type="text"
						id={`assignment-name-${index}`}
						bind:value={blueprint.assignmentTemplates[index].name}
						required
					/>
				</div>
				<div>
					<label for={`assignment-type-${index}`}>Type:</label>
					<select
						class="w-full"
						id={`assignment-type-${index}`}
						bind:value={blueprint.assignmentTemplates[index].type}
					>
						{#each ASSIGNMENT_TYPE_OPTIONS as assignmentType}
							<option value={assignmentType}>{assignmentType}</option>
						{/each}
					</select>
				</div>
				<div>
					<button
						class="border px-2 py-1"
						type="button"
						onclick={() => removeAssignmentTemplate(index)}
					>
						Remove
					</button>
					<button class="border px-2 py-1" type="button" onclick={addAssignmentTemplate}
						>+ Assignment</button
					>
				</div>
			</div>
		{/each}
	</div>

	<div class="bg-slate-50 p-2">
		<h3>Breaks</h3>
		<p class="text-xs text-slate-500">
			Enter any holidays or breaks you would like to schedule around.
		</p>
		<div class="grid gap-4 sm:grid-cols-2">
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
		<button class="border bg-slate-700 px-3 py-2 text-white" type="submit">Add to calendar</button>
	</div>
</form>
