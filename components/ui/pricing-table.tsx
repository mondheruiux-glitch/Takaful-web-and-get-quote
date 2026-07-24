import React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, LucideIcon, MinusIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function PricingTable({ className, style, ...props }: React.ComponentProps<'table'>) {
	return (
		<div
			data-slot="table-container"
			className="relative w-full overflow-x-auto"
		>
			<table
				className={cn('w-full text-sm border-none', className)}
				style={{ border: 'none', ...style }}
				{...props}
			/>
		</div>
	);
}

function PricingTableHeader({ ...props }: React.ComponentProps<'thead'>) {
	return <thead data-slot="table-header" {...props} />;
}

function PricingTableBody({
	className,
	...props
}: React.ComponentProps<'tbody'>) {
	return (
		<tbody
			data-slot="table-body"
			className={cn('[&_tr]:border-b-0', className)}
			{...props}
		/>
	);
}

function PricingTableRow({ className, style, ...props }: React.ComponentProps<'tr'>) {
	return (
		<tr
			data-slot="table-row"
			className={cn('border-none', className)}
			style={{ border: 'none', ...style }}
			{...props}
		/>
	);
}

function PricingTableCell({
	className,
	children,
	style,
	...props
}: React.ComponentProps<'td'> & { children: boolean | string | React.ReactNode }) {
	return (
		<td
			data-slot="table-cell"
			className={cn('align-middle text-center whitespace-nowrap text-white/80 border-none', className)}
			style={{ padding: 'calc(var(--spacing) * 6)', border: 'none', ...style }}
			{...props}
		>
			{children === true ? (
				<CheckIcon aria-hidden="true" className="size-4 text-[#00c685] mx-auto" />
			) : children === false ? (
				<MinusIcon
					aria-hidden="true"
					className="text-white/20 size-4 mx-auto"
				/>
			) : (
				children
			)}
		</td>
	);
}

function PricingTableHead({ className, style, ...props }: React.ComponentProps<'th'>) {
	return (
		<th
			data-slot="table-head"
			className={cn(
				'text-left align-middle font-medium whitespace-nowrap text-white/80 border-none',
				className,
			)}
			style={{ padding: 'calc(var(--spacing) * 6)', border: 'none', ...style }}
			{...props}
		/>
	);
}

function PricingTablePlan({
	name,
	badge,
	price,
	compareAt,
	icon: Icon,
	children,
	className,
	...props
}: React.ComponentProps<'div'> & PricingPlanType) {
	return (
		<div
			className={cn(
				'bg-[#0d1f17]/90 relative h-full overflow-hidden rounded-xl border border-white/10 p-4 font-normal text-left',
				className,
			)}
			{...props}
		>
			<div className="flex items-center gap-2">
				<div className="flex items-center justify-center rounded-full border border-white/10 p-1.5 bg-white/5">
					{Icon && <Icon className="h-3.5 w-3.5 text-white/70" />}
				</div>
				<h3 className="text-white font-semibold text-sm capitalize">{name}</h3>
				{badge && (
					<Badge
						variant="secondary"
						className="ml-auto rounded-full border border-white/10 bg-white/5 text-[10px] text-white/60 font-normal px-2 py-0.5"
					>
						{badge}
					</Badge>
				)}
			</div>

			<div className="mt-4 flex items-baseline gap-2">
				<span className="text-3xl font-extrabold font-mono text-white">{price}</span>
				{compareAt && (
					<span className="text-white/30 text-xs line-through">
						{compareAt}
					</span>
				)}
			</div>
			<div className="relative z-10 mt-4">{children}</div>
		</div>
	);
}

type PricingPlanType = {
	name: string;
	icon?: LucideIcon;
	badge?: string;
	price: string;
	compareAt?: string;
};

type FeatureValue = boolean | string;

type FeatureItem = {
	label: string;
	values: FeatureValue[];
};

export {
	type PricingPlanType,
	type FeatureValue,
	type FeatureItem,
	PricingTable,
	PricingTableHeader,
	PricingTableBody,
	PricingTableRow,
	PricingTableHead,
	PricingTableCell,
	PricingTablePlan,
};
