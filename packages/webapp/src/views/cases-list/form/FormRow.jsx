import React from "react";
import classNames from "classnames";
import { FormItem } from "@/components/ui";

const FormRow = (props) => {
	const {
		label,
		children,
		invalid,
		errorMessage,
		border = true,
		alignCenter = true,
		asterisk = false,
	} = props;

	return (
		<div
			className={classNames(
				"grid md:grid-cols-3 gap-4 py-7",
				border && "border-b border-gray-200 dark:border-gray-600",
				alignCenter && "items-center"
			)}
		>
			<div className="font-semibold">
				{label}
				{asterisk ? <span className="text-red-500"> *</span> : null}
			</div>
			<div className="col-span-2">
				<FormItem
					className="mb-0 max-w-[700px]"
					invalid={invalid}
					errorMessage={errorMessage}
				>
					{children}
				</FormItem>
			</div>
		</div>
	);
};

export default FormRow;