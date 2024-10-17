import React from "react";
import classNames from "classnames";
import { FormItem } from "@/components/ui";

const FormRow = (props) => {
  const {
    label,
    children,
    errors,
    name,
    border = true,
    alignCenter = true,
  } = props;

  const validators = {};

  if (errors && name) {
    validators.invalid = errors[name];
    validators.errorMessage = `${label} is required!`;
  }

  return (
    <div
      className={classNames(
        "grid md:grid-cols-3 gap-4 py-8",
        border && "border-b border-gray-200 dark:border-gray-600",
        alignCenter && "items-center"
      )}
    >
      <div className="font-semibold">{label}</div>
      <div className="col-span-2">
        <FormItem className="mb-0" {...validators}>
          {children}
        </FormItem>
      </div>
    </div>
  );
};

export default FormRow;
