import React from "react";
import _ from "lodash";
import { FormContainer, Select, Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { searchClient } from "@/services/client";
import AsyncSelect from "react-select/async";
import { searchUser } from "@/services/user";
import { FORM_LAYOUT, DEFAULT_PAGE_SIZE, PAGE } from "@/constants/app.constant";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

const Filters = (props) => {
  const { t } = useTranslation();
  const { getTableData, filterList } = props;

  const { control, reset, getValues, setValue } = useForm({
    defaultValues: {
      clientId: null,
      name: null,
      startDate: null,
      endDate: null,
    },
  });

  const handleOnClear = () => {
    reset();
    getTableData(PAGE, DEFAULT_PAGE_SIZE);
  };

  const handleChange = (field, value) => {
    setValue(field, value);
    const options = _.cloneDeep(getValues());
    options[field] = value;
    options.clientId = options.clientId?.value;
    options.regionId = options.regionId?.value;
    getTableData(PAGE, DEFAULT_PAGE_SIZE, options);
  };

  return (
    <FormContainer
      className={classNames("grid gap-2 mt-2 items-center", ...FORM_LAYOUT)}
    >
      <Controller
        control={control}
        name="regionId"
        render={({ field }) => (
          <Select
            {...field}
            onChange={(value) => handleChange("regionId", value)}
            isClearable
            placeholder={t("label.Search By Name")}
            cacheOptions
            options={filterList}
            // componentAs={AsyncSelect}
          />
        )}
      />

      <div>
        <Button size="sm" type="button" onClick={handleOnClear}>
          {t("button.Clear All")}
        </Button>
      </div>
    </FormContainer>
  );
};

export default Filters;
