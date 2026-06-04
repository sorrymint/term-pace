export interface BlueprintInput {
	startDate: string;
	endDate: string;
	moduleCount: number;
	assignmentTemplates: AssignmentTemplateInput[];
}

export interface AssignmentTemplateInput {
	name: string;
	type: AssignmentType;
}

export const ASSIGNMENT_TYPE_OPTIONS = [
	'quiz',
	'discussion',
	'essay',
	'lab',
	'project',
	'exam',
	'reading'
] as const;

export type AssignmentType = (typeof ASSIGNMENT_TYPE_OPTIONS)[number];

export interface CalendarEventInput {
	id: string;
	title: string;
	start?: string | Date;
	allDay: boolean;
	extendedProps: {
		moduleNumber: number;
		assignmentNumber: number;
		assignmentType: AssignmentType;
		dueDate: string | null;
	};
}

export function blueprintToEvents(input: BlueprintInput): CalendarEventInput[] {
	const moduleCount = Math.max(1, Math.floor(Number(input.moduleCount) || 1));
	const fallbackDate = input.startDate || undefined;

	const templates = input.assignmentTemplates
		.map((template) => ({
			name: template.name.trim(),
			type: template.type
		}))
		.filter((template) => template.name.length > 0);

	const effectiveTemplates =
		templates.length > 0 ? templates : [{ name: 'Assignment', type: 'project' as const }];

	return Array.from({ length: moduleCount }, (_, moduleIndex) => {
		const moduleNumber = moduleIndex + 1;
		return effectiveTemplates.map((template, assignmentIndex) => {
			const assignmentNumber = assignmentIndex + 1;
			return {
				id: `${moduleNumber}-${assignmentNumber}`,
				title: `M${moduleNumber} - ${template.name}`,
				start: fallbackDate,
				allDay: true,
				extendedProps: {
					moduleNumber,
					assignmentNumber,
					assignmentType: template.type,
					dueDate: null
				}
			};
		});
	}).flat();
}
